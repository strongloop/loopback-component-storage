var request = require('supertest');
var loopback = require('loopback');
var assert = require('assert');

var app = loopback();
var path = require('path');

// expose a rest api
app.use(loopback.rest());

var ds = loopback.createDataSource({
  connector: require('../lib/storage-connector'),
  provider: 'filesystem',
  root: path.join(__dirname, 'images')
});

var Container = ds.createModel('container');
app.model(Container);

describe('storage service', function () {
  it('uploads files', function (done) {

    var server = app.listen(3000, function () {

      request('http://localhost:3000')
        .post('/containers/album1/upload')
        .attach('image', path.join(__dirname, '../example/test.jpg'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function (err, res) {
          assert.deepEqual(res.body, {"result": {"files": {"image": [
            {"container": "album1", "name": "test.jpg", "type": "image/jpeg"}
          ]}, "fields": {}}});
          server.close();
          done();
        });
    });
  });
});
