/**
 * Module dependencies
 */

var express = require('express');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var helpers = require('view-helpers');
var compression = require('compression');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var morgan = require('morgan');
var errorhandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var multer = require('multer');

module.exports = (app, config, passport) => {
  app.set('showStackError', true);

  app.use(compression({
    filter: function(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
  
  // setup the logger
  app.use(morgan('combined'));
  app.use(serveStatic(config.root + '/public'));
  if (app.get('env') === 'development') {
    app.use(errorhandler())
  }
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  app.use(helpers(config.app.name));
  app.use(cookieParser());

  // app.use(bodyParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'noobjs',
    store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }));

  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((err, req, res, next) => {
    if (err.message.indexOf('not found') !== -1) {
      return next();
    }
    console.log(err.stack);

    res.status(500).render('500', {error: err.stack});
  });

  app.use((req, res) => {
    res.status(404).render('404', {
      url: req.originalUrl, error: 'Not found'
    });
  });

};
