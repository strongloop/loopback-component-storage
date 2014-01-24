var StorageConnector = require('./lib/storage-connector');
StorageConnector.Container = require('./lib/models/container');
StorageConnector.File = require('./lib/models/file');
StorageConnector.StorageService = require('./lib/storage-service');

module.exports = StorageConnector;

