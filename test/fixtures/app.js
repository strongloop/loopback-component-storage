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

app.set('port', process.env.PORT || 3000);

var ds = loopback.createDataSource({
  connector: require('../index'),
  provider: 'filesystem',
  root: path.join(__dirname, 'storage'),
});

var container = ds.createModel('container');

app.model(container);

app.listen(app.get('port'));
console.log('http://127.0.0.1:' + app.get('port'));
