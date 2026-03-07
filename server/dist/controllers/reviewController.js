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
exports.getCarReviews = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Car_1 = __importDefault(require("../models/Car"));
const Booking_1 = __importDefault(require("../models/Booking"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { car_id, rating, comment } = req.body;
        const reviewer_id = req.user._id;
        // 1. Check if the user has a completed booking for this car
        const booking = yield Booking_1.default.findOne({
            car_id,
            renter_id: reviewer_id,
            status: 'completed'
        });
        if (!booking) {
            res.status(403).json({ message: 'You can only review cars you have successfully rented.' });
            return;
        }
        // 2. Check if the user has already reviewed this car
        const existingReview = yield Review_1.default.findOne({ car_id, reviewer_id });
        if (existingReview) {
            res.status(400).json({ message: 'You have already reviewed this car.' });
            return;
        }
        // 3. Create the review
        const newReview = new Review_1.default({
            car_id,
            reviewer_id,
            rating,
            comment
        });
        yield newReview.save();
        // 4. Update Car stats (average rating and review count)
        const car = yield Car_1.default.findById(car_id);
        if (car) {
            const totalReviews = car.stats.review_count + 1;
            const newAvgRating = ((car.stats.avg_rating * car.stats.review_count) + rating) / totalReviews;
            car.stats.avg_rating = Number(newAvgRating.toFixed(1));
            car.stats.review_count = totalReviews;
            yield car.save();
        }
        res.status(201).json(newReview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
});
exports.createReview = createReview;
const getCarReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carId } = req.params;
        const reviews = yield Review_1.default.find({ car_id: carId })
            .populate('reviewer_id', 'name profile')
            .sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});
exports.getCarReviews = getCarReviews;
