'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDeskLog;
var newCustomer;
describe('DeskLog API:', function () {

  // CREATE NEW CUSTOMER FOR TEST CASE
  // START

  describe('POST /api/customers', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/customers')
        .send({
          name: {first: 'customer first', last: 'customer last'},
          salutation: 'new customer',
          address: {state: 'DE'}
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCustomer = res.body;
          done();
        });
    });

    it('should respond with the newly created customer', function () {
      expect(newCustomer.name.first).to.equal('customer first');
      expect(newCustomer.name.last).to.equal('customer last');
      expect(newCustomer.salutation).to.equal('new customer');
    });
  });

  describe('GET /api/customers/:id', function () {
    var customer;

    beforeEach(function (done) {
      request(app)
        .get(`/api/customers/${newCustomer._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customer = res.body;
          done();
        });
    });

    afterEach(function () {
      customer = {};
    });

    it('should respond with the requested customer', function () {
      expect(customer.name.first).to.equal('customer first');
      expect(customer.name.last).to.equal('customer last');
      expect(customer.salutation).to.equal('new customer');
    });
  });

  // END

  describe('GET /api/deskLogs', function () {
    var deskLogs;

    beforeEach(function (done) {
      request(app)
        .get('/api/deskLogs')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          deskLogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(deskLogs).to.be.instanceOf(Object);
    });
  });

  describe('POST /api/deskLogs', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/deskLogs')
        .send({
          type: 'UP',
          customer: newCustomer._id
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newDeskLog = res.body;
          done();
        });
    });

    it('should respond with the newly created deskLog', function () {
      expect(newDeskLog.type).to.equal('UP');
    });
  });

  describe('GET /api/deskLogs/:id', function () {
    var deskLog;

    beforeEach(function (done) {
      request(app)
        .get(`/api/deskLogs/${newDeskLog._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          deskLog = res.body;
          done();
        });
    });

    afterEach(function () {
      deskLog = {};
    });

    it('should respond with the requested deskLog', function () {
      expect(deskLog.type).to.equal('UP');
    });
  });

  describe('PUT /api/deskLogs/:id', function () {
    var updatedDeskLog;

    beforeEach(function (done) {
      request(app)
        .put(`/api/deskLogs/${newDeskLog._id}`)
        .send({
          type: 'BB'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedDeskLog = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedDeskLog = {};
    });

    it('should respond with the updated deskLog', function () {
      expect(updatedDeskLog.type).to.equal('BB');
    });

    it('should respond with the updated deskLog on a subsequent GET', function (done) {
      request(app)
        .get(`/api/deskLogs/${newDeskLog._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let deskLog = res.body;

          expect(deskLog.type).to.equal('BB');

          done();
        });
    });
  });

  describe('PATCH /api/deskLogs/:id', function () {
    var patchedDeskLog;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/deskLogs/${newDeskLog._id}`)
        .send([
          {op: 'replace', path: '/type', value: 'PU'}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedDeskLog = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedDeskLog = {};
    });

    it('should respond with the patched deskLog', function () {
      expect(patchedDeskLog.type).to.equal('PU');
    });
  });

  describe('DELETE /api/deskLogs/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/deskLogs/${newDeskLog._id}`)
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

    it('should respond with 404 when deskLog does not exist', function (done) {
      request(app)
        .delete(`/api/deskLogs/${newDeskLog._id}`)
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
