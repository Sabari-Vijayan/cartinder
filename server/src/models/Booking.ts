import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  car_id: mongoose.Types.ObjectId;
  renter_id: mongoose.Types.ObjectId;
  dealer_id: mongoose.Types.ObjectId;
  time_slot: {
    start: Date;
    end: Date;
  };
  status: 'pending_payment' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pricing_snapshot: {
    rate_type: string;
    unit_price: number;
    units_booked: number;
    extra_charges: { [key: string]: number };
    subtotal: number;
    platform_fee: number;
  };
  payment?: {
    transaction_id: string;
    order_id: string;
    amount_paid: number;
    currency: string;
    status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
    method: string;
    timestamp: Date;
  };
}

const BookingSchema: Schema = new Schema({
  car_id: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  renter_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dealer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  time_slot: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending_payment'
  },
  pricing_snapshot: {
    rate_type: { type: String, required: true },
    unit_price: { type: Number, required: true },
    units_booked: { type: Number, required: true },
    extra_charges: { type: Map, of: Number, default: {} },
    subtotal: { type: Number, required: true },
    platform_fee: { type: Number, required: true }
  },
  payment: {
    transaction_id: { type: String },
    order_id: { type: String },
    amount_paid: { type: Number },
    currency: { type: String },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded']
    },
    method: { type: String },
    timestamp: { type: Date }
  }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
