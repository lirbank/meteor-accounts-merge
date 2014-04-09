Meteor.signInWithFacebook = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithFacebook', options, callback);
};

Meteor.signInWithTwitter = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithTwitter', options, callback);
};

Meteor.signInWithGoogle = function (options, callback) {
  Meteor.signInWithExternalService ('loginWithGoogle', options, callback);
};

Meteor.signInWithExternalService = function (service, options, callback) {

  oldUserId = Meteor.userId();
  oldLoginToken = localStorage.getItem('Meteor.loginToken');

  Meteor[service]( function (error) {

    if (error) {
      if (typeof callback === 'function') callback (error);
      return;
    }

    newUserId = Meteor.userId();

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
        localStorage.setItem('Meteor.userId', oldUserId);
        localStorage.setItem('Meteor.loginToken', oldLoginToken);

        // Return the userId of the deleted user as the result in the callback
        //   We must send both sourceUserId AND destinationUserId with the callback since no user will be logged in
        //   for a short period of time here. If we could wait for the login to complete before running the callback
        //   we would not have to send back the destinationUserId, since it will be available from Meteor.userId().
        if (typeof callback === 'function') callback (undefined, {'sourceUserId':newUserId, 'destinationUserId':oldUserId});
      });
    });
  });
};
