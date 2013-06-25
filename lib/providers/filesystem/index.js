/**
 * File system based on storage provider
 */

var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    File = require('./file').File,
    Container = require('./container').Container;

module.exports = FileSystemProvider;

function FileSystemProvider(options) {
    options = options || {};
    this.root = options.root;
    var stat = fs.statSync(this.root);
    if (!stat.isDirectory()) {
        throw new Error('Invalid directory: ' + this.root);
    }
}

var namePattern = new RegExp('[^' + path.sep + '/]+');

function validateName(name, cb) {
    if (!name) {
        cb && process.nextTick(cb.bind(null, new Error('Invalid name: ' + name)));
        return false;
    }
    var match = namePattern.exec(name);
    if (match && match.index === 0 && match[0].length === name.length) {
        return true;
    } else {
        cb && process.nextTick(cb.bind(null, new Error('Invalid name: ' + name)));
        return false;
    }
}

// Container related functions
FileSystemProvider.prototype.getContainers = function (cb) {
    var self = this;
    fs.readdir(self.root, function (err, files) {
        var containers = [];
        var tasks = [];
        files.forEach(function (f) {
            tasks.push(fs.stat.bind(null, path.join(self.root, f)));
        });
        async.parallel(tasks, function (err, stats) {
            if (err) {
                cb && cb(err);
            } else {
                stats.forEach(function (stat, index) {
                    if (stat.isDirectory()) {
                        var name = files[index];
                        var props = {name: name};
                        for (var p in stat) {
                            props[p] = stat[p];
                        }
                        var container = new Container(this, props);
                        containers.push(container);
                    }
                });
                cb && cb(err, containers);
            }
        });
    });
}

FileSystemProvider.prototype.createContainer = function (options, cb) {
    var self = this;
    var name = options.name;
    validateName(name, cb) && fs.mkdir(path.join(this.root, name), options, function (err) {
        cb && cb(err, new Container(self, {name: name}));
    });
}

FileSystemProvider.prototype.destroyContainer = function (containerName, cb) {
    if (!validateName(containerName, cb)) return;

    var dir = path.join(this.root, containerName);
    fs.readdir(dir, function (err, files) {
        var tasks = [];
        files.forEach(function (f) {
            tasks.push(fs.unlink.bind(null, path.join(dir, f)));
        });
        async.parallel(tasks, function (err) {
            if (err) {
                cb && cb(err);
            } else {
                fs.rmdir(dir, cb);
            }
        });
    });
}

FileSystemProvider.prototype.getContainer = function (containerName, cb) {
    var self = this;
    if (!validateName(containerName, cb)) return;
    var dir = path.join(this.root, containerName);
    fs.stat(dir, function (err, stat) {
        var container = null;
        if (!err) {
            var props = {name: containerName};
            for (var p in stat) {
                props[p] = stat[p];
            }
            container = new Container(self, props);
        }
        cb && cb(err, container);
    });
}


// File related functions
FileSystemProvider.prototype.upload = function (options, cb) {
    var container = options.container;
    if (!validateName(container, cb)) return;
    var file = options.remote;
    if (!validateName(file, cb)) return;
    var filePath = path.join(this.root, container, file);

    var fileOpts = {flags: 'w+',
        encoding: null,
        mode: 0666 };

    return fs.createWriteStream(filePath, fileOpts);
}

FileSystemProvider.prototype.download = function (options, cb) {
    var container = options.container;
    if (!validateName(container, cb)) return;
    var file = options.remote;
    if (!validateName(file, cb)) return;

    var filePath = path.join(this.root, container, file);

    var fileOpts = {flags: 'r',
        autoClose: true };

    return fs.createReadStream(filePath, fileOpts);

}

FileSystemProvider.prototype.getFiles = function (container, cb) {
    var self = this;
    if (!validateName(container, cb)) return;
    var dir = path.join(this.root, container);
    fs.readdir(dir, function (err, entries) {
        var files = [];
        var tasks = [];
        entries.forEach(function (f) {
            tasks.push(fs.stat.bind(null, path.join(dir, f)));
        });
        async.parallel(tasks, function (err, stats) {
            if (err) {
                cb && cb(err);
            } else {
                stats.forEach(function (stat, index) {
                    if (stat.isFile()) {
                        var props = {container: container, name: entries[index]};
                        for (var p in stat) {
                            props[p] = stat[p];
                        }
                        var file = new File(self, props);
                        files.push(file);
                    }
                });
                cb && cb(err, files);
            }
        });
    });

}

FileSystemProvider.prototype.getFile = function (container, file, cb) {
    var self = this;
    if (!validateName(container, cb)) return;
    if (!validateName(file, cb)) return;
    var filePath = path.join(this.root, container, file);
    fs.stat(filePath, function (err, stat) {
        var f = null;
        if (!err) {
            var props = {container: container, name: file};
            for (var p in stat) {
                props[p] = stat[p];
            }
            f = new File(self, props);
        }
        cb && cb(err, f);
    });
}

FileSystemProvider.prototype.removeFile = function (container, file, cb) {
    if (!validateName(container, cb)) return;
    if (!validateName(file, cb)) return;

    var filePath = path.join(this.root, container, file);
    fs.unlink(filePath, cb);
}