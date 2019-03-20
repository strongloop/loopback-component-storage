// Copyright IBM Corp. 2013,2015. All Rights Reserved.
// Node module: loopback-component-storage
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
'use strict';

var StorageService = require('../lib/storage-service.js');

var assert = require('assert');
var path = require('path');

var storageService = new StorageService({
  root: path.join(__dirname, 'storage'),
  provider: 'filesystem',
});

describe('Storage service', function() {
  describe('container apis', function() {
    it('should return an empty list of containers', function(done) {
      storageService.getContainers(function(err, containers) {
        assert(!err);
        assert.equal(containers.length, 0);
        done(err, containers);
      });
    });

    it('should return an empty list of containers - promise', function(done) {
      storageService.getContainers()
        .then(function(containers) {
          assert.equal(containers.length, 0);
          done();
        })
        .catch(done);
    });

    it('should create a new container', function(done) {
      storageService.createContainer({name: 'c1'}, function(err, container) {
        assert(!err);
        assert(container.getMetadata());
        done(err, container);
      });
    });

    it('should create a new container - promise', function(done) {
      storageService.createContainer({name: 'c3'})
        .then(function(container) {
          assert(container.getMetadata());
          done();
        })
        .catch(done);
    });

    it('should get a container c1', function(done) {
      storageService.getContainer('c1', function(err, container) {
        assert(!err);
        assert(container.getMetadata());
        done(err, container);
      });
    });

    it('should get a container c1 - promise', function(done) {
      storageService.getContainer('c1')
        .then(function(container) {
          assert(container.getMetadata());
          done();
        })
        .catch(done);
    });

    it('should not get a container c2', function(done) {
      storageService.getContainer('c2', function(err, container) {
        assert(err);
        done(null, container);
      });
    });

    it('should destroy a container c3 - promise', function(done) {
      storageService.destroyContainer('c3')
        .then(function(container) {
          done(null, container);
        })
        .catch(done);
    });

    it('should return one container', function(done) {
      storageService.getContainers(function(err, containers) {
        assert(!err);
        assert.equal(containers.length, 1);
        done(err, containers);
      });
    });

    it('should destroy a container c1', function(done) {
      storageService.destroyContainer('c1', function(err, container) {
        assert(!err);
        done(err, container);
      });
    });

    it('should not get a container c1 after destroy', function(done) {
      storageService.getContainer('c1', function(err, container) {
        assert(err);
        done(null, container);
      });
    });
  });

  describe('file apis', function() {
    var fs = require('fs');

    it('should create a new container', function(done) {
      storageService.createContainer({name: 'c1'}, function(err, container) {
        assert(!err);
        done(err, container);
      });
    });

    it('should upload a file', function(done) {
      var writer = storageService.uploadStream('c1', 'f1.txt');
      fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
      writer.on('finish', done);
      writer.on('error', done);
    });

    it('should emit success event', function(done) {
      var writer = storageService.uploadStream('c1', 'f1.txt');
      fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
      writer.on('success', done);
      writer.on('error', done);
    });

    it('should download a file', function(done) {
      var reader = storageService.downloadStream('c1', 'f1.txt');
      reader.pipe(fs.createWriteStream(path.join(__dirname, 'files/f1_downloaded.txt')));
      reader.on('end', done);
      reader.on('error', done);
    });

    it('should get files for a container', function(done) {
      storageService.getFiles('c1', function(err, files) {
        assert(!err);
        assert.equal(files.length, 1);
        done(err, files);
      });
    });

    it('should get files for a container - promise', function(done) {
      storageService.getFiles('c1')
        .then(function(files) {
          assert.equal(files.length, 1);
          done();
        })
        .catch(done);
    });

    it('should get a file', function(done) {
      storageService.getFile('c1', 'f1.txt', function(err, f) {
        assert(!err);
        assert.ok(f);
        assert(f.getMetadata());
        done(err, f);
      });
    });

    it('should get a file - promise', function(done) {
      storageService.getFile('c1', 'f1.txt')
        .then(function(f) {
          assert.ok(f);
          assert(f.getMetadata());
          done();
        })
        .catch(done);
    });

    it('should remove a file', function(done) {
      storageService.removeFile('c1', 'f1.txt', function(err) {
        assert(!err);
        done(err);
      });
    });

    it('should remove a file - promise', function(done) {
      createFile('c1', 'f1.txt')
        .then(function() {
          return storageService.removeFile('c1', 'f1.txt')
            .then(function() {
              done();
            });
        })
        .catch(done);
    });

    it('should get no files from a container', function(done) {
      storageService.getFiles('c1', function(err, files) {
        assert(!err);
        assert.equal(files.length, 0);
        done(err, files);
      });
    });

    it('should not get a file from a container', function(done) {
      storageService.getFile('c1', 'f1.txt', function(err, f) {
        assert(err);
        assert.equal(err.code, 'ENOENT');
        assert.equal(err.status, 404);
        assert(!f);
        done();
      });
    });

    it('should not get a file from a container - promise', function(done) {
      storageService.getFile('c1', 'f1.txt')
        .then(function() {
          throw new Error('should not be throw');
        })
        .catch(function(err) {
          assert.equal(err.code, 'ENOENT');
          assert.equal(err.status, 404);
          done();
        });
    });

    it('should destroy a container c1', function(done) {
      storageService.destroyContainer('c1', function(err, container) {
        assert(!err);
        done(err, container);
      });
    });

    function createFile(container, file) {
      return new Promise(function(resolve, reject) {
        var writer = storageService.uploadStream(container, file);
        fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    }
  });
});
