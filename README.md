accounts-merge
=====================
Multiple login services for Meteor accounts - enable your users to login to the same account using any login service.

## Use case
You decided to allow your users to sign in to your Meteor app with Google, Facebook and Twitter. A user visits your site/app and sign in with Facebook. After enjoying your app for a bit the user leaves and doesn't come back until a week later. The user now can't remeber which login service he/she signed up with and tries to login with Twitter. Now the user has two separate accounts, one for Twitter and one for Facebook. Since the new account is empty the user realize the error and click on the Facebook login. With accounts-merge the two accounts are now merged and in the future the user can sign in to its account using either Facebook or Twitter.

The user can even start two separate accounts, for example one with Google and Twitter and one with only Facebook, and populate both accounts with data. When ever the user is logged in to one of the accounts and decide to sign in to the other account, the accounts are merged and all data from both accounts can be retained/merged.

## Example
See this [example implementation](https://github.com/lirbank/meteor-accounts-merge-example) to get started.

##  Installation
To enable merging of accounts, add the `accounts-merge` package and at least one login provider package: `accounts-facebook`, `accounts-github`, `accounts-google`, `accounts-meetup`, `accounts-twitter` or `accounts-weibo`.

Make sure you have [Meteorite](https://github.com/oortcloud/meteorite/) installed, from inside a Meteorite-managed app run:
``` sh
$ meteor add accounts-facebook accounts-google accounts-twitter
$ mrt add accounts-merge
```

## Usage
To use accounts-merge, simply use Meteor.signInWithGoogle() instead of Meteor.loginWithGoogle(). The new thing to notice is that the callback for signInWithGoogle() is called with two arguments, `error` and `mergedUsers`, while the callback for loginWithGoogle() is only called with a single `error` argument.

```javascript
// ON THE CLIENT:
Meteor.signInWithGoogle ({}, function (error, mergedUsers) {

  // mergedUsers is set if a merge occured
  if (mergedUsers) {
    console.log('mergedUsers', mergedUsers);

    // The source account (mergedUsers.sourceUserId) has now been deleted, so this is your chance
    // to deal with you application specific DB items to avoid ending up with orphans. You'd typically
    // want to change owner on the items beloning to the deleted user, or simply delete them.
    Meteor.call ('mergeItems', mergedUsers.sourceUserId, mergedUsers.destinationUserId, function (error, result) {
      // Do something
    });
  }
});
// Meteor.signInWithFacebook();
// Meteor.signInWithTwitter();
```


```javascript
// ON THE SERVER:
Meteor.methods({
  mergeItems: function (sourceUserId, destinationUserId) {
  
    // Update you application specific collection
    Items.update (
      {"owner":sourceUserId}, 
      {$set: {"owner": destinationUserId}}, 
      {"multi": true}
    );
  }
});
```

## Todo
* Add support for accounts-github
* Test with accounts-password (will it work as-is?)
* Add support for accounts-meetup
* Add support for accounts-weibo
* Add support for accounts-password
* Add back guest users (temporarily removed)
* Add support for {{loggingIn}}
