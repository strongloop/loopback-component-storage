var loopback = require('loopback');

var Container = loopback.createModel('container', {
  name: String,
  url: String
}, {idInjection: false, strict: false});

module.exports = Container;