import mongoose, { Schema, Document } from 'mongoose';

export interface ISwipe extends Document {
  user_id: mongoose.Types.ObjectId;
  car_id: mongoose.Types.ObjectId;
  action: 'like' | 'pass' | 'superlike';
}

const SwipeSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  car_id: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  action: { 
    type: String, 
    enum: ['like', 'pass', 'superlike'], 
    required: true 
  }
}, {
  timestamps: true
});

// A user should only be able to swipe on a specific car once
SwipeSchema.index({ user_id: 1, car_id: 1 }, { unique: true });

export default mongoose.model<ISwipe>('Swipe', SwipeSchema, 'swipes');
