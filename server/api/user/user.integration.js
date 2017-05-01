'use strict';

/* globals describe, expect, it, before, after, beforeEach, afterEach */

import app from '../..';
import request from 'supertest';

describe('User API:', function () {
  describe('GET /api/users/me', function () {
    it('should respond with a user profile when authenticated', function (done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.body._id.toString()).to.equal(global.user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function (done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });
});
