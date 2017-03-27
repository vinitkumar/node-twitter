/* global describe it */

var request = require('supertest');
var app = require('../server');

describe('Test Homepage', function (done) {
  it('should return 302', function (done) {
    request(app)
    .get('/')
    .expect(302, done);
  });
});

describe('Test Login', function (done) {
  it('should return 200', function (done) {
    request(app)
    .get('/login')
    .expect(200, done);
  });
});


describe('Test Login', function (done) {
  it('should return 200', function (done) {
    request(app)
    .get('/apiv1/users')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });
});
