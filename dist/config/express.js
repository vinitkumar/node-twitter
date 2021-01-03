"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
// const express = require("express");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const compression_1 = __importDefault(require("compression"));
// const favicon = require('serve-favicon');
const errorhandler_1 = __importDefault(require("errorhandler"));
const mongoStore = require("connect-mongo")(express_session_1.default);
const express_flash_1 = __importDefault(require("express-flash"));
// const flash = require("connect-flash");
const helpers = require("view-helpers");
const body_parser_1 = __importDefault(require("body-parser"));
// const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const Raven = require("raven");
// Disable Raven console alerts
Raven.disableConsoleAlerts();
const moment_1 = __importDefault(require("moment"));
// const moment = require("moment");
const morgan = require("morgan");
module.exports = (app, config, passport) => {
    app.set("showStackError", true);
    app.locals.moment = moment_1.default;
    // use morgan for logging
    app.use(morgan("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
        stream: process.stderr
    }));
    // use morgan for logging
    app.use(morgan("dev", {
        skip: function (req, res) {
            return res.statusCode >= 400;
        },
        stream: process.stdout
    }));
    // setup Sentry to get any crashes
    if (process.env.SENTRY_DSN !== null) {
        Raven.config(process.env.SENTRY_DSN).install();
        app.use(Raven.requestHandler());
        app.use(Raven.errorHandler());
    }
    app.use(compression_1.default({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
        },
        level: 9
    }));
    // app.use(favicon());
    app.use(express_1.default.static(config.root + "/public"));
    if (process.env.NODE_ENV === "development") {
        app.use(errorhandler_1.default());
        app.locals.pretty = true;
    }
    app.set("views", config.root + "/app/views");
    app.set("view engine", "pug");
    app.use(helpers(config.app.name));
    app.use(cookieParser());
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.use(body_parser_1.default.json());
    app.use(methodOverride("_method"));
    app.use(express_session_1.default({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({
            url: config.db,
            collection: "sessions"
        })
    }));
    app.use(express_flash_1.default());
    app.use(passport.initialize());
    app.use(passport.session());
    app.disable('view cache');
    app.use((err, req, res, next) => {
        if (err.message.indexOf("not found") !== -1) {
            return next();
        }
        console.log(err.stack);
        res.status(500).render("pages/500", { error: err.stack });
    });
};
//# sourceMappingURL=express.js.map