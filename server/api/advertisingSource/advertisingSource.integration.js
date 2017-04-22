'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAdvertisingSource;

describe('AdvertisingSource API:', function () {
  describe('GET /api/advertisingSources', function () {
    var advertisingSources;

    beforeEach(function (done) {
      request(app)
        .get('/api/advertisingSources')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          advertisingSources = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(advertisingSources).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/advertisingSources', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/advertisingSources')
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .send({
          name: 'New AdvertisingSource',
          sourceType: 'TV',
          subCategory: 'This is the brand new advertisingSource!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAdvertisingSource = res.body;
          done();
        });
    });

    it('should respond with the newly created advertisingSource', function () {
      expect(newAdvertisingSource.name).to.equal('New AdvertisingSource');
      expect(newAdvertisingSource.sourceType).to.equal('TV');
      expect(newAdvertisingSource.subCategory).to.equal('This is the brand new advertisingSource!!!');
    });
  });

  describe('GET /api/advertisingSources/:id', function () {
    var advertisingSource;

    beforeEach(function (done) {
      request(app)
        .get(`/api/advertisingSources/${newAdvertisingSource._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          advertisingSource = res.body;
          done();
        });
    });

    afterEach(function () {
      advertisingSource = {};
    });

    it('should respond with the requested advertisingSource', function () {
      expect(advertisingSource.name).to.equal('New AdvertisingSource');
      expect(advertisingSource.sourceType).to.equal('TV');
      expect(advertisingSource.subCategory).to.equal('This is the brand new advertisingSource!!!');
    });
  });

  describe('PUT /api/advertisingSources/:id', function () {
    var updatedAdvertisingSource;

    beforeEach(function (done) {
      request(app)
        .put(`/api/advertisingSources/${newAdvertisingSource._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .send({
          name: 'Updated AdvertisingSource',
          sourceType: 'Radio',
          subCategory: 'This is the updated advertisingSource!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedAdvertisingSource = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedAdvertisingSource = {};
    });

    it('should respond with the updated advertisingSource', function () {
      expect(updatedAdvertisingSource.name).to.equal('Updated AdvertisingSource');
      expect(updatedAdvertisingSource.sourceType).to.equal('Radio');
      expect(updatedAdvertisingSource.subCategory).to.equal('This is the updated advertisingSource!!!');
    });

    it('should respond with the updated advertisingSource on a subsequent GET', function (done) {
      request(app)
        .get(`/api/advertisingSources/${newAdvertisingSource._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let advertisingSource = res.body;

          expect(advertisingSource.name).to.equal('Updated AdvertisingSource');
          expect(advertisingSource.sourceType).to.equal('Radio');
          expect(advertisingSource.subCategory).to.equal('This is the updated advertisingSource!!!');

          done();
        });
    });
  });

  describe('PATCH /api/advertisingSources/:id', function () {
    var patchedAdvertisingSource;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/advertisingSources/${newAdvertisingSource._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .set('rooftopid', global.rooftopId)
        .send([
          {op: 'replace', path: '/name', value: 'Patched AdvertisingSource'},
          {op: 'replace', path: '/sourceType', value: 'Newspaper'}
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedAdvertisingSource = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedAdvertisingSource = {};
    });

    it('should respond with the patched advertisingSource', function () {
      expect(patchedAdvertisingSource.name).to.equal('Patched AdvertisingSource');
      expect(patchedAdvertisingSource.sourceType).to.equal('Newspaper');
    });
  });

  describe('DELETE /api/advertisingSources/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/advertisingSources/${newAdvertisingSource._id}`)
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

    it('should respond with 404 when advertisingSource does not exist', function (done) {
      request(app)
        .delete(`/api/advertisingSources/${newAdvertisingSource._id}`)
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
