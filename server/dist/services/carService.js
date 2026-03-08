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
exports.createNewCar = exports.fetchAllCars = void 0;
const Car_1 = __importDefault(require("../models/Car"));
const Swipe_1 = __importDefault(require("../models/Swipe"));
const fetchAllCars = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}) {
    const query = {};
    // 1. Exclude already swiped cars for this user
    if (userId) {
        const swipedCarIds = yield Swipe_1.default.find({ user_id: userId }).distinct('car_id');
        query._id = { $nin: swipedCarIds };
    }
    if (filters.make) {
        query['specs.make'] = { $regex: filters.make, $options: 'i' };
    }
    if (filters.year) {
        query['specs.year'] = filters.year;
    }
    if (filters.min_price || filters.max_price) {
        query['rates.per_day'] = {};
        if (filters.min_price)
            query['rates.per_day'].$gte = filters.min_price;
        if (filters.max_price)
            query['rates.per_day'].$lte = filters.max_price;
    }
    if (filters.status) {
        query.status = filters.status;
    }
    else {
        query.status = 'available'; // Default to only available cars
    }
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;
    let cars = yield Car_1.default.find(query)
        .populate('dealer_id', 'name email profile')
        .skip(skip)
        .limit(limit);
    // If no new cars found and it's a search, try including 'passed' cars to make it "infinite"
    if (cars.length === 0 && userId) {
        const likedCarIds = yield Swipe_1.default.find({
            user_id: userId,
            action: { $in: ['like', 'superlike'] }
        }).distinct('car_id');
        const infiniteQuery = Object.assign({}, query);
        infiniteQuery._id = { $nin: likedCarIds };
        cars = yield Car_1.default.find(infiniteQuery)
            .populate('dealer_id', 'name email profile')
            .skip(skip)
            .limit(limit);
    }
    return cars;
});
exports.fetchAllCars = fetchAllCars;
const createNewCar = (carData) => __awaiter(void 0, void 0, void 0, function* () {
    const newCar = new Car_1.default(carData);
    return yield newCar.save();
});
exports.createNewCar = createNewCar;
