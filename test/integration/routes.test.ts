import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

describe('Integration: Routes', () => {
  describe('GET /login', () => {
    it('should return 200 status', (done) => {
      request(app)
        .get('/login')
        .expect(200, done);
    });
  });

  describe('GET /signup', () => {
    it('should return 200 status', (done) => {
      request(app)
        .get('/signup')
        .expect(200, done);
    });
  });

  describe('GET /logout', () => {
    it('should redirect (302) when not authenticated', (done) => {
      request(app)
        .get('/logout')
        .expect(302, done);
    });
  });

  describe('GET /apiv1/tweets', () => {
    it('should return JSON response', (done) => {
      request(app)
        .get('/apiv1/tweets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /apiv1/users', () => {
    it('should return JSON response', (done) => {
      request(app)
        .get('/apiv1/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET / (protected route)', () => {
    it('should redirect to login when not authenticated', (done) => {
      request(app)
        .get('/')
        .expect(302, done);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown routes', (done) => {
      request(app)
        .get('/nonexistent-route-12345')
        .expect(404, done);
    });
  });
});
