'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var roadToSaleCtrlStub = {
  index: 'roadToSaleCtrl.index',
  show: 'roadToSaleCtrl.show',
  create: 'roadToSaleCtrl.create',
  upsert: 'roadToSaleCtrl.upsert',
  patch: 'roadToSaleCtrl.patch',
  destroy: 'roadToSaleCtrl.destroy'
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
var roadToSaleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './roadToSale.controller': roadToSaleCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('roadToSale API Router:', function () {
  it('should return an express router instance', function () {
    expect(roadToSaleIndex).to.equal(routerStub);
  });

  describe('GET /api/roadToSales', function () {
    it('should be authenticated and route to roadToSale.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'roadToSaleCtrl.index')
      );
    });
  });

  describe('GET /api/roadToSales/:id', function () {
    it('should be authenticated and route to roadToSale.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'roadToSaleCtrl.show')
      );
    });
  });

  describe('POST /api/roadToSales', function () {
    it('should be authenticated and route to roadToSale.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'roadToSaleCtrl.create')
      );
    });
  });

  describe('PUT /api/roadToSales/:id', function () {
    it('should be authenticated and route to roadToSale.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'roadToSaleCtrl.upsert')
      );
    });
  });

  describe('PATCH /api/roadToSales/:id', function () {
    it('should be authenticated and route to roadToSale.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'roadToSaleCtrl.patch')
      );
    });
  });

  describe('DELETE /api/roadToSales/:id', function () {
    it('should verify VIF Admin role and route to roadToSale.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'roadToSaleCtrl.destroy')
      );
    });
  });
});
