/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import shrinkRay from 'shrink-ray';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
var MongoStore = connectMongo(session);

export default function (app) {
  var env = app.get('env');

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  if (env === 'production') {
    app.use(favicon(path.join(config.root, '/src', 'images/favicon.png')));
  }

  app.set('appPath', path.join(config.root, '/src'));
  app.use(express.static(app.get('appPath')));
  app.use(morgan('dev'));

  app.set('views', `${config.root}/server/views`);
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(shrinkRay());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');
//and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });


  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'web-view-in-focus'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if (env !== 'test' && !process.env.SAUCE_USERNAME) {
    app.use(lusca({
      // csrf: {
      //   angular: true
      // },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  if (env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
