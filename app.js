var storage = require('pkgcloud').storage;

var client = storage.createClient({
    provider: 'rackspace',
    username: 'your-user-name',
    apiKey: 'your-api-key'
  });

// Container

client.getContainers(function (err, containers) { });
client.createContainer(options, function (err, container) { });
client.destroyContainer(containerName, function (err) { });
client.getContainer(containerName, function (err, container) { });

// File

client.upload(options, function (err) { });
client.download(options, function (err) { });
client.getFiles(container, function (err, files) { });
client.getFile(container, file, function (err, server) { });
client.removeFile(container, file, function (err) { });
