'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var roleCtrlStub = {
  index: 'roleCtrl.index',
  show: 'roleCtrl.show',
  create: 'roleCtrl.create',
  upsert: 'roleCtrl.upsert',
  patch: 'roleCtrl.patch',
  destroy: 'roleCtrl.destroy'
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
var roleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './role.controller': roleCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Role API Router:', function() {
  it('should return an express router instance', function() {
    expect(roleIndex).to.equal(routerStub);
  });

  describe('GET /api/roles', function() {
    it('should be authenticated and route to role.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'roleCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/roles/:id', function() {
    it('should be authenticated and route to role.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'roleCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/roles', function() {
    it('should verify VIF Admin role and route to role.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.vifAdmin', 'roleCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/roles/:id', function() {
    it('should verify VIF Admin role and route to role.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'roleCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/roles/:id', function() {
    it('should verify VIF Admin role and route to role.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'roleCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/roles/:id', function() {
    it('should verify VIF Admin role and route to role.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'roleCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
