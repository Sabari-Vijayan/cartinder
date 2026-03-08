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
    let swipe = await Swipe.findOne({ user_id, car_id });
    if (swipe) {
       swipe.action = action;
       await swipe.save();
       res.status(200).json({ message: 'Swipe updated', swipe });
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

// Remove a swipe (e.g. to "unlike" a car)
export const removeSwipe = async (req: AuthRequest, res: Response) => {
  try {
    const { carId } = req.params;
    const user_id = req.user._id;

    const result = await Swipe.deleteOne({ user_id, car_id: carId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Swipe not found' });
      return;
    }

    res.status(200).json({ message: 'Swipe removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing swipe', error: (error as Error).message });
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
