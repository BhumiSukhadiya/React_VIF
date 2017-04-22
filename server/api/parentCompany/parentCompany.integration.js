'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newParentCompany;

describe('ParentCompany API:', function () {
  describe('GET /api/parentCompanies', function () {
    var parentCompanies;

    beforeEach(function (done) {
      request(app)
        .get('/api/parentCompanies')
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          parentCompanies = res.body;
          done();
        });
    });

    it('should respond with JSON array', function () {
      expect(parentCompanies).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/parentCompanies', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/parentCompanies')
        .set('authorization', `Bearer ${global.token}`)
        .send({
          name: 'New ParentCompany',
          address: {state: 'PA'}
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newParentCompany = res.body;
          done();
        });
    });

    it('should respond with the newly created parentCompany', function () {
      expect(newParentCompany.name).to.equal('New ParentCompany');
      expect(newParentCompany.companyId).to.equal('02-0001');
    });
  });

  describe('GET /api/parentCompanies/:id', function () {
    var parentCompany;

    beforeEach(function (done) {
      request(app)
        .get(`/api/parentCompanies/${newParentCompany._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          parentCompany = res.body;
          done();
        });
    });

    afterEach(function () {
      parentCompany = {};
    });

    it('should respond with the requested parentCompany', function () {
      expect(parentCompany.name).to.equal('New ParentCompany');
    });
  });

  describe('PUT /api/parentCompanies/:id', function () {
    var updatedParentCompany;

    beforeEach(function (done) {
      request(app)
        .put(`/api/parentCompanies/${newParentCompany._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send({
          name: 'Updated ParentCompany'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          updatedParentCompany = res.body;
          done();
        });
    });

    afterEach(function () {
      updatedParentCompany = {};
    });

    it('should respond with the updated parentCompany', function () {
      expect(updatedParentCompany.name).to.equal('Updated ParentCompany');
    });

    it('should respond with the updated parentCompany on a subsequent GET', function (done) {
      request(app)
        .get(`/api/parentCompanies/${newParentCompany._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let parentCompany = res.body;

          expect(parentCompany.name).to.equal('Updated ParentCompany');

          done();
        });
    });
  });

  describe('PATCH /api/parentCompanies/:id', function () {
    var patchedParentCompany;

    beforeEach(function (done) {
      request(app)
        .patch(`/api/parentCompanies/${newParentCompany._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send([
          {op: 'replace', path: '/name', value: 'Patched ParentCompany'}
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          patchedParentCompany = res.body;
          done();
        });
    });

    afterEach(function () {
      patchedParentCompany = {};
    });

    it('should respond with the patched parentCompany', function () {
      expect(patchedParentCompany.name).to.equal('Patched ParentCompany');
    });
  });

  describe('DELETE /api/parentCompanies/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/parentCompanies/${newParentCompany._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when parentCompany does not exist', function (done) {
      request(app)
        .delete(`/api/parentCompanies/${newParentCompany._id}`)
        .set('authorization', `Bearer ${global.token}`)
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
