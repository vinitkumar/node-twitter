"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
var AnalyticsSchema = new Schema({
    ip: String,
    user: { type: mongoose_1["default"].Types.ObjectId, ref: "User" },
    url: String,
    createdAt: { type: Date, "default": Date.now }
});
AnalyticsSchema.statics = {
    list: function (options) {
        var criteria = options.criteria || {};
        return this.find(criteria)
            .populate("user", "name username provider")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    }
};
mongoose_1["default"].model("Analytics", AnalyticsSchema);
