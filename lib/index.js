var factory = require('./factory');
var handler = require('./storage-handler');

module.exports = StorageService;

/**
 * @param options The provider instance or options to create a provider
 * @returns {StorageService}
 * @constructor
 */
function StorageService(options) {
    if (!(this instanceof StorageService)) {
        return new StorageService(options);
    }
    if('function' === typeof options) {
        this.provider = options;
    } else {
        this.provider = factory.createProvider(options);
    }
}

StorageService.prototype.getContainers = function (cb) {
    return this.provider.getContainers(cb);
}

StorageService.prototype.createContainer = function (options, cb) {
    return this.provider.createContainer(options, cb);
}

StorageService.prototype.destroyContainer = function (container, cb) {
    return this.provider.destroyContainer(container, cb);
}

StorageService.prototype.getContainer = function (container, cb) {
    return this.provider.getContainer(container, cb);
}

// File related functions
StorageService.prototype.uploadStream = function (container, file, options, cb) {
    if(!cb && typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = options || {};
    options.container = container;
    options.remote = file;

    return this.provider.upload(options, cb);
}

StorageService.prototype.downloadStream = function (container, file, options, cb) {
    if(!cb && typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = options || {};
    options.container = container;
    options.remote = file;

    return this.provider.download(options, cb);
}

StorageService.prototype.getFiles = function (container, download, cb) {
    return this.provider.getFiles(container, download, cb);
}

StorageService.prototype.getFile = function (container, file, cb) {
    return this.provider.getFile(container, file, cb);
}

StorageService.prototype.removeFile = function (container, file, cb) {
    return this.provider.removeFile(container, file, cb);
}

StorageService.prototype.upload = function (req, res, cb) {
    return handler.upload(this.provider, req, res, cb);
}

StorageService.prototype.download = function (req, res, cb) {
    return handler.download(this.provider, req, res, cb);
}