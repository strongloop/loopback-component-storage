var base = require('pkgcloud').storage;
var util = require('util');

var File = exports.File = function File(client, details) {
    base.File.call(this, client, details);
};

util.inherits(File, base.File);

File.prototype._setProperties = function(details) {

}