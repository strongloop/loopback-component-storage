// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-component-storage
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
'use strict';

var SG = require('strong-globalize');
SG.SetRootDir(__dirname);

var StorageConnector = require('./lib/storage-connector');
StorageConnector.StorageService = require('./lib/storage-service');

module.exports = StorageConnector;
