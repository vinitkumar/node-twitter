import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  message: string;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  createdAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    message: { type: String, default: '', trim: true, maxlength: 200 },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ChatSchema.statics = {
  load: function (options: any, cb: any) {
    options.select = options.select || 'message sender receiver createdAt';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  },
  list: function (options: any) {
    const criteria = options.criteria || {};
    return this.find(criteria)
      .populate('sender', 'name username github')
      .populate('receiver', 'name username github')
      .sort({ createdAt: -1 })
      .limit(options.perPage)
      .skip(options.perPage * options.page);
  }
};

mongoose.model('Chat', ChatSchema);
