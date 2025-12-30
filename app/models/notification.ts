import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: number;
  activity: Schema.Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>({
  type: { type: Number },
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' }
});

mongoose.model('Notification', NotificationSchema);
