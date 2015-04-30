Package.describe({
  name: 'mikael:accounts-merge',
  version: '0.0.9',
  summary: 'Multiple login services for Meteor accounts',
  git: 'https://github.com/lirbank/meteor-accounts-merge.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0.3.1');
  api.use(['accounts-base'], 'client');
  api.use(['accounts-base'], 'server');
  api.addFiles('accounts-merge-server.js', 'server');
  api.addFiles('accounts-merge-client.js', 'client');
  api.export('AccountsMerge');
});
