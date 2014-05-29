Meteor.methods({

  // The newAccount will be merged into the oldAccount and the newAccount will be deleted.
  mergeAccounts: function (oldAccountId) {

    // mergeAccounts is for some reason called twice if the user does not take it slow when adding
    // new login services. The second time it's called, the user is already logging out so
    // this.userId (and Meteor.userId() too) is null. Not sure why it's called twice, but this conditional
    // fix the crashing.
    if(! this.userId ) {
      return;
    }

    // Get the old account details
    var oldAccount = Meteor.users.findOne(oldAccountId);
    var newAccount = Meteor.users.findOne(this.userId);

    _services = [ "facebook", "twitter", "google", "linkedin", "github" ];

    for (i=0; i<_services.length; i++) {

      if( newAccount.services[_services[i]] ) {

        // Remove service from current user to avoid duplicate key error
        query = {};
        query['services.'+_services[i]] = "";
        try {
          Meteor.users.update (Meteor.userId(), {
            $unset: query
          });

        } catch (e) {
          console.log('error', e.toString());
        }

        // Add the service to the old account (we will log back in to this account later)
        // Also add the profile.name from the new service
        query = {};
        query['services.'+_services[i]] = newAccount.services[_services[i]];
        query['profile.name'] = newAccount.profile.name;
        try {
          Meteor.users.update (oldAccountId, {
            $set: query
          });

        } catch (e) {
          console.log('error', e.toString());
        }

        // Handle guest users.
        // When a user with a (one or more) login service(s) is merged with a guest, then the guest is not a guest anymore!
        // + Remove the guest flag (so it's not deleted by the guest clean up script)
        // + Remove the password service (will need look into making accounts-merge compatible with accounts-password later...)
        /*
        try {
          Meteor.users.update (oldAccountId, {$unset: {"profile.guest": ""}});

        } catch (e) {
          console.log('error', e.toString());
        }
        */
      }
    }
    // Remove the current user
    Meteor.users.remove(newAccount._id);

    return true;
  }
});
