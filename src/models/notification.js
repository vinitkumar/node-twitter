"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
var Notification = new Schema({
    type: { type: Number },
    activity: { type: mongoose_1["default"].Types.ObjectId, ref: "Activity" }
});
mongoose_1["default"].model("Notification", Notification);
