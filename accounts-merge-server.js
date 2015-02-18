AccountsMerge = {};

Meteor.methods({

  // The newAccount will be merged into the oldAccount and the newAccount will
  // be marked as merged.
  mergeAccounts: function (oldAccountId) {
    check(oldAccountId, String);

    // This method (mergeAccounts) is sometimes called an extra time (twice) if
    // the losing user is deleted from the DB using the AccountsMerge.onMerge
    // hook. The hook is executed before the loosing user has been logged
    // out and thus this.userId is null the second time this method is called.
    if(! this.userId ) {
      return;
    }

    // Get the old (winning) and new (losing) account details
    var oldAccount = Meteor.users.findOne(oldAccountId);
    var newAccount = Meteor.users.findOne(this.userId);

    _services = [ "facebook", "twitter", "google", "linkedin", "github", "vk" ];

    // Move login services from loosing to winning user
    for (i=0; i<_services.length; i++) {

      if( newAccount.services[_services[i]] ) {

        // Remove service from current user to avoid duplicate key error
        query = {};
        query['services.'+_services[i]] = "";
        try {
          Meteor.users.update (Meteor.userId(), {$unset: query});
        } catch (e) {
          console.log('error', e.toString());
        }

        // Add the service to the old account (we will log back in to this
        // account later).
        // Also add the profile.name from the new service.
        query = {};
        query['services.'+_services[i]] = newAccount.services[_services[i]];
        query['profile.name'] = newAccount.profile.name;
        try {
          Meteor.users.update (oldAccountId, {$set: query});
        } catch (e) {
          console.log('error', e.toString());
        }
      }
    }
    // Mark the losing user as merged, and to which user it was merged with.
    // mergedWith holds the _id of the winning account.
    try {
      Meteor.users.update(newAccount._id, {$set: {mergedWith: oldAccountId}});
    } catch (e) {
      console.log('error', e.toString());
    }

    // Run the server side onMerge() hook if it exists.
    if (AccountsMerge.onMerge) {
      oldAccount = Meteor.users.findOne(oldAccount._id);
      newAccount = Meteor.users.findOne(newAccount._id);
      AccountsMerge.onMerge(oldAccount, newAccount);
    }

    return true;
  }
});
