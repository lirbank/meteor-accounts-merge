Package.on_use(function (api) {
  api.use(['accounts-base'], 'client');
  api.use(['accounts-base'], 'server');
  api.add_files('accounts-merge-server.js', 'server');
  api.add_files('accounts-merge-client.js', 'client');
});
