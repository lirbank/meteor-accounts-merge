AccountsMerge = {};

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function createMethodForService(service) {
  // Capitalize the first letter of the service name
  var serviceName = capitalizeWord(service);

  // Register a meteor method for this service
  Meteor['signInWith' + serviceName] = function (options, callback) {
    Meteor.signInWithExternalService ('loginWith' + serviceName, options, callback);
  };
}

Meteor.startup(function () {

  // Do nothing if no accounts packages with oauth are loaded
  if (typeof Accounts !== 'object' || ! Accounts.oauth) {
    return;
  }

  // Get the names of the registered oauth services from the Accounts package
  var services = Accounts.oauth.serviceNames();

  // Create a meteor method for each service
  _.each(services, createMethodForService);
});

AccountsMerge.saveDataBeforeOAuth = function(userId, authToken){
  Reload._onMigrate('accounts-merge', function () {
    return [true, {userId: userId, authToken: authToken}];
  });
};

AccountsMerge.getDataAfterOAuth = function(){
  return Reload._migrationData('accounts-merge');
};

function mergePreviousAccountOnOAuthComplete(error){
  if (error) {
    if (typeof callback === 'function') callback (error);
    return;
  }

  var oldUser = AccountsMerge.getDataAfterOAuth();
  var newUserId = Meteor.userId();

  // Not logged in, logging in now.
  if (!oldUser.userId) {
    if (typeof callback === 'function') callback ();
    return;
  }

  // Login service has already been added, just logging in
  if (newUserId == oldUser.userId) {
    if (typeof callback === 'function') callback ();
    return;
  }

  // Adding the new login service
  Meteor.call ('mergeAccounts', oldUser.userId, function (error, result) {

    if (error) {
      if (typeof callback === 'function') callback (error);
      return;
    }

    // Log back in as the original (destination) user
    Meteor.loginWithToken(oldUser.authToken, function (error) {
      if (error) {
        if (typeof callback === 'function') callback (error);
        return;
      }
      if (typeof callback === 'function') callback (undefined, newUserId);
    });
  });
};

Meteor.signInWithExternalService = function (service, options, callback) {

  var oldUserId = Meteor.userId();
  var oldLoginToken = Accounts._storedLoginToken();

  AccountsMerge.saveDataBeforeOAuth(oldUserId, oldLoginToken);

  // callback is called if oauth used popup style
  Meteor[service](options, mergePreviousAccountOnOAuthComplete);
};

// this method is supposed to be called after an oauth redirect
Accounts.onLogin(mergePreviousAccountOnOAuthComplete);
