'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var parentCompanyCtrlStub = {
  index: 'parentCompanyCtrl.index',
  show: 'parentCompanyCtrl.show',
  create: 'parentCompanyCtrl.create',
  upsert: 'parentCompanyCtrl.upsert',
  patch: 'parentCompanyCtrl.patch',
  destroy: 'parentCompanyCtrl.destroy'
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
var parentCompanyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './parentCompany.controller': parentCompanyCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('ParentCompany API Router:', function () {
  it('should return an express router instance', function () {
    expect(parentCompanyIndex).to.equal(routerStub);
  });

  describe('GET /api/parentCompanies', function () {
    it('should be authenticated and route to parentCompany.controller.index', function () {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'parentCompanyCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/parentCompanies/:id', function () {
    it('should be authenticated and route to parentCompany.controller.show', function () {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'parentCompanyCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/parentCompanies', function () {
    it('should verify VIF Admin role and route to parentCompany.controller.create', function () {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.vifAdmin', 'parentCompanyCtrl.create')
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/parentCompanies/:id', function () {
    it('should verify VIF Admin role and route to parentCompany.controller.upsert', function () {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'parentCompanyCtrl.upsert')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/parentCompanies/:id', function () {
    it('should verify VIF Admin role and route to parentCompany.controller.patch', function () {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'parentCompanyCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/parentCompanies/:id', function () {
    it('should verify VIF Admin role and route to parentCompany.controller.destroy', function () {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'parentCompanyCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
