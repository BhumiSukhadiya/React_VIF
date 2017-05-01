'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var customerCtrlStub = {
  index: 'customerCtrl.index',
  show: 'customerCtrl.show',
  create: 'customerCtrl.create',
  upsert: 'customerCtrl.upsert',
  patch: 'customerCtrl.patch',
  destroy: 'customerCtrl.destroy'
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
var customerIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './customer.controller': customerCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Customer API Router:', function () {
  it('should return an express router instance', function () {
    expect(customerIndex).to.equal(routerStub);
  });

  describe('GET /api/customers', function () {
    it('should be authenticated and route to customer.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'customerCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/customers/:id', function () {
    it('should be authenticated and route to customer.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'customerCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/customers/:id', function () {
    it('should be authenticated and route to customer.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'customerCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/customers/:id', function () {
    it('should verify VIF Admin role and route to customer.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'customerCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
