"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Analytics = mongoose_1.default.model('Analytics');
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.analytics = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.ip !== undefined) {
        const crudeIpArray = req.ip.split(':');
        const ipArrayLength = crudeIpArray.length;
        // cleanup IP to remove unwanted characters
        const cleanIp = crudeIpArray[ipArrayLength - 1];
        Analytics.findOne({ user: req.user }).sort({ createdAt: -1 }).exec(function (err, analytics) {
            let date = new Date();
            if (analytics !== null) {
                if (new Date(analytics.createdAt).getDate() !== date.getDate()) {
                    if (req.get('host').split(':')[0] !== 'localhost') {
                        const analytics = new Analytics({
                            ip: cleanIp,
                            user: req.user,
                            url: url
                        });
                        analytics.save(err => {
                            if (err) {
                                logger_1.default.log(err);
                            }
                        });
                    }
                }
                else {
                    logger_1.default.log('Not creating a new analytics entry on the same day');
                }
            }
        });
    }
    next();
};
//# sourceMappingURL=logger.js.map