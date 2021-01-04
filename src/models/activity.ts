import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  activityStream: { type: String, default: "", maxlength: 400 },
  activityKey: { type: mongoose.Types.ObjectId },
  sender: { type: mongoose.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

ActivitySchema.statics = {
  list: function(options: any) {
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
