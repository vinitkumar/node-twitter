const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema({
  ip: String,
  user: { type: Schema.ObjectId, ref: "User" },
  url: String,
  createdAt: { type: Date, default: Date.now }
});

AnalyticsSchema.statics = {
  list: function(options, cb) {
    const criteria = options.criteria || {};
    this.find(criteria)
      .populate("user", "name username provider")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
};

mongoose.model("Analytics", AnalyticsSchema);
