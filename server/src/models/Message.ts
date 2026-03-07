import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chat_id: mongoose.Types.ObjectId;
  sender_id: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
}

const MessageSchema: Schema = new Schema({
  chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IMessage>('Message', MessageSchema, 'messages');
