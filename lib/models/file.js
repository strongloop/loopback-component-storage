var loopback = require('loopback');

var File = loopback.createModel('file', {
  name: String,
  url: String,
  container: String
}, {idInjection: false, strict: false});

module.exports = File;
