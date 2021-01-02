"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Notification = new Schema({
    type: { type: Number },
    activity: { type: mongoose_1.default.Types.ObjectId, ref: "Activity" }
});
mongoose_1.default.model("Notification", Notification);
//# sourceMappingURL=notification.js.map