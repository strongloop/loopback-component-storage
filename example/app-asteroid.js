var asteroid = require('asteroid')
    , app = module.exports = asteroid();

// var StorageService = require('../');

// expose a rest api
app.use(asteroid.rest());

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
});

var ds = asteroid.createDataSource({
    connector: require('../lib/storage-connector'),
    provider: 'filesystem',
    root: '/tmp/storage'
});

var Container = ds.createModel('container', {name: String});

console.log(Container);
Container.getContainers(console.log);

console.log('shared', Container.getContainers.shared);

app.model(Container);

/*
var handler = new StorageService({provider: 'filesystem', root: '/tmp/storage'});

app.service('storage', handler);

app.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    var form = "<html><body><h1>Storage Service Demo</h1>" +
        "<a href='/download'>List all containers</a><p>" +
        "Upload to container c1: <p>" +
        "<form method='POST' enctype='multipart/form-data' action='/upload/c1'>"
        + "File to upload: <input type=file name=uploadedFiles multiple=true><br>"
        + "Notes about the file: <input type=text name=note><br>"
        + "<input type=submit value=Upload></form>" +
        "</body></html>";
    res.send(form);
    res.end();
});

*/


app.listen(app.get('port'));
console.log('http://127.0.0.1:' + app.get('port'));
