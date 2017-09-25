const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema({
  ip: String,
  user: { type: Schema.ObjectId, ref: "User" },
  url: String,
  createdAt: { type: Date, default: Date.now }
});

AnalyticsSchema.statics = {
  list: function(options) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "name username provider")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model("Analytics", AnalyticsSchema);
