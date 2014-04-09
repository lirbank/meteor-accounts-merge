accounts-merge
=====================

Multiple login services for Meteor accounts - enable your users to login to the same account using any login service.



##  Installation

To enable merging of accounts, add the `accounts-merge` package and at least one login provider package: `accounts-facebook`, `accounts-github`, `accounts-google`, `accounts-meetup`, `accounts-twitter` or `accounts-weibo`.

Make sure you have [Meteorite](https://github.com/oortcloud/meteorite/) installed, from inside a Meteorite-managed app run:
``` sh
$ meteor add accounts-facebook accounts-google accounts-twitter
$ mrt add accounts-merge
```

## Example
See this [example implementation](https://github.com/lirbank/meteor-accounts-merge-example) to get started.

## Usage

To use accounts-merge, simply use Meteor.signInWithGoogle() instead of Meteor.loginWithGoogle(). The new thing to notice is that the callback for signInWithGoogle() is called with two arguments, `error` and `mergedUsers`, while the callback for loginWithGoogle() is only called with a single `error` argument.

```javascript
Meteor.signInWithGoogle ({}, function (error, mergedUsers) {

	// mergedUsers is set if a merge occured
	if (mergedUsers) {
		console.log('mergedUsers', mergedUsers);

		// The source account (mergedUsers.sourceUserId) has now been deleted, so this is your chance
		// to deal with you application specific DB items to avoid ending up with orphans. You'd typically
		// want to change owner on the items beloning to the deleted user, or simply delete them.
		Meteor.call ('mergeItems', mergedUsers.sourceUserId, mergedUsers.destinationUserId, function (error, result) {
		});
	}
});
// Meteor.signInWithFacebook();
// Meteor.signInWithTwitter();
```

## Todo
* Add support for accounts-github
* Test with accounts-password (will it work as-is?)
* Add support for accounts-meetup
* Add support for accounts-weibo
* Add support for accounts-password
* Add back guest users (temporarily removed)
* Add support for {{loggingIn}}
