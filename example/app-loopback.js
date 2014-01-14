var loopback = require('loopback')
    , app = module.exports = loopback();

var path = require('path');

app.use(app.router);

// expose a rest api
app.use(loopback.rest());

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
});

var ds = loopback.createDataSource({
    connector: require('../index'),
    provider: 'filesystem',
    root: path.join(__dirname, 'storage')
});

var Container = ds.createModel('container');

app.model(Container);

app.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    var form = "<html><body><h1>Storage Service Demo</h1>" +
        "<a href='/containers'>List all containers</a><p>" +
        "Upload to container c1: <p>" +
        "<form method='POST' enctype='multipart/form-data' action='/containers/container1/upload'>"
        + "File to upload: <input type=file name=uploadedFiles multiple=true><br>"
        + "Notes about the file: <input type=text name=note><br>"
        + "<input type=submit value=Upload></form>" +
        "</body></html>";
    res.send(form);
    res.end();
});

app.listen(app.get('port'));
console.log('http://127.0.0.1:' + app.get('port'));
