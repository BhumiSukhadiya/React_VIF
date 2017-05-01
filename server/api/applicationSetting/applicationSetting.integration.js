'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newApplicationSetting;

describe('ApplicationSetting API:', function() {
  describe('GET /api/applicationSettings', function() {
    var applicationSettings;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicationSettings')
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          applicationSettings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(applicationSettings).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/applicationSettings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/applicationSettings')
        .set('authorization', `Bearer ${global.token}`)
        .send({
          applicationName: 'New ApplicationSetting',
          siteURL: 'new.com'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newApplicationSetting = res.body;
          done();
        });
    });

    it('should respond with the newly created applicationSetting', function() {
      expect(newApplicationSetting.applicationName).to.equal('New ApplicationSetting');
      expect(newApplicationSetting.siteURL).to.equal('new.com');
    });
  });

  describe('GET /api/applicationSettings/:id', function() {
    var applicationSetting;

    beforeEach(function(done) {
      request(app)
        .get(`/api/applicationSettings/${newApplicationSetting._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          applicationSetting = res.body;
          done();
        });
    });

    afterEach(function() {
      applicationSetting = {};
    });

    it('should respond with the requested applicationSetting', function() {
      expect(applicationSetting.applicationName).to.equal('New ApplicationSetting');
      expect(newApplicationSetting.siteURL).to.equal('new.com');
    });
  });

  describe('PUT /api/applicationSettings/:id', function() {
    var updatedApplicationSetting;

    beforeEach(function(done) {
      request(app)
        .put(`/api/applicationSettings/${newApplicationSetting._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send({
          applicationName: 'Updated ApplicationSetting',
          siteURL: 'updated.com'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedApplicationSetting = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedApplicationSetting = {};
    });

    it('should respond with the updated applicationSetting', function() {
      expect(updatedApplicationSetting.applicationName).to.equal('Updated ApplicationSetting');
      expect(updatedApplicationSetting.siteURL).to.equal('updated.com');
    });

    it('should respond with the updated applicationSetting on a subsequent GET', function(done) {
      request(app)
        .get(`/api/applicationSettings/${newApplicationSetting._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let applicationSetting = res.body;

          expect(applicationSetting.applicationName).to.equal('Updated ApplicationSetting');
          expect(applicationSetting.siteURL).to.equal('updated.com');

          done();
        });
    });
  });

  describe('PATCH /api/applicationSettings/:id', function() {
    var patchedApplicationSetting;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/applicationSettings/${newApplicationSetting._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .send([
          {op: 'replace', path: '/applicationName', value: 'Patched ApplicationSetting'},
          {op: 'replace', path: '/siteURL', value: 'patched.com'}
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedApplicationSetting = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedApplicationSetting = {};
    });

    it('should respond with the patched applicationSetting', function() {
      expect(patchedApplicationSetting.applicationName).to.equal('Patched ApplicationSetting');
      expect(patchedApplicationSetting.siteURL).to.equal('patched.com');
    });
  });

  describe('DELETE /api/applicationSettings/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/applicationSettings/${newApplicationSetting._id}`)
        .set('authorization', `Bearer ${global.token}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicationSetting does not exist', function(done) {
      request(app)
        .delete(`/api/applicationSettings/${newApplicationSetting._id}`)
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
