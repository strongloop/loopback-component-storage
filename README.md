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

> Please see the [Storage Service Documentaion](http://loopback.io/doc/en/lb2/Storage-component.html).

For more details on the architecture of the module, please see the introduction section of the [blog post](https://strongloop.com/strongblog/managing-nodejs-loopback-storage-service-provider/) written up its launch. 

## Use
Now you can use Container's name with slash! If you want to create a directory, like `this/isMy/newContainer`, you have to use the char `%2F` instead of `/`, so your Container's name going to be `this%2FisMy%2FnewContainer`.

## URL Example
Syntax
```
[POST] <<YOUR_URL>>:<<YOUR_PORT>>/api/Containers/<<CONTAINER_NAME>>/
[POST] <<YOUR_URL>>:<<YOUR_PORT>>/api/Containers/<<CONTAINER_NAME>>/upload (For upload file)
```

Example
```
[POST] http://example.com:3000/api/Containers/images%2Fprofile%2Fpersonal/
[POST] http://example.com:3000/api/Containers/images%2Fprofile%2Fpersonal/upload (For upload file)
```

## Examples

See https://github.com/strongloop/loopback-example-storage.
