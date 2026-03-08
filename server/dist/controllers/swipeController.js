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
exports.getLikedCars = exports.removeSwipe = exports.recordSwipe = void 0;
const Swipe_1 = __importDefault(require("../models/Swipe"));
const recordSwipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { car_id, action } = req.body;
        const user_id = req.user._id;
        if (!['like', 'pass', 'superlike'].includes(action)) {
            res.status(400).json({ message: 'Invalid action' });
            return;
        }
        // Check if the user already swiped on this car
        let swipe = yield Swipe_1.default.findOne({ user_id, car_id });
        if (swipe) {
            swipe.action = action;
            yield swipe.save();
            res.status(200).json({ message: 'Swipe updated', swipe });
            return;
        }
        const newSwipe = new Swipe_1.default({
            user_id,
            car_id,
            action
        });
        yield newSwipe.save();
        res.status(201).json({ message: 'Swipe recorded', swipe: newSwipe });
    }
    catch (error) {
        res.status(500).json({ message: 'Error recording swipe', error: error.message });
    }
});
exports.recordSwipe = recordSwipe;
// Remove a swipe (e.g. to "unlike" a car)
const removeSwipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const user_id = req.user._id;
        const result = yield Swipe_1.default.deleteOne({ user_id, car_id: carId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Swipe not found' });
            return;
        }
        res.status(200).json({ message: 'Swipe removed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing swipe', error: error.message });
    }
});
exports.removeSwipe = removeSwipe;
// Get all cars the logged-in user has "liked" or "superliked"
const getLikedCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        // Find all 'like' or 'superlike' swipes and populate the car details
        const likes = yield Swipe_1.default.find({
            user_id,
            action: { $in: ['like', 'superlike'] }
        }).populate('car_id');
        // Extract just the car objects and filter out nulls (in case a car was deleted)
        const likedCars = likes
            .map(swipe => swipe.car_id)
            .filter(car => car !== null);
        res.status(200).json(likedCars);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching liked cars', error: error.message });
    }
});
exports.getLikedCars = getLikedCars;
