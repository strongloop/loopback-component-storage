var StorageService = require('../').StorageService;
var path = require('path');
var providers = null;
try {
  providers = require('./providers-private.json');
} catch(err) {
  providers = require('./providers.json');
}

function listContainersAndFiles(ss) {
  ss.getContainers(function (err, containers) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('----------- %s (%d) ---------------', ss.provider, containers.length);
    containers.forEach(function (c) {
      console.log('[%s] %s/', ss.provider, c.name);
      c.getFiles(function (err, files) {
        files.forEach(function (f) {
          console.log('[%s] ... %s', ss.provider, f.name);
        });
      });
    });
  });
}

var rs = new StorageService({
  provider: 'rackspace',
  username: providers.rackspace.username,
  apiKey: providers.rackspace.apiKey,
  region: providers.rackspace.region
});

listContainersAndFiles(rs);

var s3 = new StorageService({
  provider: 'amazon',
  key: providers.amazon.key,
  keyId: providers.amazon.keyId
});

listContainersAndFiles(s3);


var fs = require('fs');
var path = require('path');
var stream = s3.uploadStream('con1', 'test.jpg');
fs.createReadStream(path.join(__dirname, 'test.jpg')).pipe(stream);

var local = StorageService({
  provider: 'filesystem',
  root: path.join(__dirname, 'storage')
});

listContainersAndFiles(local);

