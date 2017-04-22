'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCustomerResults;

describe('CustomerResult API:', function () {
  describe('GET /api/customerResults', function () {
    var customerResults;

    beforeEach(function (done) {
      request(app)
        .get('/api/customerResults')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerResults = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(customerResults).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/customerResults', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/customerResults')
        .send({
          resultName: 'Angry'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCustomerResults = res.body;
          done();
        });
    });

    it('should respond with the newly created customerResult', function () {
      expect(newCustomerResults.resultName).to.equal('Angry');
    });
  });

  describe('GET /api/customerResults/:id', function () {
    var customerResults;

    beforeEach(function (done) {
      request(app)
        .get(`/api/customerResults/${newCustomerResults._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerResults = res.body;
          done();
        });
    });

    afterEach(function () {
      customerResults = {};
    });

    it('should respond with the requested customerResult', function () {
      expect(customerResults.resultName).to.equal('Angry');
    });
  });

  describe('PUT /api/customerResults/:id', function () {
    var updatedCustomerResults;

    beforeEach(function (done) {
      request(app)
        .put(`/api/customerResults/${newCustomerResults._id}`)
        .send({
          resultName: 'Busted Deal'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedCustomerResults = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedCustomerResults = {};
    });

    it('should respond with the updated customerResult', function () {
      expect(updatedCustomerResults.resultName).to.equal('Busted Deal');
    });

    it('should respond with the updated customerResult on a subsequent GET', function (done) {
      request(app)
        .get(`/api/customerResults/${newCustomerResults._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let customerResults = res.body;

          expect(customerResults.resultName).to.equal('Busted Deal');

          done();
        });
    });
  });

  describe('PATCH /api/customerResults/:id', function () {
    var patchedCustomerResults;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/customerResults/${newCustomerResults._id}`)
        .send([
          {op: 'replace', path: '/resultName', value: 'Cannot Finance'}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedCustomerResults = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedCustomerResults = {};
    });

    it('should respond with the patched customerResult', function () {
      expect(patchedCustomerResults.resultName).to.equal('Cannot Finance');
    });
  });

  describe('DELETE /api/customerResult/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/customerResults/${newCustomerResults._id}`)
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

    it('should respond with 404 when customerResult does not exist', function (done) {
      request(app)
        .delete(`/api/customerResults/${newCustomerResults._id}`)
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
