'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newRoadSale;

describe('RoadSale API:', function () {
  describe('GET /api/roadToSales', function () {
    var roadSales;

    beforeEach(function (done) {
      request(app)
        .get('/api/roadToSales')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          roadSales = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(roadSales).to.be.instanceOf(Array);
    });
  });
});
