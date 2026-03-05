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
const CarSchema = new mongoose_1.Schema({
    dealer_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    license_plate: { type: String, required: true, unique: true },
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
exports.default = mongoose_1.default.model('Car', CarSchema);
