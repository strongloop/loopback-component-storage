var StorageService = require('../').StorageService;
var path = require('path');

var rs = StorageService({
    provider: 'rackspace',
    username: 'strongloop',
    apiKey: 'a51076644fc37583bd87dd648b58777e'
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


var s3 = StorageService({
    provider: 'amazon',
    key: '+Y5mivLY+bqneQttRwXoIkqKxyBvIKMr0bFTht3r',
    keyId: 'AKIAI7F2SZAWNCTPNVYA'
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


var fs = require('fs');
var path = require('path');
var stream = s3.uploadStream('con1','test.jpg');
var input = fs.createReadStream(path.join(__dirname, 'test.jpg')).pipe(stream);


var local = StorageService({
    provider: 'filesystem',
    root: path.join(__dirname, 'storage')
});

// Container

local.getContainers(function (err, containers) {
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

