var base = require('pkgcloud').storage;
var util = require('util');

exports.Container = Container;

function Container(client, details) {
  base.Container.call(this, client, details);
}

util.inherits(Container, base.Container);

Container.prototype._setProperties = function (details) {
  for (var k in details) {
    if (typeof details[k] !== 'function') {
      this[k] = details[k];
    }
  }
};
