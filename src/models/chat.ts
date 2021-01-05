import mongoose from "mongoose";
import {UserDocument} from "./user";
const Schema = mongoose.Schema;

export type ChatDocument = mongoose.Document & {
  message: string,
  sender: UserDocument,
  receiver: UserDocument,
  createdAt: Date
};


const ChatSchema = new Schema({
  message: { type: String, default: "", trim: true, maxlength: 200 },
  sender: { type: mongoose.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

ChatSchema.statics = {
  load: function(options: any, cb: any) {
    options.select = options.select || "message sender receiver createdAt";
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function(options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("sender", "name username github")
      .populate("receiver", "name username github")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model("Chat", ChatSchema);
