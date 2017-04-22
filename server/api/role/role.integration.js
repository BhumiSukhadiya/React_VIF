'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newRole;

describe('Role API:', function() {
  describe('GET /api/roles', function() {
    var roles;

    beforeEach(function(done) {
      request(app)
        .get('/api/roles')
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          roles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(roles).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/roles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/roles')
        .set('authorization', `Bearer ${global.token}`)
        .send({
          name: 'New Role',
          nameSlug: 'This is the brand new role!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newRole = res.body;
          done();
        });
    });

    it('should respond with the newly created role', function() {
      expect(newRole.name).to.equal('New Role');
      expect(newRole.nameSlug).to.equal('This is the brand new role!!!');
    });
  });

  describe('GET /api/roles/:id', function() {
    var role;

    beforeEach(function(done) {
      request(app)
        .get(`/api/roles/${newRole._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          role = res.body;
          done();
        });
    });

    afterEach(function() {
      role = {};
    });

    it('should respond with the requested role', function() {
      expect(role.name).to.equal('New Role');
      expect(role.nameSlug).to.equal('This is the brand new role!!!');
    });
  });

  describe('PUT /api/roles/:id', function() {
    var updatedRole;

    beforeEach(function(done) {
      request(app)
        .put(`/api/roles/${newRole._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send({
          name: 'Updated Role',
          nameSlug: 'This is the updated role!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedRole = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRole = {};
    });

    it('should respond with the updated role', function() {
      expect(updatedRole.name).to.equal('Updated Role');
      expect(updatedRole.nameSlug).to.equal('This is the updated role!!!');
    });

    it('should respond with the updated role on a subsequent GET', function(done) {
      request(app)
        .get(`/api/roles/${newRole._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let role = res.body;

          expect(role.name).to.equal('Updated Role');
          expect(role.nameSlug).to.equal('This is the updated role!!!');

          done();
        });
    });
  });

  describe('PATCH /api/roles/:id', function() {
    var patchedRole;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/roles/${newRole._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Role' },
          { op: 'replace', path: '/nameSlug', value: 'This is the patched role!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedRole = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedRole = {};
    });

    it('should respond with the patched role', function() {
      expect(patchedRole.name).to.equal('Patched Role');
      expect(patchedRole.nameSlug).to.equal('This is the patched role!!!');
    });
  });

  describe('DELETE /api/roles/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/roles/${newRole._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when role does not exist', function(done) {
      request(app)
        .delete(`/api/roles/${newRole._id}`)
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
