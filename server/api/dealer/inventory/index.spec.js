'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var inventoryCtrlStub = {
  index: 'inventoryCtrl.index',
  show: 'inventoryCtrl.show',
  create: 'inventoryCtrl.create',
  upsert: 'inventoryCtrl.upsert',
  patch: 'inventoryCtrl.patch',
  destroy: 'inventoryCtrl.destroy'
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
var inventoryIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './inventory.controller': inventoryCtrlStub,
  '../../../auth/auth.service': authServiceStub
});

describe('Inventory API Router:', function () {
  it('should return an express router instance', function () {
    expect(inventoryIndex).to.equal(routerStub);
  });

  describe('GET /api/inventories', function () {
    it('should be authenticated and route to inventory.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'inventoryCtrl.index')
      );
    });
  });

  describe('GET /api/inventories/:id', function () {
    it('should be authenticated and route to inventory.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'inventoryCtrl.show')
      );
    });
  });

  describe('POST /api/inventories', function () {
    it('should be authenticated and route to inventory.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'inventoryCtrl.create')
      );
    });
  });

  describe('PUT /api/inventories/:id', function () {
    it('should be authenticated and route to inventory.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'inventoryCtrl.upsert')
      );
    });
  });

  describe('PATCH /api/inventories/:id', function () {
    it('should be authenticated and route to inventory.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'inventoryCtrl.patch')
      );
    });
  });

  describe('DELETE /api/inventories/:id', function () {
    it('should verify VIF Admin role and route to inventory.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'inventoryCtrl.destroy')
      );
    });
  });
});
