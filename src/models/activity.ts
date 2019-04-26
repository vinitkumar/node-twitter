// const mongoose = require("mongoose");
import mongoose, {Model, Schema} from "mongoose";
// const Schema = mongoose.Schema;

const ActivitySchema: Schema = new Schema({
  activityStream: { type: String, default: "", maxlength: 400 },
  activityKey: { type: Schema.Types.ObjectId },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});


type schemaOptions = {
  criteria: Object,
  perPage: bigint,
  page: bigint
}

ActivitySchema.statics = {
  list: function(options: schemaOptions) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("sender", "name username provider")
      .populate("receiver", "name username provider")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model("Activity", ActivitySchema);
