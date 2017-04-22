'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var deskLogCtrlStub = {
  index: 'deskLogCtrl.index',
  show: 'deskLogCtrl.show',
  create: 'deskLogCtrl.create',
  upsert: 'deskLogCtrl.upsert',
  patch: 'deskLogCtrl.patch',
  destroy: 'deskLogCtrl.destroy'
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
var deskLogIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './deskLog.controller': deskLogCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('DeskLog API Router:', function () {
  it('should return an express router instance', function () {
    expect(deskLogIndex).to.equal(routerStub);
  });

  describe('GET /api/deskLogs', function () {
    it('should be authenticated and route to deskLog.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'deskLogCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/deskLogs/:id', function () {
    it('should be authenticated and route to deskLog.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'deskLogCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/deskLogs', function () {
    it('should be authenticated and route to deskLog.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'deskLogCtrl.create')
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/deskLogs/:id', function () {
    it('should be authenticated and route to deskLog.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'deskLogCtrl.upsert')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/deskLogs/:id', function () {
    it('should be authenticated and route to deskLog.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'deskLogCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/deskLogs/:id', function () {
    it('should verify VIF Admin role and route to deskLog.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'deskLogCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
