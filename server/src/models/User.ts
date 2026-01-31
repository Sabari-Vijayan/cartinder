import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  roles: string[];
  status: {
    is_banned: boolean;
    current_state: 'active' | 'suspended' | 'under_review';
    history: string[];
  };
  profile: {
    pic_url?: string;
    joined_at: Date;
  };
  saved_payment_methods: {
    method_type: string;
    provider: string;
    token?: string;
    last4?: string;
    vpa?: string;
    is_default?: boolean;
  }[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: { 
    type: [String], 
    enum: ['buyer', 'dealer', 'admin'],
    default: ['buyer'] 
  },
  status: {
    is_banned: { type: Boolean, default: false },
    current_state: { 
      type: String, 
      enum: ['active', 'suspended', 'under_review'], 
      default: 'active' 
    },
    history: { type: [String], default: [] }
  },
  profile: {
    pic_url: { type: String },
    joined_at: { type: Date, default: Date.now }
  },
  saved_payment_methods: [{
    method_type: { type: String, required: true }, // e.g., 'card', 'upi'
    provider: { type: String, required: true },    // e.g., 'razorpay'
    token: { type: String },                       // Optional (for cards)
    last4: { type: String },                       // Optional (for cards)
    vpa: { type: String },                         // Optional (for UPI)
    is_default: { type: Boolean, default: false }
  }]
}, {
  timestamps: true // Keeps createdAt/updatedAt at the root level as well
});

export default mongoose.model<IUser>('User', UserSchema, 'users');
