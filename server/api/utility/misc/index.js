'use strict';

var express = require('express');
var controller = require('./controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/constants', auth.isAuthenticated(), controller.getConstants);

module.exports = router;
