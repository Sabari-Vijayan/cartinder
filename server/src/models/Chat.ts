import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  last_message: string;
  last_updated: Date;
}

const ChatSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  last_message: { type: String, default: '' },
  last_updated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IChat>('Chat', ChatSchema);
