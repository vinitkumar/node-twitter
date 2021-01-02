"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ChatSchema = new Schema({
    message: { type: String, default: "", trim: true, maxlength: 200 },
    sender: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});
ChatSchema.statics = {
    load: function (options, cb) {
        options.select = options.select || "message sender receiver createdAt";
        return this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
    },
    list: function (options) {
        const criteria = options.criteria || {};
        return this.find(criteria)
            .populate("sender", "name username github")
            .populate("receiver", "name username github")
            .sort({ createdAt: -1 })
            .limit(options.perPage)
            .skip(options.perPage * options.page);
    }
};
mongoose_1.default.model("Chat", ChatSchema);
//# sourceMappingURL=chat.js.map