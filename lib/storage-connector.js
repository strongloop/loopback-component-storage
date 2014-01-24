var StorageService = require('./storage-service');
/**
 * Export the initialize method to Loopback data
 * @param dataSource
 * @param callback
 */
exports.initialize = function (dataSource, callback) {
  var settings = dataSource.settings || {};

  var connector = new StorageService(settings);
  dataSource.connector = connector;
  dataSource.connector.dataSource = dataSource;

  connector.DataAccessObject = function () {
  };
  for (var m in StorageService.prototype) {
    var method = StorageService.prototype[m];
    if ('function' === typeof method) {
      connector.DataAccessObject[m] = method.bind(connector);
      for (var k in method) {
        connector.DataAccessObject[m][k] = method[k];
      }
    }
  }

  connector.define = function (model, properties, settings) {
  };
};
