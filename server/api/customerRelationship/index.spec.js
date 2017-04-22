'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var customerRelationshipCtrlStub = {
  index: 'customerRelationshipCtrl.index',
  show: 'customerRelationshipCtrl.show',
  create: 'customerRelationshipCtrl.create',
  upsert: 'customerRelationshipCtrl.upsert',
  patch: 'customerRelationshipCtrl.patch',
  destroy: 'customerRelationshipCtrl.destroy'
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
var customerRelationshipIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './customerRelationship.controller': customerRelationshipCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('CustomerRelationship API Router:', function () {
  it('should return an express router instance', function () {
    expect(customerRelationshipIndex).to.equal(routerStub);
  });

  describe('GET /api/customerRelationships', function () {
    it('should be authenticated and route to customerRelationship.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'customerRelationshipCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/customerRelationships/:id', function () {
    it('should be authenticated and route to customerRelationship.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'customerRelationshipCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/customerRelationships', function () {
    it('should be authenticated and to customerRelationship.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'customerRelationshipCtrl.create')
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/customerRelationships/:id', function () {
    it('should be authenticated and route to customerRelationship.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'customerRelationshipCtrl.upsert')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/customerRelationships/:id', function () {
    it('should be authenticated and route to customerRelationship.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'customerRelationshipCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/customerRelationships/:id', function () {
    it('should verify VIF Admin role and route to customerRelationship.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'customerRelationshipCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
