var base = require('pkgcloud').storage;
var util = require('util');

var Container = exports.Container = function Container(client, details) {
    base.Container.call(this, client, details);
};

util.inherits(Container, base.Container);

Container.prototype._setProperties = function(details) {

}