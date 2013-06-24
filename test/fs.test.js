var FileSystemProvider = require('../lib/providers/file.js');

var assert = require('assert');
var path = require('path');

describe('FileSystem based storage provider', function () {

    var client = null;
    it('should require an existing directory as the root', function (done) {
        client = new FileSystemProvider({root: path.join(__dirname, 'storage')});
        process.nextTick(done);
    });

    var client = null;
    it('should complain if the root directory doesn\'t exist', function (done) {
        try {
            client = new FileSystemProvider({root: path.join(__dirname, '_storage')});
            process.nextTick(done.bind(null, 'Error'));
        } catch (err) {
            // Should be here
            process.nextTick(done);
        }
    });

    it('should return an empty list of containers', function (done) {
        client.getContainers(function (err, containers) {
            assert(!err);
            assert.equal(0, containers.length);
            done(err, containers);
        });
    });

    it('should create a new container', function (done) {
        client.createContainer({name: 'c1'}, function (err, container) {
            assert(!err);
            done(err, container);
        });
    });

    it('should get a container c1', function (done) {
        client.getContainer('c1', function (err, container) {
            assert(!err);
            done(err, container);
        });
    });

    it('should not get a container c2', function (done) {
        client.getContainer('c2', function (err, container) {
            assert(err);
            done(null, container);
        });
    });

    it('should return one container', function (done) {
        client.getContainers(function (err, containers) {
            assert(!err);
            assert.equal(1, containers.length);
            done(err, containers);
        });
    });

    it('should destroy a container c1', function (done) {
        client.destroyContainer('c1', function (err, container) {
            assert(!err);
            done(err, container);
        });
    });

    it('should not get a container c1 after destroy', function (done) {
        client.getContainer('c1', function (err, container) {
            assert(err);
            done(null, container);
        });
    });
});

