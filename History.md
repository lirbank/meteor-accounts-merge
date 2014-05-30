## v0.0.5
* Addad Github login service

## v0.0.4
* Improved re-login.
* **WARNING:** The callback is now called with a string holding the userId of the loosing/deleted user. This used to be an object with both the winner and looser userIds, but it's not needed anymore as the improved re-login allows you to call Meteor.userId() directly in your code. This update will break your code.

## v0.0.3
* Added support for [accounts-linkedin](https://atmospherejs.com/package/accounts-linkedin)

## v0.0.2
* Initial public launch
