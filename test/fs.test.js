// Copyright IBM Corp. 2013,2014. All Rights Reserved.
// Node module: loopback-component-storage
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
'use strict';

var FileSystemProvider = require('../lib/providers/filesystem/index.js').Client;

var assert = require('assert');
var path = require('path');

function verifyMetadata(fileOrContainer, name) {
  assert(fileOrContainer.getMetadata());
  assert.equal(fileOrContainer.getMetadata().name, name);
  assert(fileOrContainer.getMetadata().uid === undefined);
  assert(fileOrContainer.getMetadata().gid === undefined);
  assert(fileOrContainer.getMetadata().atime);
  assert(fileOrContainer.getMetadata().ctime);
  assert(fileOrContainer.getMetadata().mtime);
  assert.equal(typeof fileOrContainer.getMetadata().size, 'number');
}

describe('FileSystem based storage provider', function() {
  describe('container apis', function() {
    var client = null;
    it('should require an existing directory as the root', function(done) {
      client = new FileSystemProvider({root: path.join(__dirname, 'storage')});
      process.nextTick(done);
    });

    it('should complain if the root directory doesn\'t exist', function(done) {
      try {
        client = new FileSystemProvider({root: path.join(__dirname, '_storage')});
        process.nextTick(done.bind(null, 'Error'));
      } catch (err) {
        // Should be here
        process.nextTick(done);
      }
    });

    it('should return an empty list of containers', function(done) {
      client.getContainers(function(err, containers) {
        assert(!err);
        assert.equal(0, containers.length);
        done(err, containers);
      });
    });

    it('should create a new container', function(done) {
      client.createContainer({name: 'c1'}, function(err, container) {
        assert(!err);
        verifyMetadata(container, 'c1');
        done(err, container);
      });
    });

    it('should get a container c1', function(done) {
      client.getContainer('c1', function(err, container) {
        assert(!err);
        verifyMetadata(container, 'c1');
        done(err, container);
      });
    });

    it('should not get a container c2', function(done) {
      client.getContainer('c2', function(err, container) {
        assert(err);
        done(null, container);
      });
    });

    it('should return one container', function(done) {
      client.getContainers(function(err, containers) {
        assert(!err);
        assert.equal(1, containers.length);
        done(err, containers);
      });
    });

    it('should destroy a container c1', function(done) {
      client.destroyContainer('c1', function(err, container) {
        assert(!err);
        done(err, container);
      });
    });

    it('should not get a container c1 after destroy', function(done) {
      client.getContainer('c1', function(err, container) {
        assert(err);
        done(null, container);
      });
    });
  });

  describe('file apis', function() {
    var fs = require('fs');
    var client = new FileSystemProvider({root: path.join(__dirname, 'storage')});

    it('should create a new container', function(done) {
      client.createContainer({name: 'c1'}, function(err, container) {
        assert(!err);
        done(err, container);
      });
    });

    it('should upload a file', function(done) {
      var writer = client.upload({container: 'c1', remote: 'f1.txt'});
      fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
      writer.on('finish', done);
      writer.on('error', done);
    });

    it('should fail to upload a file with invalid characters', function(done) {
      var writer = client.upload({container: 'c1', remote: 'a/f1.txt'});
      fs.createReadStream(path.join(__dirname, 'files/f1.txt')).pipe(writer);
      var cb = done;
      var clearCb = function() {};
      writer.on('error', function() {
        cb();
        cb = clearCb;
      });
      writer.on('finish', function() {
        cb(new Error('Should have finished with error callback'));
        cb = clearCb;
      });
    });

    it('should download a file', function(done) {
      var reader = client.download({
        container: 'c1',
        remote: 'f1.txt',
      });
      reader.pipe(fs.createWriteStream(path.join(__dirname, 'files/f1_downloaded.txt')));
      reader.on('end', done);
      reader.on('error', done);
    });

    it('should fail to download a file with invalid characters', function(done) {
      var reader = client.download({container: 'c1', remote: 'a/f1.txt'});
      reader.pipe(fs.createWriteStream(path.join(__dirname, 'files/a-f1_downloaded.txt')));
      var cb = done;
      var clearCb = function() {};
      reader.on('error', function() {
        cb();
        cb = clearCb;
      });
      reader.on('end', function() {
        cb(new Error('Expected error: Invalid name'));
        cb = clearCb;
      });
    });

    it('should get files for a container', function(done) {
      client.getFiles('c1', function(err, files) {
        assert(!err);
        assert.equal(1, files.length);
        done(err, files);
      });
    });

    it('should get a file', function(done) {
      client.getFile('c1', 'f1.txt', function(err, f) {
        assert(!err);
        assert.ok(f);
        verifyMetadata(f, 'f1.txt');
        done(err, f);
      });
    });

    it('should remove a file', function(done) {
      client.removeFile('c1', 'f1.txt', function(err) {
        assert(!err);
        done(err);
      });
    });

    it('should get no files from a container', function(done) {
      client.getFiles('c1', function(err, files) {
        assert(!err);
        assert.equal(0, files.length);
        done(err, files);
      });
    });

    it('should destroy a container c1', function(done) {
      client.destroyContainer('c1', function(err, container) {
        // console.error(err);
        assert(!err);
        done(err, container);
      });
    });
  });
});
