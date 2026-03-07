import mongoose, { Schema, Document } from 'mongoose';

export interface ICar extends Document {
  dealer_id: mongoose.Types.ObjectId;
  license_plate: string;
  image_url?: string;
  description?: string;
  specs: {
    make: string;
    model: string;
    year: number;
    transmission: string;
  };
  status: 'available' | 'rented' | 'maintenance' | 'booked' | 'repair' | 'broke_down';
  stats: {
    total_trips: number;
    total_kms: number;
    last_service_date?: Date;
    avg_rating: number;
    review_count: number;
  };
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  rates: {
    currency: string;
    per_hour?: number;
    per_day: number;
    per_km?: number;
    min_booking_hours?: number;
    security_deposit?: number;
  };
  booked_dates: {
    start: Date;
    end: Date;
  }[];
}

const CarSchema: Schema = new Schema({
  dealer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  license_plate: { type: String, required: true, unique: true },
  image_url: { type: String },
  description: { type: String },
  specs: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    transmission: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'booked', 'repair', 'broke_down'],
    default: 'available'
  },
  stats: {
    total_trips: { type: Number, default: 0 },
    total_kms: { type: Number, default: 0 },
    last_service_date: { type: Date },
    avg_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rates: {
    currency: { type: String, default: 'INR' },
    per_hour: { type: Number },
    per_day: { type: Number, required: true },
    per_km: { type: Number },
    min_booking_hours: { type: Number },
    security_deposit: { type: Number }
  },
  booked_dates: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  }]
}, {
  timestamps: true
});

// Create geospatial index
CarSchema.index({ location: '2dsphere' });

export default mongoose.model<ICar>('Car', CarSchema);
