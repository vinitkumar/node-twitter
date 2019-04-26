"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Notification = new mongoose_1.Schema({
    type: { type: Number },
    activity: { type: mongoose_1.Schema.Types.ObjectId, ref: "Activity" }
});
mongoose_1.default.model("Notification", Notification);
//# sourceMappingURL=notification.js.map