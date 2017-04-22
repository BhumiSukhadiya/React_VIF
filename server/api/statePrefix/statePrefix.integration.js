'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newStatePrefix;

describe('StatePrefix API:', function() {
  describe('GET /api/statePrefixes', function() {
    var statePrefixes;

    beforeEach(function(done) {
      request(app)
        .get('/api/statePrefixes')
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          statePrefixes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(statePrefixes).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/statePrefixes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/statePrefixes')
        .set('authorization', `Bearer ${global.token}`)
        .send({
          state: 'New StatePrefix',
          abbreviation: 'NS',
          prefix: 1
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStatePrefix = res.body;
          done();
        });
    });

    it('should respond with the newly created statePrefix', function() {
      expect(newStatePrefix.state).to.equal('New StatePrefix');
      expect(newStatePrefix.abbreviation).to.equal('NS');
      expect(newStatePrefix.prefix).to.equal(1);
    });
  });

  describe('GET /api/statePrefixes/:id', function() {
    var statePrefix;

    beforeEach(function(done) {
      request(app)
        .get(`/api/statePrefixes/${newStatePrefix._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          statePrefix = res.body;
          done();
        });
    });

    afterEach(function() {
      statePrefix = {};
    });

    it('should respond with the requested statePrefix', function() {
      expect(statePrefix.state).to.equal('New StatePrefix');
      expect(statePrefix.abbreviation).to.equal('NS');
      expect(statePrefix.prefix).to.equal(1);
    });
  });

  describe('PUT /api/statePrefixes/:id', function() {
    var updatedStatePrefix;

    beforeEach(function(done) {
      request(app)
        .put(`/api/statePrefixes/${newStatePrefix._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send({
          state: 'Updated StatePrefix',
          abbreviation: 'US',
          prefix: 2
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStatePrefix = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStatePrefix = {};
    });

    it('should respond with the updated statePrefix', function() {
      expect(updatedStatePrefix.state).to.equal('Updated StatePrefix');
      expect(updatedStatePrefix.abbreviation).to.equal('US');
      expect(updatedStatePrefix.prefix).to.equal(2);
    });

    it('should respond with the updated statePrefix on a subsequent GET', function(done) {
      request(app)
        .get(`/api/statePrefixes/${newStatePrefix._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let statePrefix = res.body;

          expect(statePrefix.state).to.equal('Updated StatePrefix');
          expect(statePrefix.abbreviation).to.equal('US');
          expect(statePrefix.prefix).to.equal(2);

          done();
        });
    });
  });

  describe('PATCH /api/statePrefixes/:id', function() {
    var patchedStatePrefix;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/statePrefixes/${newStatePrefix._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send([
          { op: 'replace', path: '/state', value: 'Patched StatePrefix' },
          { op: 'replace', path: '/abbreviation', value: 'PS' },
          { op: 'replace', path: '/prefix', value: '3' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStatePrefix = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStatePrefix = {};
    });

    it('should respond with the patched statePrefix', function() {
      expect(patchedStatePrefix.state).to.equal('Patched StatePrefix');
      expect(patchedStatePrefix.abbreviation).to.equal('PS');
      expect(patchedStatePrefix.prefix).to.equal(3);
    });
  });

  describe('DELETE /api/statePrefixes/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/statePrefixes/${newStatePrefix._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when statePrefix does not exist', function(done) {
      request(app)
        .delete(`/api/statePrefixes/${newStatePrefix._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
