'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var customerResultCtrlStub = {
  index: 'customerResultCtrl.index',
  show: 'customerResultCtrl.show',
  create: 'customerResultCtrl.create',
  upsert: 'customerResultCtrl.upsert',
  patch: 'customerResultCtrl.patch',
  destroy: 'customerResultCtrl.destroy'
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
var customerResultIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './customerResult.controller': customerResultCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('CustomerResult API Router:', function () {
  it('should return an express router instance', function () {
    expect(customerResultIndex).to.equal(routerStub);
  });
});
