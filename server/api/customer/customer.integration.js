'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCustomer;

describe('Customer API:', function () {
  describe('GET /api/customers', function () {
    var customers;

    beforeEach(function (done) {
      request(app)
        .get('/api/customers')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          customers = res.body;
          done();
        });
    });

    it('should respond with JSON', function () {
      expect(customers).to.be.instanceOf(Object);
    });
  });

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

  describe('PUT /api/customers/:id', function () {
    var updatedCustomer;

    beforeEach(function (done) {
      request(app)
        .put(`/api/customers/${newCustomer._id}`)
        .send({
          name: {first: 'update customer first', last: 'update customer last'},
          salutation: 'update customer'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedCustomer = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedCustomer = {};
    });

    it('should respond with the updated customer', function () {
      expect(updatedCustomer.name.first).to.equal('update customer first');
      expect(updatedCustomer.name.last).to.equal('update customer last');
      expect(updatedCustomer.salutation).to.equal('update customer');
    });

    it('should respond with the updated customer on a subsequent GET', function (done) {
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
          let customer = res.body;

          expect(customer.name.first).to.equal('update customer first');
          expect(customer.name.last).to.equal('update customer last');
          expect(customer.salutation).to.equal('update customer');

          done();
        });
    });
  });

  describe('PATCH /api/customers/:id', function () {
    var patchedCustomer;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/customers/${newCustomer._id}`)
        .send([
          {op: 'replace', path: '/name/first', value: 'Patched Customer first'},
          {op: 'replace', path: '/name/last', value: 'Patched Customer last'},
          {op: 'replace', path: '/salutation', value: 'This is the patched customer!!!'}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedCustomer = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedCustomer = {};
    });

    it('should respond with the patched customer', function () {
      expect(patchedCustomer.name.first).to.equal('Patched Customer first');
      expect(patchedCustomer.name.last).to.equal('Patched Customer last');
      expect(patchedCustomer.salutation).to.equal('This is the patched customer!!!');
    });
  });

  describe('DELETE /api/customers/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/customers/${newCustomer._id}`)
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

    it('should respond with 404 when customer does not exist', function (done) {
      request(app)
        .delete(`/api/customers/${newCustomer._id}`)
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
