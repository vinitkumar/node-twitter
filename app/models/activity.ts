import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  activityStream: string;
  activityKey: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    activityStream: { type: String, default: '', maxlength: 400 },
    activityKey: { type: Schema.Types.ObjectId },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ActivitySchema.statics = {
  list: function (options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate('sender', 'name username provider')
      .populate('receiver', 'name username provider')
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model('Activity', ActivitySchema);
