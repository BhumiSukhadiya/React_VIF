'use strict';

var express = require('express');
var controller = require('./advertisingSource.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('dealerManager'), controller.create);
router.put('/:id', auth.hasRole('dealerManager'), controller.upsert);
router.patch('/:id', auth.hasRole('dealerManager'), controller.patch);
router.delete('/:id', auth.hasRole('vifAdmin'), controller.destroy);

module.exports = router;
