var factory = require('./factory');
var handler = require('./storage-handler');

var storage = require('pkgcloud').storage;

module.exports = StorageService;

/**
 * Storage service constructor.  Properties of options object depend on the storage service provider.
 *
 * 
 * @options {Object} options The options to create a provider; see below.
 * @prop {Object} connector <!-- What is this? -->
 * @prop {String} provider Storage service provider. Must be one of:
 * <ul><li>'filesystem' - local file system.</li>
 * <li>'amazon'</li>
 * <li>'rackspace'</li>
 * <li>'azure'</li>
 * <li>'openstack'</li>
 * </ul>
 *
 * Other supported values depend on the provider.
 * See the [documentation](http://docs.strongloop.com/display/DOC/Storage+service) for more information.
 * @class
 */
function StorageService(options) {
  if (!(this instanceof StorageService)) {
    return new StorageService(options);
  }
  this.provider = options.provider;
  this.client = factory.createClient(options);
}

function map(obj) {
  return obj;
  /*
   if (!obj || typeof obj !== 'object') {
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
   */
}

/**
 * List all storage service containers.
 * @callback {Function} callback Callback function. See below.
 * @param err {String} Error message
 * @param containers {Object} object holding all containers.
 */

StorageService.prototype.getContainers = function (cb) {
  this.client.getContainers(function (err, containers) {
    if (err) {
      cb(err, containers);
    } else {
      cb(err, containers.map(function (c) {
        return map(c);
      }));
    }
  });
};

/**
 * Create a new storage service container.  Other option properties depend on the provider.
 * 
 * @options {Object} options The options to create a provider; see below.
 * @prop {Object} connector <!-- WHAT IS THIS? -->
 * @prop {String} provider Storage service provider. Must be one of:
 * <ul><li>'filesystem' - local file system.</li>
 * <li>'amazon'</li>
 * <li>'rackspace'</li>
 * <li>'azure'</li>
 * <li>'openstack'</li>
 * </ul>
 *
 * Other supported values depend on the provider.
 * See the [documentation](http://docs.strongloop.com/display/DOC/Storage+service) for more information.
 * @callback {Function} callback Callback function.
 */

StorageService.prototype.createContainer = function (options, cb) {
  options = options || {};
  if ('object' === typeof options && !(options instanceof storage.Container)) {
    var Container = factory.getProvider(this.provider).Container;
    options = new Container(this.client, options);
  }
  return this.client.createContainer(options, function (err, container) {
    return cb(err, map(container));
  });
};

/**
 * Destroy an existing storage service container.
 * @param {Object} container Container object.
 * @callback {Function} callback Callback function.
 */
StorageService.prototype.destroyContainer = function (container, cb) {
  return this.client.destroyContainer(container, cb);
};

/**
 * Look up a container by name.
 * @param {Object} container Container object.
 * @callback {Function} callback Callback function.
 */
StorageService.prototype.getContainer = function (container, cb) {
  return this.client.getContainer(container, function (err, container) {
    return cb(err, map(container));
  });
};

/**
 * Get the stream for uploading
 * @param {Object} container Container object.
 * @param {String} file  <!-- IS THIS PATH TO A FILE OR FILE OBJ? -->
 * @options options See below.
 * @prop TBD
 * @callback callback Callback function
 */
