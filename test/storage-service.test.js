var StorageService = require('../lib/storage-service.js');

var assert = require('assert');
var path = require('path');

var storageService = new StorageService({root: path.join(__dirname, 'storage'), provider: 'filesystem'});

describe('Storage service', function () {

  describe('container apis', function () {

    it('should return an empty list of containers', function (done) {
      storageService.getContainers(function (err, containers) {
        assert(!err);
        assert.equal(0, containers.length);
        done(err, containers);
      });
    });

    it('should create a new container', function (done) {
      storageService.createContainer({name: 'c1'}, function (err, container) {
        assert(!err);
        assert(container.getMetadata());
        done(err, container);
      });
    });

    it('should get a container c1', function (done) {
      storageService.getContainer('c1', function (err, container) {
        assert(!err);
        assert(container.getMetadata());
        done(err, container);
      });
    });

    it('should not get a container c2', function (done) {
      storageService.getContainer('c2', function (err, container) {
        assert(err);
        done(null, container);
      });
    });

    it('should return one container', function (done) {
      storageService.getContainers(function (err, containers) {
        assert(!err);
        assert.equal(1, containers.length);
        done(err, containers);
      });
    });

    it('should destroy a container c1', function (done) {
      storageService.destroyContainer('c1', function (err, container) {
        assert(!err);
        done(err, container);
      });
    });

    it('should not get a container c1 after destroy', function (done) {
      storageService.getContainer('c1', function (err, container) {
        assert(err);
        done(null, container);
      });
    });
  });

  describe('file apis', function () {
    var fs = require('fs');

    it('should create a new container', function (done) {
      storageService.createContainer({name: 'c1'}, function (err, container) {
        assert(!err);
        done(err, container);
      });
    });

    it('should upload a file', function (done) {
      var writer = storageService.uploadStream('c1', 'f1.txt');
      fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
      writer.on('finish', done);
      writer.on('error', done);
    });
    
    it('should emit success event', function (done) {
      var writer = storageService.uploadStream('c1', 'f1.txt');
      fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
      writer.on('success', done);
      writer.on('error', done);
    });

    it('should download a file', function (done) {
      var reader = storageService.downloadStream('c1', 'f1.txt');
      reader.pipe(fs.createWriteStream(path.join(__dirname, 'files/f1_downloaded.txt')));
      reader.on('end', done);
      reader.on('error', done);
    });

    it('should get files for a container', function (done) {
      storageService.getFiles('c1', function (err, files) {
        assert(!err);
        assert.equal(1, files.length);
        done(err, files);
      });
    });

    it('should get a file', function (done) {
      storageService.getFile('c1', 'f1.txt', function (err, f) {
        assert(!err);
        assert.ok(f);
        assert(f.getMetadata());
        done(err, f);
      });
    });

    it('should remove a file', function (done) {
      storageService.removeFile('c1', 'f1.txt', function (err) {
        assert(!err);
        done(err);
      });
    });

    it('should get no files from a container', function (done) {
      storageService.getFiles('c1', function (err, files) {
        assert(!err);
        assert.equal(0, files.length);
        done(err, files);
      });
    });

    it('should destroy a container c1', function (done) {
      storageService.destroyContainer('c1', function (err, container) {
        // console.error(err);
        assert(!err);
        done(err, container);
      });
    });

  });
});


