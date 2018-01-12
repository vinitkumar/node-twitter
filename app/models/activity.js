const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Activity = new Schema({
  activityStream: {type: String, default: "", maxlength: 400},
  activityKey:{ type: Schema.ObjectId},
  sender: { type: Schema.ObjectId, ref: "User"},
  receiver: { type: Schema.ObjectId, ref: "User"},
  createdAt: { type: Date, default: Date.now }
});

mongoose.model("Activity", Activity);
