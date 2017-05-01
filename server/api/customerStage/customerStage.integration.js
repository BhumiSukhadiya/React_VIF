'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCustomerStage;

describe('CustomerStage API:', function () {
  describe('GET /api/customerStages', function () {
    var customerStages;

    beforeEach(function (done) {
      request(app)
        .get('/api/customerStages')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerStages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(customerStages).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/customerStages', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/customerStages')
        .send({
          stageName: 'Opportunity'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCustomerStage = res.body;
          done();
        });
    });

    it('should respond with the newly created customerStage', function () {
      expect(newCustomerStage.stageName).to.equal('Opportunity');
    });
  });

  describe('GET /api/customerStages/:id', function () {
    var customerStage;

    beforeEach(function (done) {
      request(app)
        .get(`/api/customerStages/${newCustomerStage._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerStage = res.body;
          done();
        });
    });

    afterEach(function () {
      customerStage = {};
    });

    it('should respond with the requested customerStage', function () {
      expect(customerStage.stageName).to.equal('Opportunity');
    });
  });

  describe('PUT /api/customerStages/:id', function () {
    var updatedCustomerStage;

    beforeEach(function (done) {
      request(app)
        .put(`/api/customerStages/${newCustomerStage._id}`)
        .send({
          stageName: 'Prospect'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedCustomerStage = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedCustomerStage = {};
    });

    it('should respond with the updated customerStage', function () {
      expect(updatedCustomerStage.stageName).to.equal('Prospect');
    });

    it('should respond with the updated customerStage on a subsequent GET', function (done) {
      request(app)
        .get(`/api/customerStages/${newCustomerStage._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let customerStage = res.body;

          expect(customerStage.stageName).to.equal('Prospect');

          done();
        });
    });
  });

  describe('PATCH /api/customerStages/:id', function () {
    var patchedCustomerStage;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/customerStages/${newCustomerStage._id}`)
        .send([
          {op: 'replace', path: '/stageName', value: 'Sold'}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedCustomerStage = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedCustomerStage = {};
    });

    it('should respond with the patched customerStage', function () {
      expect(patchedCustomerStage.stageName).to.equal('Sold');
    });
  });

  describe('DELETE /api/customerStages/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/customerStages/${newCustomerStage._id}`)
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

    it('should respond with 404 when customerStage does not exist', function (done) {
      request(app)
        .delete(`/api/customerStages/${newCustomerStage._id}`)
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
