'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var logResultCtrlStub = {
  index: 'logResultCtrl.index',
  show: 'logResultCtrl.show',
  create: 'logResultCtrl.create',
  upsert: 'logResultCtrl.upsert',
  patch: 'logResultCtrl.patch',
  destroy: 'logResultCtrl.destroy'
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
var logResultIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './logResult.controller': logResultCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('LogResult API Router:', function () {
  it('should return an express router instance', function () {
    expect(logResultIndex).to.equal(routerStub);
  });

  describe('GET /api/logResults', function () {
    it('should be authenticated and route to logResult.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'logResultCtrl.index')
      );
    });
  });

  describe('GET /api/logResults/:id', function () {
    it('should be authenticated and route to logResult.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'logResultCtrl.show')
      );
    });
  });

  describe('POST /api/logResults', function () {
    it('should be authenticated and route to logResult.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'logResultCtrl.create')
      );
    });
  });

  describe('PUT /api/logResults/:id', function () {
    it('should be authenticated and route to logResult.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'logResultCtrl.upsert')
      );
    });
  });

  describe('PATCH /api/logResults/:id', function () {
    it('should be authenticated and route to logResult.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'logResultCtrl.patch')
      );
    });
  });

  describe('DELETE /api/logResults/:id', function () {
    it('should verify VIF Admin role and route to logResult.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'logResultCtrl.destroy')
      );
    });
  });
});
