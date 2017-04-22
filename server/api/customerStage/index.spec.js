'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var customerStageCtrlStub = {
  index: 'customerStageCtrl.index',
  show: 'customerStageCtrl.show',
  create: 'customerStageCtrl.create',
  upsert: 'customerStageCtrl.upsert',
  patch: 'customerStageCtrl.patch',
  destroy: 'customerStageCtrl.destroy'
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
var customerStageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './customerStage.controller': customerStageCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('CustomerStage API Router:', function () {
  it('should return an express router instance', function () {
    expect(customerStageIndex).to.equal(routerStub);
  });

  describe('GET /api/customerStages', function () {
    it('should be authenticated and route to customerStage.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'customerStageCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/customerStages/:id', function () {
    it('should be authenticated and route to customerStage.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'customerStageCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/customerStages', function () {
    it('should be authenticated and route to customerStage.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'customerStageCtrl.create')
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/customerStages/:id', function () {
    it('should be authenticated and route to customerStage.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'customerStageCtrl.upsert')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/customerStages/:id', function () {
    it('should be authenticated and route to customerStage.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'customerStageCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/customerStages/:id', function () {
    it('should verify VIF Admin role and route to customerStage.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'customerStageCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
