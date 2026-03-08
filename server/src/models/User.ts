import mongoose, { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
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
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(this: IUser) {
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed for:', this.email);
  } catch (err: any) {
    console.error('Bcrypt error:', err);
    throw err;
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(this: IUser, password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema, 'users');
