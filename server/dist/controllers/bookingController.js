"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getDealerBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Car_1 = __importDefault(require("../models/Car"));
const notificationController_1 = require("./notificationController");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { car_id, time_slot, pricing_snapshot } = req.body;
        const renter_id = req.user._id;
        const car = yield Car_1.default.findById(car_id);
        if (!car) {
            res.status(404).json({ message: 'Car not found' });
            return;
        }
        const newBooking = new Booking_1.default({
            car_id,
            renter_id,
            dealer_id: car.dealer_id,
            time_slot,
            pricing_snapshot,
            status: 'pending_payment'
        });
        yield newBooking.save();
        // Notify dealer
        yield (0, notificationController_1.createNotification)({
            recipient_id: car.dealer_id,
            sender_id: renter_id,
            type: 'booking_update',
            title: 'New Booking Request',
            message: `You have a new booking request for your ${car.specs.make} ${car.specs.model}.`,
            link: '/dealer'
        });
        res.status(201).json(newBooking);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});
exports.createBooking = createBooking;
const getMyBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        const bookings = yield Booking_1.default.find({ renter_id: user_id })
            .populate('car_id')
            .populate('dealer_id', 'name email');
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});
exports.getMyBookings = getMyBookings;
const getDealerBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dealer_id = req.user._id;
        const bookings = yield Booking_1.default.find({ dealer_id })
            .populate('car_id')
            .populate('renter_id', 'name email');
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dealer bookings', error: error.message });
    }
});
exports.getDealerBookings = getDealerBookings;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user_id = req.user._id;
        const booking = yield Booking_1.default.findById(id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        // Check if user is either renter or dealer
        if (booking.renter_id.toString() !== user_id.toString() && booking.dealer_id.toString() !== user_id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        booking.status = status;
        yield booking.save();
        // Notify renter
        yield (0, notificationController_1.createNotification)({
            recipient_id: booking.renter_id,
            type: 'booking_update',
            title: 'Booking Status Updated',
            message: `Your booking for ${booking.status === 'confirmed' ? 'confirmed' : booking.status}!`,
            link: '/profile'
        });
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
});
exports.updateBookingStatus = updateBookingStatus;
