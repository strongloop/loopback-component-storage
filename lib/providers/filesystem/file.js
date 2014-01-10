var base = require('pkgcloud').storage;
var util = require('util');

exports.File = File;

function File(client, details) {
  base.File.call(this, client, details);
}

util.inherits(File, base.File);

File.prototype._setProperties = function (details) {
  for (var k in details) {
    if (typeof details[k] !== 'function') {
      this[k] = details[k];
    }
  }
};