const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const utils = require("../../lib/utils");

const AnnouncementSchema = new Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 100 },
    user: { type: Schema.ObjectId, ref: "User"},
    createdAt: { type: Date, default: Date.now},
  },
  {usePushEach: true }
);


mongoose.model("Annoucement", AnnouncementSchema);
