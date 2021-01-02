"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ActivitySchema = new Schema({
    activityStream: { type: String, default: "", maxlength: 400 },
    activityKey: { type: mongoose_1.default.Types.ObjectId },
    sender: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});
ActivitySchema.statics = {
    list: function (options) {
        const criteria = options.criteria || {};
        return this.find(criteria)
            .populate("sender", "name username provider")
            .populate("receiver", "name username provider")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    }
};
mongoose_1.default.model("Activity", ActivitySchema);
//# sourceMappingURL=activity.js.map