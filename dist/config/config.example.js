"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const rootPath = path_1.default.normalize(__dirname + "/..");
module.exports = {
    development: {
        db: "",
        root: rootPath,
        app: {
            name: "Node Twitter"
        },
        github: {
            clientID: "",
            clientSecret: "",
            callbackURL: ""
        }
    },
    test: {
        db: "",
        root: rootPath,
        app: {
            name: "Node Twitter"
        },
        github: {
            clientID: "",
            clientSecret: "",
            callbackURL: ""
        }
    },
    production: {
        db: "",
        root: rootPath,
        app: {
            name: "Node Twitter"
        },
        github: {
            clientID: "",
            clientSecret: "",
            callbackURL: ""
        }
    }
};
//# sourceMappingURL=config.example.js.map