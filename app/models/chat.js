const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  message: { type: String, default: "", trim: true, maxlength: 200},
  sender: { type: Schema.ObjectId, ref: "User" },
  receiver: { type: Schema.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("Chat", ChatSchema);