StorageService.prototype.uploadStream = function (container, file, options, cb) {
  if (!cb && typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  if (container) {
    options.container = container;
  }
  if (file) {
    options.remote = file;
  }

  return this.client.upload(options, cb);
};

/**
 * Get the stream for downloading.
 * @param {Object} container Container object.
 * @param {String} file Path to file.
 * @options {Object} options See below.
 * @prop TBD <!-- What are the options? -->
 * @param {Function} callback Callback function
 */
StorageService.prototype.downloadStream = function (container, file, options, cb) {
  if (!cb && typeof options === 'function') {
    cb = options;
    options = {};
  }
  options = options || {};
  if (container) {
    options.container = container;
  }
  if (file) {
    options.remote = file;
  }

  return this.client.download(options, cb);
};

/**
 * List all files within the given container.
 * @param {Object} container Container object.
 * @param {Function} download <!-- What is this? -->
 * @callback {Function} callback Callback function
 */
StorageService.prototype.getFiles = function (container, download, cb) {
  return this.client.getFiles(container, download, function (err, files) {
    if (err) {
      cb(err, files);
    } else {
      cb(err, files.map(function (f) {
        return map(f);
      }));
    }
  });
};

StorageService.prototype.getFile = function (container, file, cb) {
  return this.client.getFile(container, file, function (err, f) {
    return cb(err, map(f));
  });
};

StorageService.prototype.removeFile = function (container, file, cb) {
  return this.client.removeFile(container, file, cb);
};

StorageService.prototype.upload = function (req, res, cb) {
  return handler.upload(this.client, req, res, req.params.container, cb);
};

StorageService.prototype.download = function (container, file, res, cb) {
  return handler.download(this.client, null, res, container, file, cb);
};

StorageService.modelName = 'storage';

StorageService.prototype.getContainers.shared = true;
StorageService.prototype.getContainers.accepts = [];
StorageService.prototype.getContainers.returns = {arg: 'containers', type: 'array', root: true};
StorageService.prototype.getContainers.http =
{verb: 'get', path: '/'};

StorageService.prototype.getContainer.shared = true;
StorageService.prototype.getContainer.accepts = [
  {arg: 'container', type: 'string'}
];
StorageService.prototype.getContainer.returns = {arg: 'container', type: 'object', root: true};
StorageService.prototype.getContainer.http =
{verb: 'get', path: '/:container'};

StorageService.prototype.createContainer.shared = true;
StorageService.prototype.createContainer.accepts = [
  {arg: 'options', type: 'object', http: {source: 'body'}}
];
StorageService.prototype.createContainer.returns = {arg: 'container', type: 'object', root: true};
StorageService.prototype.createContainer.http =
{verb: 'post', path: '/'};

StorageService.prototype.destroyContainer.shared = true;
StorageService.prototype.destroyContainer.accepts = [
  {arg: 'container', type: 'string'}
];
StorageService.prototype.destroyContainer.returns = {};
StorageService.prototype.destroyContainer.http =
{verb: 'delete', path: '/:container'};

StorageService.prototype.getFiles.shared = true;
StorageService.prototype.getFiles.accepts = [
  {arg: 'container', type: 'string'}
];
StorageService.prototype.getFiles.returns = {arg: 'files', type: 'array', root: true};
StorageService.prototype.getFiles.http =
{verb: 'get', path: '/:container/files'};

StorageService.prototype.getFile.shared = true;
StorageService.prototype.getFile.accepts = [
  {arg: 'container', type: 'string'},
  {arg: 'file', type: 'string'}
];
StorageService.prototype.getFile.returns = {arg: 'file', type: 'object', root: true};
StorageService.prototype.getFile.http =
{verb: 'get', path: '/:container/files/:file'};

StorageService.prototype.removeFile.shared = true;
StorageService.prototype.removeFile.accepts = [
  {arg: 'container', type: 'string'},
  {arg: 'file', type: 'string'}
];
StorageService.prototype.removeFile.returns = {};
StorageService.prototype.removeFile.http =
{verb: 'delete', path: '/:container/files/:file'};

StorageService.prototype.upload.shared = true;
StorageService.prototype.upload.accepts = [
  {arg: 'req', type: 'object', 'http': {source: 'req'}},
  {arg: 'res', type: 'object', 'http': {source: 'res'}}
];
StorageService.prototype.upload.returns = {arg: 'result', type: 'object'};
StorageService.prototype.upload.http =
{verb: 'post', path: '/:container/upload'};

StorageService.prototype.download.shared = true;
StorageService.prototype.download.accepts = [
  {arg: 'container', type: 'string', 'http': {source: 'path'}},
  {arg: 'file', type: 'string', 'http': {source: 'path'}},
  {arg: 'res', type: 'object', 'http': {source: 'res'}}
];
StorageService.prototype.download.http =
{verb: 'get', path: '/:container/download/:file'};