'use strict';

var express = require('express');
var controller = require('./roadToSale.controller.js');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/getMaxStepPosition', auth.isAuthenticated(), controller.getMaxStepPosition);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.put('/', auth.isAuthenticated(), controller.changeOrder);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.hasRole('vifAdmin'), controller.destroy);

module.exports = router;
