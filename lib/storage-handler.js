var IncomingForm = require('formidable');
var StringDecoder = require('string_decoder').StringDecoder;

/**
 * Handle multipart/form-data upload to the storage service
 * @param provider The storage service provider
 * @param req The HTTP request
 * @param res The HTTP response
 * @param cb The callback
 */
exports.upload = function (provider, req, res, cb) {
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

        var headers = {};
        if('content-type' in part.headers) {
            headers['content-type'] = part.headers['content-type'];
        }
        var writer = provider.upload({container: container, remote: part.filename});

        var endFunc = function () {
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
        };

        /*
        part.on('data', function (buffer) {
            self.pause();
            writer.write(buffer, function () {
                // pkgcloud stream doesn't make callbacks
            });
            self.resume();
        });

        part.on('end', function () {

            writer.end(); // pkgcloud stream doesn't make callbacks
            endFunc();
        });
        */

        part.pipe(writer, { end: false });
        part.on("end", function() {
            writer.end();
            endFunc();
        });
    };

    form.parse(req, function (err, _fields, _files) {
        if(err) {
            console.error(err);
        }
        cb && cb(err, {files: files, fields: fields});
    });
}

/**
 * Handle download from a container/file
 * @param provider The storage service provider
 * @param req The HTTP request
 * @param res The HTTP response
 * @param cb The callback
 */
exports.download = function(provider, req, res, cb) {
    var reader = provider.download({
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




