var StorageService = require('./index');
/**
 * Export the initialize method to JDB
 * @param schema
 * @param callback
 */
exports.initialize = function (schema, callback) {
    var settings = schema.settings || {};

    var adapter = new StorageService(settings);
    schema.adapter = adapter;
    schema.adapter.schema = schema;

    adapter.DataAccessObject = function() {};
    for (var m in StorageService.prototype) {
        var method = StorageService.prototype[m];
        if ('function' === typeof method) {
            adapter.DataAccessObject[m] = method.bind(adapter);
            for(var k in method) {
                adapter.DataAccessObject[m][k] = method[k];
            }
        }
    }

    adapter.define = function(model, properties, settings) {};
}
