# Accounts Merge
## forked from [mikael:accounts-merge](https://github.com/lirbank/meteor-accounts-merge)
----

Multiple login services for Meteor accounts - enable your users to login to the same account using any login service.

## Use case
You decided to allow your users to sign in to your Meteor app with Google, Facebook and Twitter. A user visits your site/app and sign in with Facebook. After enjoying your app for a bit the user leaves and doesn't come back until a week later. The user now can't remeber which login service he/she signed up with and tries to login with Twitter. Now the user has two separate accounts, one for Twitter and one for Facebook. Since the new account is empty the user realize the error and click on the Facebook login. With accounts-merge the two accounts are now merged and in the future the user can sign in to its account using either Facebook or Twitter.

The user can even start two separate accounts, for example one with Google and Twitter and one with only Facebook, and populate both accounts with data. When ever the user is logged in to one of the accounts and decide to sign in to the other account, the accounts are merged and all data from both accounts can be retained/merged.

## Example

See this [example implementation](https://github.com/lirbank/meteor-accounts-merge-example) to get started.

## Installation
To enable merging of accounts, add the `mikael:accounts-merge` package and at least one login provider package: `accounts-facebook`, `accounts-github`, `accounts-google`, `accounts-meetup`, `accounts-twitter`, `accounts-weibo`, etc., ex:

``` sh
$ meteor add accounts-facebook accounts-google accounts-twitter
$ meteor add mikael:accounts-merge
```

## Upgrade
Before upgrading, check the [changelog](https://github.com/lirbank/meteor-accounts-merge/blob/master/History.md) for breaking changes. Then run:
``` sh
$ meteor update mikael:accounts-merge
```

## Usage
To use accounts-merge, simply use Meteor.signInWithGoogle() instead of Meteor.loginWithGoogle(). The thing to notice is the callback for signInWithGoogle() is now called with two arguments, `error` and `mergedUserId` (the callback for loginWithGoogle() is only called with a single `error` argument).

```javascript
// ON THE CLIENT:
Meteor.signInWithGoogle ({}, function (error, mergedUserId) {

  // mergedUsers is set if a merge occured
  if (mergedUserId) {
    console.log(mergedUserId, 'merged with', Meteor.userId());
  }
});
// Meteor.signInWithFacebook({}, callback);
// Meteor.signInWithTwitter({}, callback);
```

```javascript
// ON THE SERVER (optional):
AccountsMerge.onMerge(function(winner, loser){
  // Update application specific collections, eg.
  Items.update (
    {"owner": loser._id},
    {$set: {"owner": winner._id}},
    {"multi": true}
  );

  // If you use something like accounts-guest, you can handle the guest
  // users here. Eg. when a user with a (one or more) login service(s)
  // is merged with a guest, then the guest is not a guest anymore!
  Meteor.users.update (
    winner._id,
    {$unset: {"profile.guest": ""}}
  );

  // Remove the merged (losing) user from the DB
  Meteor.users.remove(loser._id);
}, [priority=true/false])

// NOTE: setting "priority" will make your function run first
// if there are multiple routines.  multiple "priority" merge routines
// will be run LIFO
```

## Todo
* Test with accounts-password (will it work as-is?)
* Add support for accounts-password
* Add support for {{loggingIn}}

## License
The MIT License (MIT) (c) Airlab.io

Accounts Merge was developed as part of the [Domain List](http://domainlist.io/) project.
