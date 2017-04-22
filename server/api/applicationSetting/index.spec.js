'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var applicationSettingCtrlStub = {
  index: 'applicationSettingCtrl.index',
  show: 'applicationSettingCtrl.show',
  create: 'applicationSettingCtrl.create',
  upsert: 'applicationSettingCtrl.upsert',
  patch: 'applicationSettingCtrl.patch',
  destroy: 'applicationSettingCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var applicationSettingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './applicationSetting.controller': applicationSettingCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('ApplicationSetting API Router:', function() {
  it('should return an express router instance', function() {
    expect(applicationSettingIndex).to.equal(routerStub);
  });

  describe('GET /api/applicationSettings', function() {
    it('should be authenticated and route to applicationSetting.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'applicationSettingCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/applicationSettings/:id', function() {
    it('should be authenticated and route to applicationSetting.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'applicationSettingCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/applicationSettings', function() {
    it('should verify VIF Admin role and route to applicationSetting.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.vifAdmin', 'applicationSettingCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/applicationSettings/:id', function() {
    it('should verify VIF Admin role and route to applicationSetting.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'applicationSettingCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/applicationSettings/:id', function() {
    it('should verify VIF Admin role and route to applicationSetting.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'applicationSettingCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/applicationSettings/:id', function() {
    it('should verify VIF Admin role and route to applicationSetting.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'applicationSettingCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
