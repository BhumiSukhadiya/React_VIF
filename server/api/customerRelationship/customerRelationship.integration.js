'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCustomerRelationship;

describe('CustomerRelationship API:', function () {
  describe('GET /api/customerRelationships', function () {
    var customerRelationships;

    beforeEach(function (done) {
      request(app)
        .get('/api/customerRelationships')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerRelationships = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(customerRelationships).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/customerRelationships', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/customerRelationships')
        .send({
          relateType: 'Father'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCustomerRelationship = res.body;
          done();
        });
    });

    it('should respond with the newly created customerRelationship', function () {
      expect(newCustomerRelationship.relateType).to.equal('Father');
    });
  });

  describe('GET /api/customerRelationships/:id', function () {
    var customerRelationship;

    beforeEach(function (done) {
      request(app)
        .get(`/api/customerRelationships/${newCustomerRelationship._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customerRelationship = res.body;
          done();
        });
    });

    afterEach(function () {
      customerRelationship = {};
    });

    it('should respond with the requested customerRelationship', function () {
      expect(customerRelationship.relateType).to.equal('Father');
    });
  });

  describe('PUT /api/customerRelationships/:id', function () {
    var updatedCustomerRelationship;

    beforeEach(function (done) {
      request(app)
        .put(`/api/customerRelationships/${newCustomerRelationship._id}`)
        .send({
          relateType: 'Mother'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedCustomerRelationship = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedCustomerRelationship = {};
    });

    it('should respond with the updated customerRelationship', function () {
      expect(updatedCustomerRelationship.relateType).to.equal('Mother');
    });

    it('should respond with the updated customerRelationship on a subsequent GET', function (done) {
      request(app)
        .get(`/api/customerRelationships/${newCustomerRelationship._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let customerRelationship = res.body;

          expect(customerRelationship.relateType).to.equal('Mother');

          done();
        });
    });
  });

  describe('PATCH /api/customerRelationships/:id', function () {
    var patchedCustomerRelationship;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/customerRelationships/${newCustomerRelationship._id}`)
        .send([
          {op: 'replace', path: '/relateType', value: 'Spouse'}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedCustomerRelationship = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedCustomerRelationship = {};
    });

    it('should respond with the patched customerRelationship', function () {
      expect(patchedCustomerRelationship.relateType).to.equal('Spouse');
    });
  });

  describe('DELETE /api/customerRelationships/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/customerRelationships/${newCustomerRelationship._id}`)
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

    it('should respond with 404 when customerRelationship does not exist', function (done) {
      request(app)
        .delete(`/api/customerRelationships/${newCustomerRelationship._id}`)
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
