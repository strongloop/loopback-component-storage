asteroid-storage-service
========================

Aseteroid Storage Service

<a name="storage"></a>
## Storage

The `asteroid-storage-service` service is designed to make it easy to upload and download files to various infrastructure providers. **_Special attention has been paid so that methods are streams and pipe-capable._**

To get started with a `asteroid-storage-service` provider just create one:

``` js
  var storageService = require('asteroid-storage-service')({
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

* [Azure](docs/providers/azure.md#using-storage)
* [Rackspace](docs/providers/rackspace/storage.md)
* [Amazon](docs/providers/amazon.md#using-storage)

Each instance of `storage.Client` returned from `storage.createClient` has a set of uniform APIs:

<a name="container"></a>
### Container
* `storageService.getContainers(function (err, containers) { })`
* `storageService.createContainer(options, function (err, container) { })`
* `storageService.destroyContainer(containerName, function (err) { })`
* `storageService.getContainer(containerName, function (err, container) { })`

<a name="file"></a>
### File
* `storageService.upload(options, function (err) { })`
* `storageService.download(options, function (err) { })`
* `storageService.getFiles(container, function (err, files) { })`
* `storageService.getFile(container, file, function (err, server) { })`
* `storageService.removeFile(container, file, function (err) { })`

Both the `.upload(options)` and `.download(options)` have had **careful attention paid to make sure they are pipe and stream capable:**

### Upload a File
``` js
  var storage = require('asteroid-storage-service'),
      fs = require('fs');
  
  var storageService = storage({ /* ... */ });
  
  fs.createReadStream('a-file.txt').pipe(storageService.uploadStream('a-container','remote-file-name.txt'));
```

### Download a File
``` js
  var storage = require('asteroid-storage-service'),
      fs = require('fs');
  
  var storageService = storage({ /* ... */ });
  
  storageService.downloadStream({
    container: 'a-container',
    remote: 'remote-file-name.txt'
  }).pipe(fs.createWriteStream('a-file.txt'));
```

