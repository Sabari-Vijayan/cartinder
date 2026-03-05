"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
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
            provider: { type: String, required: true }, // e.g., 'razorpay'
            token: { type: String }, // Optional (for cards)
            last4: { type: String }, // Optional (for cards)
            vpa: { type: String }, // Optional (for UPI)
            is_default: { type: Boolean, default: false }
        }]
}, {
    timestamps: true // Keeps createdAt/updatedAt at the root level as well
});
exports.default = mongoose_1.default.model('User', UserSchema, 'users');
