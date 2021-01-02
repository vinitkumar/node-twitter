"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Activity = mongoose_1["default"].model("Activity");
exports.index = function (req, res) {
    var activities;
    var options = {};
    Activity.list(options).then(function (result) {
        activities = result;
        return res.render("pages/activity", {
            activities: activities
        });
    });
};
