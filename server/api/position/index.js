'use strict';

var express = require('express');
var controller = require('./position.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.hasRole('vifAdmin'), controller.create);
router.put('/:id', auth.hasRole('vifAdmin'), controller.upsert);
router.patch('/:id', auth.hasRole('vifAdmin'), controller.patch);
router.delete('/:id', auth.hasRole('vifAdmin'), controller.destroy);

module.exports = router;
