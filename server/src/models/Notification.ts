import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient_id: mongoose.Types.ObjectId;
  sender_id?: mongoose.Types.ObjectId;
  type: 'booking_update' | 'new_message' | 'system';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['booking_update', 'new_message', 'system'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  is_read: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for faster queries
NotificationSchema.index({ recipient_id: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
