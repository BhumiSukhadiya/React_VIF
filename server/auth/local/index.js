'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';
import {ERRORS as errorMessages} from '../../config/constants';

var router = express.Router();

router.post('/', function (req, res, next) {
  return passport.authenticate('local', function (err, user, info) {
    let error = err || info;
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(500).json({message: errorMessages.INTERNAL_SERVER});
    }

    let token = signToken(user._id);
    return res.json({token});
  })(req, res, next);
});

export default router;
