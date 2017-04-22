'use strict';

var express = require('express');
var controller = require('./controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/getMakes', auth.isAuthenticated(), controller.getMakes);
router.get('/getModels/:make', auth.isAuthenticated(), controller.getModels);
router.get('/decode/:vin', auth.isAuthenticated(), controller.decodeVin);

module.exports = router;
