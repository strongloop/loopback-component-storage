# LoopBack Storage Component

**NOTE: The loopback-component-storage module supersedes [loopback-storage-service](https://www.npmjs.org/package/loopback-storage-service). Please update your package.json accordingly.**

LoopBack storage component provides Node.js and REST APIs to manage binary contents
using pluggable storage providers, such as local file systems, Amazon S3, or
Rackspace cloud files. We use [pkgcloud](https://github.com/pkgcloud/pkgcloud) to support the cloud based
storage services including:

- Amazon
- Rackspace
- Openstack
- Azure

The binary artifacts are organized with containers and files. A container is the
collection of files. Each file will belong to a container.

## Define a model with the loopback-component-storage connector

LoopBack exposes the APIs using a model that is attached to a data source configured
with the loopback-component-storage connector.

    var ds = loopback.createDataSource({
        connector: require('loopback-component-storage'),
        provider: 'filesystem',
        root: path.join(__dirname, 'storage')
    });

    var container = ds.createModel('container');

The following methods are mixed into the model class:

- getContainers(cb): List all containers
- createContainer(options, cb): Create a new container
- destroyContainer(container, cb): Destroy an existing container
- getContainer(container, cb): Look up a container by name

- uploadStream(container, file, options, cb): Get the stream for uploading
- downloadStream(container, file, options, cb): Get the stream for downloading

- getFiles(container, download, cb): List all files within the given container
- getFile(container, file, cb): Look up a file by name within the given container
- removeFile(container, file, cb): Remove a file by name  within the given container

- upload(req, res, cb): Handle the file upload at the server side
- download(container, file, res, cb): Handle the file download at the server side

## Configure the storage providers

Each storage provider takes different settings; these details about each specific
provider can be found below:

* Local File System


    {
        provider: 'filesystem',
        root: '/tmp/storage'
    }

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

* OpenStack


    {
        provider: 'openstack',
        username: 'your-user-name',
        password: 'your-password',
        authUrl: 'https://your-identity-service'
    }

* Azure


    {
        provider: 'azure',
        storageAccount: "test-storage-account",         // Name of your storage account
        storageAccessKey: "test-storage-access-key" // Access key for storage account
    }


## REST APIs

- GET /api/containers

List all containers

- GET /api/containers/:container

Get information about a container by name

- POST /api/containers

Create a new container

- DELETE /api/containers/:container

Delete an existing container by name

- GET /api/containers/:container/files

List all files within a given container by name

- GET /api/containers/:container/files/:file

Get information for a file within a given container by name

- DELETE /api/containers/:container/files/:file

Delete a file within a given container by name

- POST /api/containers/:container/upload

Upload one or more files into the given container by name. The request body should
use [multipart/form-data](https://www.ietf.org/rfc/rfc2388.txt) which the file input
type for HTML uses.

- GET /api/containers/:container/download/:file

Download a file within a given container by name