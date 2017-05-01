'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newVifModule;

describe('VifModule API:', function() {
  describe('GET /api/vifModules', function() {
    var vifModules;

    beforeEach(function(done) {
      request(app)
        .get('/api/vifModules')
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          vifModules = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(vifModules).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/vifModules', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/vifModules')
        .set('authorization', `Bearer ${global.token}`)
        .send({
          name: 'New VifModule',
          code: 'NVM',
          appLabel: 'NVM'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newVifModule = res.body;
          done();
        });
    });

    it('should respond with the newly created vifModule', function() {
      expect(newVifModule.name).to.equal('New VifModule');
      expect(newVifModule.code).to.equal('NVM');
    });
  });

  describe('GET /api/vifModules/:id', function() {
    var vifModule;

    beforeEach(function(done) {
      request(app)
        .get(`/api/vifModules/${newVifModule._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          vifModule = res.body;
          done();
        });
    });

    afterEach(function() {
      vifModule = {};
    });

    it('should respond with the requested vifModule', function() {
      expect(vifModule.name).to.equal('New VifModule');
      expect(vifModule.code).to.equal('NVM');
    });
  });

  describe('PUT /api/vifModules/:id', function() {
    var updatedVifModule;

    beforeEach(function(done) {
      request(app)
        .put(`/api/vifModules/${newVifModule._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send({
          name: 'Updated VifModule',
          code: 'UVM'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedVifModule = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedVifModule = {};
    });

    it('should respond with the updated vifModule', function() {
      expect(updatedVifModule.name).to.equal('Updated VifModule');
      expect(updatedVifModule.code).to.equal('UVM');
    });

    it('should respond with the updated vifModule on a subsequent GET', function(done) {
      request(app)
        .get(`/api/vifModules/${newVifModule._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let vifModule = res.body;

          expect(vifModule.name).to.equal('Updated VifModule');
          expect(vifModule.code).to.equal('UVM');

          done();
        });
    });
  });

  describe('PATCH /api/vifModules/:id', function() {
    var patchedVifModule;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/vifModules/${newVifModule._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched VifModule' },
          { op: 'replace', path: '/code', value: 'PVM' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedVifModule = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedVifModule = {};
    });

    it('should respond with the patched vifModule', function() {
      expect(patchedVifModule.name).to.equal('Patched VifModule');
      expect(patchedVifModule.code).to.equal('PVM');
    });
  });

  describe('DELETE /api/vifModules/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/vifModules/${newVifModule._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when vifModule does not exist', function(done) {
      request(app)
        .delete(`/api/vifModules/${newVifModule._id}`)
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
