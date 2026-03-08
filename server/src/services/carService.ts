import Car, { ICar } from '../models/Car';
import Swipe from '../models/Swipe';

export interface CarFilters {
  make?: string;
  year?: number;
  min_price?: number;
  max_price?: number;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchAllCars = async (userId?: string, filters: CarFilters = {}) => {
    const query: any = {};

    // 1. Exclude already swiped cars for this user
    if (userId) {
      const swipedCarIds = await Swipe.find({ user_id: userId }).distinct('car_id');
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
      if (filters.min_price) query['rates.per_day'].$gte = filters.min_price;
      if (filters.max_price) query['rates.per_day'].$lte = filters.max_price;
    }

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = 'available'; // Default to only available cars
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    let cars = await Car.find(query)
      .populate('dealer_id', 'name email profile')
      .skip(skip)
      .limit(limit);

    // If no new cars found and it's a search, try including 'passed' cars to make it "infinite"
    if (cars.length === 0 && userId) {
      const likedCarIds = await Swipe.find({ 
        user_id: userId, 
        action: { $in: ['like', 'superlike'] } 
      }).distinct('car_id');
      
      const infiniteQuery = { ...query };
      infiniteQuery._id = { $nin: likedCarIds };
      
      cars = await Car.find(infiniteQuery)
        .populate('dealer_id', 'name email profile')
        .skip(skip)
        .limit(limit);
    }

    return cars;
};

export const createNewCar = async (carData: Partial<ICar>) => {
    const newCar = new Car(carData);
    return await newCar.save();
};
