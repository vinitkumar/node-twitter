/**
 * Module dependencies
 */
const express = require("express");
const session = require('express-session');
const compression = require('compression');
// const favicon = require('serve-favicon');
const errorHandler = require('errorhandler');
const mongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const helpers = require("view-helpers");
const bodyParser  = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const Raven = require('raven');
const moment = require('moment');
const morgan = require('morgan');

module.exports = (app, config, passport) => {
  app.set("showStackError", true);
  app.locals.moment = moment;

  // use morgan for logging
  app.use(morgan('dev', {
    skip: function (req, res) {
      return res.statusCode < 400;
    }, stream: process.stderr
  }));


  // use morgan for logging
  app.use(morgan('dev', {
    skip: function (req, res) {
      return res.statusCode >= 400
    }, stream: process.stdout
  }));
  // setup Sentry to get any crashes
  if (process.env.SENTRY_DSN !== null) {
    Raven.config(process.env.SENTRY_DSN).install();
    app.use(Raven.requestHandler());
    app.use(Raven.errorHandler());
  }
  app.use(
    compression({
      filter: function(req, res) {
        return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
      },
      level: 9
    })
  );
  // app.use(favicon());
  app.use(express.static(config.root + "/public"));

  if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
    app.locals.pretty = true;
  }

  app.set("views", config.root + "/app/views");
  app.set("view engine", "pug");


  app.use(helpers(config.app.name));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride('_method'));
  app.use(
    session({
      secret: "noobjs",
      resave: false,
      saveUninitialized: false,
      store: new mongoStore({
        url: config.db,
        collection: "sessions"
      })
    })
  );

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((err, req, res, next) => {
    if (err.message.indexOf("not found") !== -1) {
      return next();
    }
    console.log(err.stack);

    res.status(500).render("pages/500", { error: err.stack });
  });
};
