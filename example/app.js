var storage = require('../lib/index');
var path = require('path');

var rs = storage.createClient({
    provider: 'rackspace',
    username: 'strongloop',
    apiKey: 'your-rackspace-api-key'
});

// Container

rs.getContainers(function (err, containers) {
    if (err) {
        console.error(err);
        return;
    }
    containers.forEach(function (c) {
        console.log('rackspace: ', c.name);
        c.getFiles(function (err, files) {
            files.forEach(function (f) {
                console.log('....', f.name);
            });
        });
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
    if (err) {
        console.error(err);
        return;
    }
    containers.forEach(function (c) {
        console.log('amazon: ', c.name);
        c.getFiles(function (err, files) {
            files.forEach(function (f) {
                console.log('....', f.name);
            });
        });
    });
});

var fs = storage.createClient({
    provider: 'filesystem',
    root: path.join(__dirname, 'storage')
});

// Container

fs.getContainers(function (err, containers) {
    if (err) {
        console.error(err);
        return;
    }
    containers.forEach(function (c) {
        console.log('filesystem: ', c.name);
        c.getFiles(function (err, files) {
            files.forEach(function (f) {
                console.log('....', f.name);
            });
        });
    });
});
