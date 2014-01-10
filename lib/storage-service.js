var factory = require('./factory');
var handler = require('./storage-handler');

var storage = require('pkgcloud').storage;

var Container = require('./models/container');
var File = require('./models/file');

module.exports = StorageService;

/**
 * @param options The options to create a provider
 * @returns {StorageService}
 * @constructor
 */
function StorageService(options) {
  if (!(this instanceof StorageService)) {
    return new StorageService(options);
  }
  this.provider = options.provider;
  this.client = factory.createClient(options);
}

function map(obj) {
  if(!obj || typeof obj !== 'object') {
    return obj;
  }
  var data = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i) && typeof obj[i] !== 'function'
      && typeof obj[i] !== 'object') {
      if (i === 'newListener' || i === 'delimiter' || i === 'wildcard') {
        // Skip properties from the base class
        continue;
      }
      data[i] = obj[i];
    }
  }
  return data;
}

StorageService.prototype.getContainers = function (cb) {
  this.client.getContainers(function(err, containers) {
    if(err) {
      cb(err, containers);
    } else {
      cb(err, containers.map(function(c) {
        return new Container(map(c));
      }));
    }
  });
};

StorageService.prototype.createContainer = function (options, cb) {
  options = options || {};
  if ('object' === typeof options && !(options instanceof storage.Container)) {
    var Container = factory.getProvider(this.provider).Container;
    options = new Container(this.client, options);
  }
  return this.client.createContainer(options, function(err, container) {
    return cb(err, map(container));
  });
};

StorageService.prototype.destroyContainer = function (container, cb) {
  return this.client.destroyContainer(container, cb);
};

StorageService.prototype.getContainer = function (container, cb) {
  return this.client.getContainer(container, function(err, container) {
    return cb(err, map(container));
  });
};

// File related functions
StorageService.prototype.uploadStream = function (container, file, options, cb) {
  if (!cb && typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  if (container) options.container = container;
  if (file) options.remote = file;

  return this.client.upload(options, cb);
};

StorageService.prototype.downloadStream = function (container, file, options, cb) {
  if (!cb && typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  if (container) options.container = container;
  if (file) options.remote = file;

  return this.client.download(options, cb);
};

StorageService.prototype.getFiles = function (container, download, cb) {
  return this.client.getFiles(container, download, function(err, files) {
    if(err) {
      cb(err, files);
    } else {
      cb(err, files.map(function(f) {
        return new File(map(f));
      }));
    }
  });
};

StorageService.prototype.getFile = function (container, file, cb) {
  return this.client.getFile(container, file, function(err, f) {
    return cb(err, map(f));
  });
};

StorageService.prototype.removeFile = function (container, file, cb) {
  return this.client.removeFile(container, file, cb);
};

StorageService.prototype.upload = function (req, res, cb) {
  return handler.upload(this.client, req, res, req.params.container, cb);
};

StorageService.prototype.download = function (req, res, cb) {
  return handler.download(this.client, req, res,
    req.params.container, req.params.file, cb);
};

StorageService.modelName = 'storage';

StorageService.prototype.getContainers.shared = true;
StorageService.prototype.getContainers.accepts = [];
StorageService.prototype.getContainers.returns = {arg: 'containers', type: 'array', root: true};
StorageService.prototype.getContainers.http = [
  {verb: 'get', path: '/'}
];

StorageService.prototype.getContainer.shared = true;
StorageService.prototype.getContainer.accepts = [
  {arg: 'container', type: 'string'}
];
StorageService.prototype.getContainer.returns = {arg: 'container', type: 'object', root: true};
StorageService.prototype.getContainer.http = [
  {verb: 'get', path: '/:container'}
];

StorageService.prototype.createContainer.shared = true;
StorageService.prototype.createContainer.accepts = [
  {arg: 'options', type: 'object'}
];
StorageService.prototype.createContainer.returns = {arg: 'container', type: 'object', root: true};
StorageService.prototype.createContainer.http = [
  {verb: 'post', path: '/'}
];

StorageService.prototype.destroyContainer.shared = true;
StorageService.prototype.destroyContainer.accepts = [
  {arg: 'container', type: 'string'}
];
StorageService.prototype.destroyContainer.returns = {};
StorageService.prototype.destroyContainer.http = [
  {verb: 'delete', path: '/:container'}
];

StorageService.prototype.getFiles.shared = true;
StorageService.prototype.getFiles.accepts = [
  {arg: 'container', type: 'string'}
];
StorageService.prototype.getFiles.returns = {arg: 'files', type: 'array', root: true};
StorageService.prototype.getFiles.http = [
  {verb: 'get', path: '/:container/files'}
];

StorageService.prototype.getFile.shared = true;
StorageService.prototype.getFile.accepts = [
  {arg: 'container', type: 'string'},
  {arg: 'file', type: 'string'}
];
StorageService.prototype.getFile.returns = {arg: 'file', type: 'object', root: true};
StorageService.prototype.getFile.http = [
  {verb: 'get', path: '/:container/files/:file'}
];

StorageService.prototype.removeFile.shared = true;
StorageService.prototype.removeFile.accepts = [
  {arg: 'container', type: 'string'},
  {arg: 'file', type: 'string'}
];
StorageService.prototype.removeFile.returns = {};
StorageService.prototype.removeFile.http = [
  {verb: 'delete', path: '/:container/files/:file'}
];

StorageService.prototype.upload.shared = true;
StorageService.prototype.upload.accepts = [
  {arg: 'req', type: 'undefined', 'http': {source: 'req'}},
  {arg: 'res', type: 'undefined', 'http': {source: 'res'}}
];
StorageService.prototype.upload.returns = {arg: 'result', type: 'object'};
StorageService.prototype.upload.http = [
  {verb: 'post', path: '/:container/upload'}
];

StorageService.prototype.download.shared = true;
StorageService.prototype.download.accepts = [
  {arg: 'req', type: 'undefined', 'http': {source: 'req'}},
  {arg: 'res', type: 'undefined', 'http': {source: 'res'}}
];
StorageService.prototype.download.returns = {arg: 'res', type: 'stream'};
StorageService.prototype.download.http = [
  {verb: 'get', path: '/:container/download/:file'}
];