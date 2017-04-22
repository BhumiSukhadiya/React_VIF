'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var customerVehicleCtrlStub = {
  index: 'customerVehicleCtrl.index',
  show: 'customerVehicleCtrl.show',
  create: 'customerVehicleCtrl.create',
  upsert: 'customerVehicleCtrl.upsert',
  patch: 'customerVehicleCtrl.patch',
  destroy: 'customerVehicleCtrl.destroy'
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
var customerVehicleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './customerVehicle.controller': customerVehicleCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('CustomerVehicle API Router:', function () {
  it('should return an express router instance', function () {
    expect(customerVehicleIndex).to.equal(routerStub);
  });

  describe('GET /api/customerVehicles', function () {
    it('should be authenticated and route to customerVehicle.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'customerVehicleCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/customerVehicles/:id', function () {
    it('should be authenticated and route to customerVehicle.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'customerVehicleCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/customerVehicles', function () {
    it('should be authenticated and route to customerVehicle.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'customerVehicleCtrl.create')
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/customerVehicles/:id', function () {
    it('should be authenticated and route to customerVehicle.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'customerVehicleCtrl.upsert')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/customerVehicles/:id', function () {
    it('should be authenticated and route to customerVehicle.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'customerVehicleCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/customerVehicles/:id', function () {
    it('should verify VIF Admin role and route to customerVehicle.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'customerVehicleCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
