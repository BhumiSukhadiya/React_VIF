'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var statePrefixCtrlStub = {
  index: 'statePrefixCtrl.index',
  show: 'statePrefixCtrl.show',
  create: 'statePrefixCtrl.create',
  upsert: 'statePrefixCtrl.upsert',
  patch: 'statePrefixCtrl.patch',
  destroy: 'statePrefixCtrl.destroy'
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
var statePrefixIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './statePrefix.controller': statePrefixCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('StatePrefix API Router:', function() {
  it('should return an express router instance', function() {
    expect(statePrefixIndex).to.equal(routerStub);
  });

  describe('GET /api/statePrefixes', function() {
    it('should be authenticated and route to statePrefix.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'statePrefixCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/statePrefixes/:id', function() {
    it('should be authenticated and route to statePrefix.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'statePrefixCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/statePrefixes', function() {
    it('should verify VIF Admin role and route to statePrefix.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.vifAdmin', 'statePrefixCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/statePrefixes/:id', function() {
    it('should verify VIF Admin role and route to statePrefix.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'statePrefixCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/statePrefixes/:id', function() {
    it('should verify VIF Admin role and route to statePrefix.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'statePrefixCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/statePrefixes/:id', function() {
    it('should verify VIF Admin role and route to statePrefix.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.vifAdmin', 'statePrefixCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
