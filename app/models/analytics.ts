import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  ip: string;
  user: Schema.Types.ObjectId;
  url: string;
  createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    ip: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    url: String,
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

AnalyticsSchema.statics = {
  list: function (options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate('user', 'name username provider')
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model('Analytics', AnalyticsSchema);
