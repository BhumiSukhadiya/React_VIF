'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

describe('Rooftop API:', function() {
  describe('GET /api/rooftops', function() {
    var rooftops;

    beforeEach(function(done) {
      request(app)
        .get('/api/rooftops')
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          rooftops = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(rooftops).to.be.instanceOf(Array);
    });
  });
});
