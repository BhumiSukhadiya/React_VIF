'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newLogResult;

describe('LogResult API:', function () {
  describe('GET /api/logResults', function () {
    var logResults;

    beforeEach(function (done) {
      request(app)
        .get('/api/logResults')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          logResults = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(logResults).to.be.instanceOf(Array);
    });
  });
});
