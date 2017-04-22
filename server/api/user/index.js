'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.put('/:id', auth.isAuthenticated(), multipartyMiddleware, controller.upsert);
router.put('/:id/changeModuleOrder', auth.isAuthenticated(), controller.changeModuleOrder);
router.put('/:id/changeBackgroundImage', auth.isAuthenticated(), multipartyMiddleware, controller.changeBackgroundImage);
router.post('/', auth.hasRole('dealerManager'), multipartyMiddleware, controller.create);
router.delete('/:id', auth.hasRole('vifAdmin'), controller.destroy);

module.exports = router;
