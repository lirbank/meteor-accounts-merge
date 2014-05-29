Meteor.signInWithFacebook = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithFacebook', options, callback);
};

Meteor.signInWithTwitter = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithTwitter', options, callback);
};

Meteor.signInWithGoogle = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithGoogle', options, callback);
};

Meteor.signInWithLinkedin = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithLinkedin', options, callback);
};

Meteor.signInWithGithub = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithGithub', options, callback);
};

Meteor.signInWithExternalService = function (service, options, callback) {

  var oldUserId = Meteor.userId();
  var oldLoginToken = Accounts._storedLoginToken();

  Meteor[service]( function (error) {

    if (error) {
      if (typeof callback === 'function') callback (error);
      return;
    }

    var newUserId = Meteor.userId();

    // Not logged in, logging in now.
    if (!oldUserId) {
      if (typeof callback === 'function') callback ();
      return;
    }

    // Login service has already been added, just logging in
    if (newUserId == oldUserId) {
      if (typeof callback === 'function') callback ();
      return;
    }

    // Adding the new login service
    Meteor.call ('mergeAccounts', oldUserId, function (error, result) {

      if (error) {
        if (typeof callback === 'function') callback (error);
        return;
      }

      // Log out the source user
      Meteor.logout ( function (error) {

        if (error) {
          if (typeof callback === 'function') callback (error);
          return;
        }

        // Log back in as the original (destination) user
        Meteor.loginWithToken( oldLoginToken, function (error) {
          if (error) {
            if (typeof callback === 'function') callback (error);
            return;
          }
          if (typeof callback === 'function') callback (undefined, newUserId);
        });
      });
    });
  });
};
