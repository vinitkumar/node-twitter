"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
var ActivitySchema = new Schema({
    activityStream: { type: String, "default": "", maxlength: 400 },
    activityKey: { type: mongoose_1["default"].Types.ObjectId },
    sender: { type: mongoose_1["default"].Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1["default"].Types.ObjectId, ref: "User" },
    createdAt: { type: Date, "default": Date.now }
});
ActivitySchema.statics = {
    list: function (options) {
        var criteria = options.criteria || {};
        return this.find(criteria)
            .populate("sender", "name username provider")
            .populate("receiver", "name username provider")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    }
};
mongoose_1["default"].model("Activity", ActivitySchema);
