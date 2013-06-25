var FileSystemProvider = require('../lib/providers/filesystem/index.js');

var assert = require('assert');
var path = require('path');

describe('FileSystem based storage provider', function () {

    describe('container apis', function () {
        var client = null;
        it('should require an existing directory as the root', function (done) {
            client = new FileSystemProvider({root: path.join(__dirname, 'storage')});
            process.nextTick(done);
        });

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

    describe('file apis', function () {
        var fs = require('fs');
        var client = new FileSystemProvider({root: path.join(__dirname, 'storage')});

        it('should create a new container', function (done) {
            client.createContainer({name: 'c1'}, function (err, container) {
                assert(!err);
                done(err, container);
            });
        });

        it('should upload a file', function (done) {
            var writer = client.upload({container: 'c1', remote: 'f1.txt'});
            fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
            writer.on('finish', done);
            writer.on('error', done);
        });

        it('should download a file', function (done) {
            var reader = client.download({
                container: 'c1',
                remote: 'f1.txt'
            });
            reader.pipe(fs.createWriteStream(path.join(__dirname, 'files/f1_downloaded.txt')));
            reader.on('end', done);
            reader.on('error', done);
        });

        it('should get files for a container', function (done) {
            client.getFiles('c1', function (err, files) {
                assert(!err);
                assert.equal(1, files.length);
                done(err, files);
            });
        });

        it('should get a file', function (done) {
            client.getFile('c1', 'f1.txt', function (err, f) {
                assert(!err);
                assert.ok(f);
                done(err, f);
            });
        });

        it('should remove a file', function (done) {
            client.removeFile('c1', 'f1.txt', function (err) {
                assert(!err);
                done(err);
            });
        });

        it('should get no files from a container', function (done) {
            client.getFiles('c1', function (err, files) {
                assert(!err);
                assert.equal(0, files.length);
                done(err, files);
            });
        });

        it('should destroy a container c1', function (done) {
            client.destroyContainer('c1', function (err, container) {
                // console.error(err);
                assert(!err);
                done(err, container);
            });
        });

    });
});


