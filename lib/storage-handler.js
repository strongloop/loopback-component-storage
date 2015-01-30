var IncomingForm = require('formidable');
var StringDecoder = require('string_decoder').StringDecoder;

/**
 * Handle multipart/form-data upload to the storage service
 * @param {Object} provider The storage service provider
 * @param {Request} req The HTTP request
 * @param {Response} res The HTTP response
 * @param {Object} [options] The container name
 * @callback {Function} cb Callback function
 * @header storageService.upload(provider, req, res, options, cb) 
 */
exports.upload = function (provider, req, res, options, cb) {
  if (!cb && 'function' === typeof options) {
    cb = options;
    options = {};
  }

  var form = new IncomingForm(this.options);
  container = options.container || req.params.container;
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
        if (values === undefined) {
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

    if ('function' === typeof options.getFilename) {
      file.name = options.getFilename(file, req, res);
    }

    self.emit('fileBegin', part.name, file);

    var headers = {};
    if ('content-type' in part.headers) {
      headers['content-type'] = part.headers['content-type'];
    }

    var writer = provider.upload({container: container, remote: file.name});

    var endFunc = function () {
      self._flushing--;
      var values = files[part.name];
      if (values === undefined) {
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
    part.on("end", function () {
      writer.end();
      endFunc();
    });
  };

  form.parse(req, function (err, _fields, _files) {
    if (err) {
      console.error(err);
    }
    cb && cb(err, {files: files, fields: fields});
  });
}

/**
 * Handle download from a container/file.
 * @param {Object} provider The storage service provider
 * @param {Request} req The HTTP request
 * @param {Response} res The HTTP response
 * @param {String} container The container name
 * @param {String} file The file name
 * @callback {Function} cb Callback function.
 * @header storageService.download(provider, req, res, container, file, cb) 
 */
exports.download = function (provider, req, res, container, file, cb) {
  var reader = provider.download({
    container: container || req && req.params.container,
    remote: file || req && req.params.file
  });

  res.type(file);
  reader.pipe(res);
  reader.on('error', function (err) {
    if (err.code === 'ENOENT') {
      res.type('application/json');
      res.status(404).send({ error: err });
      return;
    }

    res.type('application/json');
    res.status(500).send({ error: err });
  });
}




