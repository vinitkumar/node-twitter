const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Notification = new Schema({
  type: { type: Number },
  activity: { type: Schema.ObjectId, ref: "Activity" }
});

mongoose.model("Notification", Notification);
