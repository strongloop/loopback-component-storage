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
  var server = null;
  before(function (done) {
    server = app.listen(3000, function () {
      done();
    });
  });

  after(function () {
    server.close();
  });

  it('should create a container', function (done) {

    request('http://localhost:3000')
      .post('/containers')
      .send({name: 'test-container'})
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert.equal(res.body.name, 'test-container');
        done();
      });
  });

  it('should get a container', function (done) {

    request('http://localhost:3000')
      .get('/containers/test-container')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert.equal(res.body.name, 'test-container');
        done();
      });
  });

  it('should list containers', function (done) {

    request('http://localhost:3000')
      .get('/containers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert(Array.isArray(res.body));
        assert.equal(res.body.length, 2);
        done();
      });
  });

  it('should delete a container', function (done) {

    request('http://localhost:3000')
      .del('/containers/test-container')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        done();
      });
  });

  it('should list containers after delete', function (done) {

    request('http://localhost:3000')
      .get('/containers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert(Array.isArray(res.body));
        assert.equal(res.body.length, 1);
        done();
      });
  });

  it('should list files', function (done) {

    request('http://localhost:3000')
      .get('/containers/album1/files')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert(Array.isArray(res.body));
        done();
      });
  });

  it('uploads files', function (done) {

    request('http://localhost:3000')
      .post('/containers/album1/upload')
      .attach('image', path.join(__dirname, '../example/test.jpg'))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert.deepEqual(res.body, {"result": {"files": {"image": [
          {"container": "album1", "name": "test.jpg", "type": "image/jpeg"}
        ]}, "fields": {}}});
        done();
      });
  });

  it('should get file by name', function (done) {

    request('http://localhost:3000')
      .get('/containers/album1/files/test.jpg')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        assert.equal(res.body.name, 'test.jpg');
        done();
      });
  });

  it('downloads files', function (done) {

    request('http://localhost:3000')
      .get('/containers/album1/download/test.jpg')
      .expect('Content-Type', 'image/jpeg')
      .expect(200, function (err, res) {
        done();
      });
  });

  it('should delete a file', function (done) {

    request('http://localhost:3000')
      .del('/containers/album1/files/test.jpg')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        done();
      });
  });

  it('reports errors if it fails to find the file to download', function (done) {

    request('http://localhost:3000')
      .get('/containers/album1/download/test_not_exist.jpg')
      .expect('Content-Type', /json/)
      .expect(500, function (err, res) {
        assert(res.body.error);
        done();
      });
  });
});
