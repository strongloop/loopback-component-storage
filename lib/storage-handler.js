var factory = require('./factory');

var IncomingForm = require('formidable');
var StringDecoder = require('string_decoder').StringDecoder;

module.exports = Uploader;

/**
 * Constructor
 * @param options The client instance or options to create a client
 * @returns {Uploader}
 * @constructor
 */
function Uploader(options) {
    if (!(this instanceof Uploader)) {
        return new Uploader(options);
    }
    if('function' === typeof options) {
        this.client = options;
    } else {
        this.client = factory.createClient(options);
    }
}

Uploader.prototype.processUpload = function (req, res, cb) {
    var client = this.client;
    var form = new IncomingForm(this.options);
    var container = req.params.container;
    var fields = {}, files = {};
    form.handlePart = function (part) {
        var self = this;

        if (part.filename === undefined) {
            var value = ''
                , decoder = new StringDecoder(this.encoding);

            part.on('data', function (buffer) {
                self._fieldsSize += buffer.length;
                if (self._fieldsSize > self.maxFieldsSize) {
                    self._error(new Error('maxFieldsSize exceeded, received ' + self._fieldsSize + ' bytes of field data'));
                    return;
                }
                value += decoder.write(buffer);
            });

            part.on('end', function () {
                var values = fields[part.name];
                if(values === undefined) {
                    values = [value];
                    fields[part.name] = values;
                } else {
                    values.push(value);
                }
                self.emit('field', part.name, value);
            });
            return;
        }

        this._flushing++;

        var file = {
            container: container,
            name: part.filename,
            type: part.mime
        };

        self.emit('fileBegin', part.name, file);

        var writer = client.upload({container: container, remote: part.filename});

        part.on('data', function (buffer) {
            self.pause();
            writer.write(buffer, function () {
                self.resume();
            });
        });

        part.on('end', function () {
            writer.end(function () {
                self._flushing--;
                var values = files[part.name];
                if(values === undefined) {
                    values = [file];
                    files[part.name] = values;
                } else {
                    values.push(file);
                }
                self.emit('file', part.name, file);
                self._maybeEnd();
            });
        });
    };

    form.parse(req, function (err, _fields, _files) {
        cb && cb(err, {files: files, fields: fields});
    });
}

Uploader.prototype.processDownload = function(req, res, cb) {
    var reader = this.client.download({
        container: req.params.container,
        remote: req.params.file
    });
    reader.pipe(res);
    reader.on('error', function(err) {
       cb && cb(err);
    });
    reader.on('end', function(err, result) {
       cb && cb(err, result);
    });
}




