import { Request, Response } from 'express';
import Swipe from '../models/Swipe';
import { AuthRequest } from '../middleware/authMiddleware';

export const recordSwipe = async (req: AuthRequest, res: Response) => {
  try {
    const { car_id, action } = req.body;
    const user_id = req.user._id;

    if (!['like', 'pass', 'superlike'].includes(action)) {
      res.status(400).json({ message: 'Invalid action' });
      return;
    }

    // Check if the user already swiped on this car
    const existingSwipe = await Swipe.findOne({ user_id, car_id });
    if (existingSwipe) {
       res.status(400).json({ message: 'Already swiped on this car' });
       return;
    }

    const newSwipe = new Swipe({
      user_id,
      car_id,
      action
    });

    await newSwipe.save();

    res.status(201).json({ message: 'Swipe recorded', swipe: newSwipe });
  } catch (error) {
    res.status(500).json({ message: 'Error recording swipe', error: (error as Error).message });
  }
};

// Get all cars the logged-in user has "liked" or "superliked"
export const getLikedCars = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user._id;
    
    // Find all 'like' or 'superlike' swipes and populate the car details
    const likes = await Swipe.find({ 
      user_id, 
      action: { $in: ['like', 'superlike'] } 
    }).populate('car_id');

    // Extract just the car objects and filter out nulls (in case a car was deleted)
    const likedCars = likes
      .map(swipe => swipe.car_id)
      .filter(car => car !== null);
    
    res.status(200).json(likedCars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liked cars', error: (error as Error).message });
  }
};
