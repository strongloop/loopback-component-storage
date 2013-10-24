# loopback-storage-service

LoopBack Storage Service

## Storage

The `loopback-storage-service` module is designed to make it easy to upload and download files to various infrastructure providers.

To get started with a `loopback-storage-service` provider just create one:

``` js
  var storageService = require('loopback-storage-service')({
    //
    // The name of the provider (e.g. "file")
    //
    provider: 'provider-name',
  
    //
    // ... Provider specific credentials
    //
  });
```

Each compute provider takes different credentials to authenticate; these details about each specific provider can be found below:

* Amazon


    {
        provider: 'amazon',
        key: '...',
        keyId: '...'
    }

* Rackspace


    {
        provider: 'rackspace',
        username: '...',
        apiKey: '...'
    }

* Azure

* Local File System


    {
        provider: 'filesystem',
        root: '/tmp/storage'
    }

Each instance of `storage.Client` returned from `storage.createClient` has a set of uniform APIs:

### Container
* `storageService.getContainers(function (err, containers) { })`
* `storageService.createContainer(options, function (err, container) { })`
* `storageService.destroyContainer(containerName, function (err) { })`
* `storageService.getContainer(containerName, function (err, container) { })`

### File
* `storageService.upload(options, function (err) { })`
* `storageService.download(options, function (err) { })`
* `storageService.getFiles(container, function (err, files) { })`
* `storageService.getFile(container, file, function (err, server) { })`
* `storageService.removeFile(container, file, function (err) { })`

Both the `.upload(options)` and `.download(options)` have had **careful attention paid to make sure they are pipe and stream capable:**

### Upload a File
``` js
  var storage = require('loopback-storage-service'),
      fs = require('fs');
  
  var storageService = storage({ /* ... */ });
  
  fs.createReadStream('a-file.txt').pipe(storageService.uploadStream('a-container','remote-file-name.txt'));
```

### Download a File
``` js
  var storage = require('loopback-storage-service'),
      fs = require('fs');
  
  var storageService = storage({ /* ... */ });
  
  storageService.downloadStream({
    container: 'a-container',
    remote: 'remote-file-name.txt'
  }).pipe(fs.createWriteStream('a-file.txt'));
```

