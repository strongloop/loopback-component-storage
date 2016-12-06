// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-component-storage
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
'use strict';

var loopback = require('loopback');
var app = module.exports = loopback();

var path = require('path');

// expose a rest api
app.use('/api', loopback.rest());

app.use(loopback.static(path.join(__dirname, 'public')));

var ds = loopback.createDataSource({
  connector: require('../index'),
  provider: 'filesystem',
  root: path.join(__dirname, 'storage'),
});

var container = ds.createModel('container');

app.model(container);

var listener = app.listen(0, function() {
  console.log('Application listening at http://127.0.0.1:' + listener.address().port);
});
