var StorageService = require('../').StorageService;

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Create the container
var mkdirp = require('mkdirp');
mkdirp.sync('/tmp/storage/con1');

var handler = new StorageService({provider: 'filesystem', root: '/tmp/storage'});

app.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'text/html');
  var form = "<html><body><h1>Storage Service Demo</h1>" +
    "<a href='/download'>List all containers</a><p>" +
    "Upload to container con1: <p>" +
    "<form method='POST' enctype='multipart/form-data' action='/upload/con1'>"
    + "File to upload: <input type=file name=uploadedFiles multiple=true><br>"
    + "Notes about the file: <input type=text name=note><br>"
    + "<input type=submit value=Upload></form>" +
    "</body></html>";
  res.send(form);
  res.end();
});

app.post('/upload/:container', function(req, res, next) {
  handler.upload(req, res, function(err, result) {
    if (!err) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(result);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/download', function(req, res, next) {
  handler.getContainers(function(err, containers) {
    var html = "<html><body><h1>Containers</h1><ul>";
    containers.forEach(function(f) {
      html += "<li><a href='/download/" + f.name + "'>" + f.name + "</a></li>"
    });
    html += "</ul><p><a href='/'>Home</a></p></body></html>";
    res.status(200).send(html);
  });
});

app.get('/download/:container', function(req, res, next) {
  handler.getFiles(req.params.container, function(err, files) {
    var html = "<html><body><h1>Files in container " + req.params.container + "</h1><ul>";
    files.forEach(function(f) {
      html += "<li><a href='/download/" + f.container + "/" + f.name + "'>" + f.container + "/" + f.name + "</a></li>"
    });
    html += "</ul><p><a href='/'>Home</a></p></body></html>";
    res.status(200).send(html);
  });
});

app.get('/download/:container/:file', function(req, res, next) {
  handler.download(req.params.container, req.params.file, res, function(err, result) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(app.get('port'));
console.log('http://127.0.0.1:' + app.get('port'));
