"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const compression_1 = __importDefault(require("compression"));
// const favicon = require('serve-favicon');
const errorhandler_1 = __importDefault(require("errorhandler"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const view_helpers_1 = __importDefault(require("view-helpers"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const raven_1 = __importDefault(require("raven"));
const moment_1 = __importDefault(require("moment"));
const morgan_1 = __importDefault(require("morgan"));
module.exports = (app, config, passport) => {
    app.set("showStackError", true);
    app.locals.moment = moment_1.default;
    // use morgan for logging
    app.use(morgan_1.default("dev", {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
        stream: process.stderr
    }));
    // use morgan for logging
    app.use(morgan_1.default("dev", {
        skip: function (req, res) {
            return res.statusCode >= 400;
        },
        stream: process.stdout
    }));
    // setup Sentry to get any crashes
    if (process.env.SENTRY_DSN !== null) {
        raven_1.default.config(process.env.SENTRY_DSN).install();
        app.use(raven_1.default.requestHandler());
        app.use(raven_1.default.errorHandler());
    }
    app.use(compression_1.default({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader("Content-Type"));
        },
        level: 9
    }));
    // app.use(favicon());
    app.use(express_1.default.static(config.root + "../../public"));
    if (process.env.NODE_ENV === "development") {
        app.use(errorhandler_1.default());
        app.locals.pretty = true;
    }
    app.set("views", config.root + "/views");
    app.set("view engine", "pug");
    app.use(view_helpers_1.default(config.app.name));
    app.use(cookie_parser_1.default());
    app.use(body_parser_1.default.urlencoded({
        extended: true
    }));
    app.use(body_parser_1.default.json());
    app.use(method_override_1.default("_method"));
    app.use(express_session_1.default({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new connect_mongo_1.default({
            url: config.db,
            collection: "sessions"
        })
    }));
    app.use(connect_flash_1.default());
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
//# sourceMappingURL=express.js.map