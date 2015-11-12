AccountsMerge = {
  onMergeRoutines: [],
  onMerge(fn, priority=false){
    if( priority ){
      AccountsMerge.onMergeRoutines.unshift(fn)
    } else {
      AccountsMerge.onMergeRoutines.push(fn)
    }
  }
}

Meteor.methods({

  // The newAccount will be merged into the oldAccount and the newAccount will
  // be marked as merged.
  mergeAccounts: function(oldAccountId){
    check(oldAccountId, String)

    // This method (mergeAccounts) is sometimes called an extra time (twice) if
    // the losing user is deleted from the DB using the AccountsMerge.onMerge
    // hook. The hook is executed before the loosing user has been logged
    // out and thus this.userId is null the second time this method is called.
    if( !this.userId ){
      return
    }

    // Get the old (winning) and new (losing) account details
    var oldAccount = Meteor.users.findOne({_id: oldAccountId})
    var newAccount = Meteor.users.findOne({_id: this.userId})

    // Get the names of the registered oauth services from the Accounts package
    _services = Accounts.oauth.serviceNames()

    // Move login services from loosing to winning user
    _services.map((service)=>{
      if( newAccount.services[service] ){
        // remove service from current user to avoid duplicate key error
        query = {}
        query[`services.${service}`] = ""
        try {
          Meteor.users.update({_id: Meteor.userId()}, {$unset: query})
        } catch(e){
          console.log('error', e.toString())
        }

        // add the service to the old account (we will log back in to this account later)
        query = {}
        query[`services.${service}`] = newAccount.services[service]
        try {
          Meteor.users.update({_id: oldAccountId}, {$set: query})
        } catch(e){
          console.log('error', e.toString())
        }
      }
    })

    // Mark the losing user as merged, and to which user it was merged with.
    // mergedWith holds the _id of the winning account.
    try {
      Meteor.users.update({_id: newAccount._id}, {$set: {mergedWith: oldAccountId}})
    } catch (e) {
      console.log('error', e.toString())
    }

    // look for any onMerge routines and run all of them
    oldAccount = Meteor.users.findOne(oldAccount._id)
    newAccount = Meteor.users.findOne(newAccount._id)
    AccountsMerge.onMergeRoutines.map((fn)=>{
      fn(oldAccount, newAccount)
    })

    return true
  }
})
