'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var rooftopCtrlStub = {
  index: 'rooftopCtrl.index',
  show: 'rooftopCtrl.show',
  create: 'rooftopCtrl.create',
  upsert: 'rooftopCtrl.upsert',
  patch: 'rooftopCtrl.patch',
  destroy: 'rooftopCtrl.destroy'
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
var rooftopIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './rooftop.controller': rooftopCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Rooftop API Router:', function() {
  it('should return an express router instance', function() {
    expect(rooftopIndex).to.equal(routerStub);
  });

  describe('GET /api/rooftops', function() {
    it('should be authenticated and route to rooftop.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'rooftopCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/rooftops/:id', function() {
    it('should be authenticated and route to rooftop.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'rooftopCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/rooftops/:id', function() {
    it('should verify VIF Admin role and route to rooftop.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'rooftopCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/rooftops/:id', function() {
    it('should verify VIF Admin role and route to rooftop.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'rooftopCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
