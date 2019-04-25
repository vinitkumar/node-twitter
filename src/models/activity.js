"use strict";
exports.__esModule = true;
// const mongoose = require("mongoose");
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
var ActivitySchema = new Schema({
    activityStream: { type: String, "default": "", maxlength: 400 },
    activityKey: { type: Schema.ObjectId },
    sender: { type: Schema.ObjectId, ref: "User" },
    receiver: { type: Schema.ObjectId, ref: "User" },
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
