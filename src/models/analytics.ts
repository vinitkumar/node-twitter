import mongoose, {Document, Model, Schema} from "mongoose";

const AnalyticsSchema = new Schema({
  ip: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  url: String,
  createdAt: { type: Date, default: Date.now }
});

type schemaOptions = {
  criteria: Object,
  perPage: bigint,
  page: bigint,
  select: string,
}

AnalyticsSchema.statics = {
  list: function(options: schemaOptions) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate("user", "name username provider")
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model("Analytics", AnalyticsSchema);
