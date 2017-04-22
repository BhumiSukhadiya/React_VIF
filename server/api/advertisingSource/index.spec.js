'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var advertisingSourceCtrlStub = {
  index: 'advertisingSourceCtrl.index',
  show: 'advertisingSourceCtrl.show',
  create: 'advertisingSourceCtrl.create',
  upsert: 'advertisingSourceCtrl.upsert',
  patch: 'advertisingSourceCtrl.patch',
  destroy: 'advertisingSourceCtrl.destroy'
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
var advertisingSourceIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './advertisingSource.controller': advertisingSourceCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('AdvertisingSource API Router:', function() {
  it('should return an express router instance', function() {
    expect(advertisingSourceIndex).to.equal(routerStub);
  });

  describe('GET /api/advertisingSources', function() {
    it('should be authenticated and route to advertisingSource.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'advertisingSourceCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/advertisingSources/:id', function() {
    it('should be authenticated and route to advertisingSource.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'advertisingSourceCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/advertisingSources', function() {
    it('should verify Dealer Manager role and route to advertisingSource.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.dealerManager', 'advertisingSourceCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/advertisingSources/:id', function() {
    it('should verify Dealer Manager role and route to advertisingSource.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.dealerManager', 'advertisingSourceCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/advertisingSources/:id', function() {
    it('should verify Dealer Manager role and route to advertisingSource.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.dealerManager', 'advertisingSourceCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/advertisingSources/:id', function() {
    it('should verify VIF Admin role and route to advertisingSource.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'advertisingSourceCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
