'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var vifModuleCtrlStub = {
  index: 'vifModuleCtrl.index',
  show: 'vifModuleCtrl.show',
  create: 'vifModuleCtrl.create',
  upsert: 'vifModuleCtrl.upsert',
  patch: 'vifModuleCtrl.patch',
  destroy: 'vifModuleCtrl.destroy'
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
var vifModuleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './vifModule.controller': vifModuleCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('VifModule API Router:', function() {
  it('should return an express router instance', function() {
    expect(vifModuleIndex).to.equal(routerStub);
  });

  describe('GET /api/vifModules', function() {
    it('should be authenticated and route to vifModule.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'vifModuleCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/vifModules/:id', function() {
    it('should be authenticated and route to vifModule.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'vifModuleCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/vifModules', function() {
    it('should verify VIF Admin role and route to vifModule.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.vifAdmin', 'vifModuleCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/vifModules/:id', function() {
    it('should verify VIF Admin role and route to vifModule.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'vifModuleCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/vifModules/:id', function() {
    it('should verify VIF Admin role and route to vifModule.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'vifModuleCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/vifModules/:id', function() {
    it('should verify VIF Admin role and route to vifModule.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'vifModuleCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
