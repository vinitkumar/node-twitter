import mongoose, {Document, Model, Schema} from "mongoose";

const Notification = new Schema({
  type: { type: Number },
  activity: { type: Schema.Types.ObjectId, ref: "Activity" }
});

mongoose.model("Notification", Notification);
