"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Activity = mongoose_1.default.model("Activity");
exports.index = (req, res) => {
    let activities;
    let options = {};
    Activity.list(options).then(function (result) {
        activities = result;
        return res.render("pages/activity", {
            activities: activities
        });
    });
};
//# sourceMappingURL=activity.js.map