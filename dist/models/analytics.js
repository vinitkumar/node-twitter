"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AnalyticsSchema = new Schema({
    ip: String,
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    url: String,
    createdAt: { type: Date, default: Date.now }
});
AnalyticsSchema.statics = {
    list: function (options) {
        const criteria = options.criteria || {};
        return this.find(criteria)
            .populate("user", "name username provider")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    }
};
mongoose_1.default.model("Analytics", AnalyticsSchema);
//# sourceMappingURL=analytics.js.map