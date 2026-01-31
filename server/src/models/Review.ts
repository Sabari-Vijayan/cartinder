import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  car_id: mongoose.Types.ObjectId;
  reviewer_id: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  car_id: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  reviewer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, {
  timestamps: true // This will handle created_at automatically
});

export default mongoose.model<IReview>('Review', ReviewSchema);
