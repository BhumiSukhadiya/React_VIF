'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../../..');
import request from 'supertest';

var newInventory;

describe('Inventory API:', function () {
  describe('GET /api/inventories', function () {
    var inventories;

    beforeEach(function (done) {
      request(app)
        .get('/api/inventories')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          inventories = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(inventories).to.be.instanceOf(Object);
    });
  });

  describe('POST /api/inventories', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/inventories')
        .send({
          vin: 'MH05HR95161234567',
          stockNumber: 'S0259',
          status: 'Sold',
          stockType: 'Used',
          year: 2014,
          make: 'Harley Davidson',
          model: 'Fat Boy',
          trim: '4WD'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newInventory = res.body;
          done();
        });
    });

    it('should respond with the newly created inventory', function () {
      expect(newInventory.vin).to.equal('MH05HR95161234567');
      expect(newInventory.stockNumber).to.equal('S0259');
    });
  });

  describe('GET /api/inventories/:id', function () {
    var inventory;

    beforeEach(function (done) {
      request(app)
        .get(`/api/inventories/${newInventory._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          inventory = res.body;
          done();
        });
    });

    afterEach(function () {
      inventory = {};
    });

    it('should respond with the requested inventory', function () {
      expect(inventory.vin).to.equal('MH05HR95161234567');
      expect(inventory.stockNumber).to.equal('S0259');
    });
  });

  describe('PUT /api/inventories/:id', function () {
    var updatedInventory;

    beforeEach(function (done) {
      request(app)
        .put(`/api/inventories/${newInventory._id}`)
        .send({
          vin: 'MH05HR62241234567',
          stockNumber: 'S0468'
        })
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedInventory = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedInventory = {};
    });

    it('should respond with the updated inventory', function () {
      expect(updatedInventory.vin).to.equal('MH05HR62241234567');
      expect(updatedInventory.stockNumber).to.equal('S0468');
    });

    it('should respond with the updated inventory on a subsequent GET', function (done) {
      request(app)
        .get(`/api/inventories/${newInventory._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let inventory = res.body;

          expect(inventory.vin).to.equal('MH05HR62241234567');
          expect(inventory.stockNumber).to.equal('S0468');

          done();
        });
    });
  });

  describe('PATCH /api/inventories/:id', function () {
    var patchedInventory;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/inventories/${newInventory._id}`)
        .send([
          {op: 'replace', path: '/vin', value: 'MH08GA63312345678'},
          {op: 'replace', path: '/stockNumber', value: 'S0693'}
        ])
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedInventory = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedInventory = {};
    });

    it('should respond with the patched inventory', function () {
      expect(patchedInventory.vin).to.equal('MH08GA63312345678');
      expect(patchedInventory.stockNumber).to.equal('S0693');
    });
  });

  describe('DELETE /api/inventories/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/inventories/${newInventory._id}`)
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

    it('should respond with 404 when inventory does not exist', function (done) {
      request(app)
        .delete(`/api/inventories/${newInventory._id}`)
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
