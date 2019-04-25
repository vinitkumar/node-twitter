"use strict";
exports.__esModule = true;
/**
 * Module dependencies
 */
var express_1 = require("express");
var express_session_1 = require("express-session");
var compression_1 = require("compression");
// const favicon = require('serve-favicon');
var errorhandler_1 = require("errorhandler");
var connect_mongo_1 = require("connect-mongo");
var connect_flash_1 = require("connect-flash");
var view_helpers_1 = require("view-helpers");
var body_parser_1 = require("body-parser");
var method_override_1 = require("method-override");
var cookie_parser_1 = require("cookie-parser");
var raven_1 = require("raven");
var moment_1 = require("moment");
var morgan_1 = require("morgan");
module.exports = function (app, config, passport) {
    app.set("showStackError", true);
    app.locals.moment = moment_1["default"];
    // use morgan for logging
    app.use(morgan_1["default"]("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
        stream: process.stderr
    }));
    // use morgan for logging
    app.use(morgan_1["default"]("dev", {
        skip: function (req, res) {
            return res.statusCode >= 400;
        },
        stream: process.stdout
    }));
    // setup Sentry to get any crashes
    if (process.env.SENTRY_DSN !== null) {
        raven_1["default"].config(process.env.SENTRY_DSN).install();
        app.use(raven_1["default"].requestHandler());
        app.use(raven_1["default"].errorHandler());
    }
    app.use(compression_1["default"]({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
        },
        level: 9
    }));
    // app.use(favicon());
    app.use(express_1["default"].static(config.root + "../../public"));
    if (process.env.NODE_ENV === "development") {
        app.use(errorhandler_1["default"]());
        app.locals.pretty = true;
    }
    app.set("views", config.root + "/views");
    app.set("view engine", "pug");
    app.use(view_helpers_1["default"](config.app.name));
    app.use(cookie_parser_1["default"]());
    app.use(body_parser_1["default"].urlencoded({
        extended: true
    }));
    app.use(body_parser_1["default"].json());
    app.use(method_override_1["default"]("_method"));
    app.use(express_session_1["default"]({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new connect_mongo_1["default"]({
            url: config.db,
            collection: "sessions"
        })
    }));
    app.use(connect_flash_1["default"]());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function (err, req, res, next) {
        if (err.message.indexOf("not found") !== -1) {
            return next();
        }
        console.log(err.stack);
        res.status(500).render("pages/500", { error: err.stack });
    });
};
