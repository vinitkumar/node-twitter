import mongoose, {Document, Model, Schema} from "mongoose";


const AnalyticsSchema = new Schema({
  ip: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  url: String,
  createdAt: { type: Date, default: Date.now }
});

interface iGithub extends Document {
  avatar_url: string,
}

interface iUser extends Document {
  username: string,
  _id: string,
  name: string,
  github: iGithub,
}


interface iAnalytics extends Document {
  ip: string,
  user: iUser,
  url: string,
  createdAt: string
}

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
