"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose");
const mongoose_1 = __importStar(require("mongoose"));
// const Schema = mongoose.Schema;
const ActivitySchema = new mongoose_1.Schema({
    activityStream: { type: String, default: "", maxlength: 400 },
    activityKey: { type: mongoose_1.Schema.Types.ObjectId },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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