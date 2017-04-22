'use strict';

var express = require('express');
var controller = require('./rooftop.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/:id/parentCompany', auth.isAuthenticated(), controller.getAll);
router.post('/', auth.hasRole('vifAdmin'), multipartyMiddleware, controller.create);
router.put('/:id', auth.hasRole('vifAdmin'), multipartyMiddleware, controller.upsert);
router.patch('/:id', auth.hasRole('vifAdmin'), controller.patch);
router.delete('/:id', auth.hasRole('vifAdmin'), controller.destroy);

module.exports = router;
