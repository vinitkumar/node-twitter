import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';

describe('Integration: API Endpoints', () => {
  describe('POST /users', () => {
    it('should reject invalid user data', (done) => {
      request(app)
        .post('/users')
        .send({
          name: 'Test User'
          // Missing required fields
        })
        .end((err, res) => {
          // Should either error or redirect
          expect([302, 400, 500]).to.include(res.status);
          done();
        });
    });
  });

  describe('GET /users/:userId', () => {
    it('should require authentication', (done) => {
      request(app)
        .get('/users/invalid-id')
        .expect(302, done); // Should redirect to login
    });
  });

  describe('GET /chat', () => {
    it('should require authentication', (done) => {
      request(app)
        .get('/chat')
        .expect(302, done); // Should redirect to login
    });
  });

  describe('GET /analytics', () => {
    it('should require authentication', (done) => {
      request(app)
        .get('/analytics')
        .expect(302, done); // Should redirect to login
    });
  });

  describe('GET /activities', () => {
    it('should require authentication', (done) => {
      request(app)
        .get('/activities')
        .expect(302, done); // Should redirect to login
    });
  });

  describe('GET /tweets', () => {
    it('should require authentication', (done) => {
      request(app)
        .get('/tweets')
        .expect(302, done); // Should redirect to login
    });
  });

  describe('POST /tweets', () => {
    it('should require authentication', (done) => {
      request(app)
        .post('/tweets')
        .send({ body: 'Test tweet' })
        .expect(302, done); // Should redirect to login
    });
  });
});
