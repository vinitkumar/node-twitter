"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const level = process.env.LOG_LEVEL || 'debug';
const logger = new winston_1.default.Logger({
    transports: [
        new winston_1.default.transports.Console({
            level: level,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});
exports.default = logger;
//# sourceMappingURL=logger.js.map