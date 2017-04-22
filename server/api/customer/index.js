'use strict';

var express = require('express');
var controller = require('./customer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), multipartyMiddleware, controller.create);
router.put('/:id', auth.isAuthenticated(), multipartyMiddleware, controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.hasRole('vifAdmin'), controller.destroy);

module.exports = router;
