import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Notification = new Schema({
  type: { type: Number },
  activity: { type: mongoose.Types.ObjectId, ref: "Activity" }
});

mongoose.model("Notification", Notification);
