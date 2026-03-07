import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Review from '../models/Review';
import Car from '../models/Car';
import Booking from '../models/Booking';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { car_id, rating, comment } = req.body;
    const reviewer_id = req.user._id;

    // 1. Check if the user has a completed booking for this car
    const booking = await Booking.findOne({
      car_id,
      renter_id: reviewer_id,
      status: 'completed'
    });

    if (!booking) {
      res.status(403).json({ message: 'You can only review cars you have successfully rented.' });
      return;
    }

    // 2. Check if the user has already reviewed this car
    const existingReview = await Review.findOne({ car_id, reviewer_id });
    if (existingReview) {
      res.status(400).json({ message: 'You have already reviewed this car.' });
      return;
    }

    // 3. Create the review
    const newReview = new Review({
      car_id,
      reviewer_id,
      rating,
      comment
    });

    await newReview.save();

    // 4. Update Car stats (average rating and review count)
    const car = await Car.findById(car_id);
    if (car) {
      const totalReviews = car.stats.review_count + 1;
      const newAvgRating = ((car.stats.avg_rating * car.stats.review_count) + rating) / totalReviews;
      
      car.stats.avg_rating = Number(newAvgRating.toFixed(1));
      car.stats.review_count = totalReviews;
      await car.save();
    }

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: (error as Error).message });
  }
};

export const getCarReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { carId } = req.params;
    const reviews = await Review.find({ car_id: carId })
      .populate('reviewer_id', 'name profile')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: (error as Error).message });
  }
};
