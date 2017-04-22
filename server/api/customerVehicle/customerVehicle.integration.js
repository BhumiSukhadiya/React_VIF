'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCustomerVehicle;

describe('CustomerVehicle API:', function () {
  describe('GET /api/customerVehicles', function () {
    var customerVehicles;

    beforeEach(function (done) {
      request(app)
        .get('/api/customerVehicles')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerVehicles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(customerVehicles).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/customerVehicles', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/customerVehicles')
        .send({
          vin: 'MH5 HA 6224',
          year: 2014,
          stockNo: 'S02017',
          stockType: 'OLD',
          status: 'Available',
          statusDate: '2017-01-01',
          make: 'FEB',
          model: 'A7',
          trim: 'A',
          description: 'Test',
          location: 'TX',
          interestType: 'TradeIn'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCustomerVehicle = res.body;
          done();
        });
    });

    it('should respond with the newly created customerVehicle', function () {
      expect(newCustomerVehicle.vin).to.equal('MH5 HA 6224');
      expect(newCustomerVehicle.year).to.equal(2014);
    });
  });

  describe('GET /api/customerVehicles/:id', function () {
    var customerVehicle;

    beforeEach(function (done) {
      request(app)
        .get(`/api/customerVehicles/${newCustomerVehicle._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerVehicle = res.body;
          done();
        });
    });

    afterEach(function () {
      customerVehicle = {};
    });

    it('should respond with the requested customerVehicle', function () {
      expect(customerVehicle.vin).to.equal('MH5 HA 6224');
      expect(customerVehicle.year).to.equal(2014);
    });
  });

  describe('PUT /api/customerVehicles/:id', function () {
    var updatedCustomerVehicle;

    beforeEach(function (done) {
      request(app)
        .put(`/api/customerVehicles/${newCustomerVehicle._id}`)
        .send({
          vin: 'JK5 HR 6224',
          year: 2016
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedCustomerVehicle = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedCustomerVehicle = {};
    });

    it('should respond with the updated customerVehicle', function () {
      expect(updatedCustomerVehicle.vin).to.equal('JK5 HR 6224');
      expect(updatedCustomerVehicle.year).to.equal(2016);
    });

    it('should respond with the updated customerVehicle on a subsequent GET', function (done) {
      request(app)
        .get(`/api/customerVehicles/${newCustomerVehicle._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let customerVehicle = res.body;

          expect(customerVehicle.vin).to.equal('JK5 HR 6224');
          expect(customerVehicle.year).to.equal(2016);

          done();
        });
    });
  });

  describe('PATCH /api/customerVehicles/:id', function () {
    var patchedCustomerVehicle;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/customerVehicles/${newCustomerVehicle._id}`)
        .send([
          {op: 'replace', path: '/vin', value: 'HP5 KJ 6224'},
          {op: 'replace', path: '/year', value: 2011}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedCustomerVehicle = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedCustomerVehicle = {};
    });

    it('should respond with the patched customerVehicle', function () {
      expect(patchedCustomerVehicle.vin).to.equal('HP5 KJ 6224');
      expect(patchedCustomerVehicle.year).to.equal(2011);
    });
  });

  describe('DELETE /api/customerVehicles/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/customerVehicles/${newCustomerVehicle._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when customerVehicle does not exist', function (done) {
      request(app)
        .delete(`/api/customerVehicles/${newCustomerVehicle._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(404)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
