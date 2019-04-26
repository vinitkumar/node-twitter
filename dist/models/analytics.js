"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AnalyticsSchema = new mongoose_1.Schema({
    ip: String,
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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