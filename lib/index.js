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
    if(container) options.container = container;
    if(file) options.remote = file;

    return this.provider.upload(options, cb);
}

StorageService.prototype.downloadStream = function (container, file, options, cb) {
    if(!cb && typeof options === 'function') {
        cb = options;
        options = {};
    }
    options = options || {};
    if(container) options.container = container;
    if(file) options.remote = file;

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

StorageService.modelName = 'storage';

StorageService.prototype.getContainers.shared = true;
StorageService.prototype.getContainers.accepts = [];
StorageService.prototype.getContainers.returns = {arg: 'containers', type: 'array'};
StorageService.prototype.getContainers.http = [
    {verb: 'get', path: '/'}
];

StorageService.prototype.getContainer.shared = true;
StorageService.prototype.getContainer.accepts = [{arg: 'container', type: 'string'}];
StorageService.prototype.getContainer.returns = {arg: 'container', type: 'object'};
StorageService.prototype.getContainer.http = [
    {verb: 'get', path: '/:container'}
];

StorageService.prototype.createContainer.shared = true;
StorageService.prototype.createContainer.accepts = [{arg: 'options', type: 'object'}];
StorageService.prototype.createContainer.returns = {arg: 'container', type: 'object'};
StorageService.prototype.createContainer.http = [
    {verb: 'post', path: '/'}
];

StorageService.prototype.destroyContainer.shared = true;
StorageService.prototype.destroyContainer.accepts = [{arg: 'container', type: 'string'}];
StorageService.prototype.destroyContainer.returns = {};
StorageService.prototype.destroyContainer.http = [
    {verb: 'delete', path: '/:container'}
];

StorageService.prototype.getFiles.shared = true;
StorageService.prototype.getFiles.accepts = [{arg: 'container', type: 'string'}];
StorageService.prototype.getFiles.returns = {arg: 'files', type: 'array'};
StorageService.prototype.getFiles.http = [
    {verb: 'get', path: '/:container/files'}
];

StorageService.prototype.getFile.shared = true;
StorageService.prototype.getFile.accepts = [{arg: 'container', type: 'string'}, {arg: 'file', type: 'string'}];
StorageService.prototype.getFile.returns = {arg: 'file', type: 'object'};
StorageService.prototype.getFile.http = [
    {verb: 'get', path: '/:container/files/:file'}
];

StorageService.prototype.removeFile.shared = true;
StorageService.prototype.removeFile.accepts = [{arg: 'container', type: 'string'}, {arg: 'file', type: 'string'}];
StorageService.prototype.removeFile.returns = {};
StorageService.prototype.removeFile.http = [
    {verb: 'delete', path: '/:container/files/:file'}
];

StorageService.prototype.upload.shared = true;
StorageService.prototype.upload.accepts = [{arg: 'file', type: 'object', 'http': {source: 'req'}}];
StorageService.prototype.upload.returns = {arg: 'description', type: 'object'};
StorageService.prototype.upload.http = [
    {verb: 'post', path: '/:container/upload/:file'}
];

StorageService.prototype.download.shared = true;
StorageService.prototype.download.accepts = [{arg: 'file', type: 'object', 'http': {source: 'req'}}];
StorageService.prototype.download.returns = {arg: 'body', type: 'object'};
StorageService.prototype.download.http = [
    {verb: 'get', path: '/:container/download/:file'}
];