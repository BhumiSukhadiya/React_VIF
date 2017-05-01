'use strict';

var express = require('express');
var controller = require('./controller');
var auth = require('../../../auth/auth.service');

var router = express.Router();

router.get('/get', auth.isAuthenticated(), controller.getNada);

module.exports = router;
