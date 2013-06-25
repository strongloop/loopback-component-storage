var storage = require('pkgcloud').storage;

var client = storage.createClient({
    provider: 'rackspace',
    username: 'strongloop',
    apiKey: 'your-rackspace-api-key'
});

// Container

client.getContainers(function (err, containers) {
    containers.forEach(function(c) {
       console.log(c.name);
    });
});

/*
 client.createContainer(options, function (err, container) { });
 client.destroyContainer(containerName, function (err) { });
 client.getContainer(containerName, function (err, container) { });

 // File

 client.upload(options, function (err) { });
 client.download(options, function (err) { });
 client.getFiles(container, function (err, files) { });
 client.getFile(container, file, function (err, server) { });
 client.removeFile(container, file, function (err) { });
 */


var s3 = storage.createClient({
    provider: 'amazon',
    key: 'your-amazon-key',
    keyId: 'your-amazon-key-id'
});

s3.getContainers(function (err, containers) {
    if(err) {
        console.error(err);
        return;
    }
    containers.forEach(function(c) {
        console.log(c.name);
    });
});
