accounts-merge
=====================

Multiple login services for Meteor accounts - enable your users to login to the same account using any login service.



##  Installation

To enable merging of accounts, add the `accounts-merge` package and at least one login provider package: `accounts-facebook`, `accounts-github`, `accounts-google`, `accounts-meetup`, `accounts-twitter` or `accounts-weibo`.

Make sure you have [Meteorite](https://github.com/oortcloud/meteorite/), from inside a Meteorite-managed app run:
``` sh
$ meteor add accounts-facebook accounts-google accounts-twitter
$ mrt add accounts-merge
```

