import { Request, Response } from 'express';
import * as CarService from '../services/carService';
import { AuthRequest } from '../middleware/authMiddleware';
import Car from '../models/Car';

export const getAllCars = async (req: AuthRequest, res: Response) => {
  try {
      const { make, year, min_price, max_price, status, page, limit } = req.query;
      const filters = {
        make: make as string,
        year: year ? parseInt(year as string) : undefined,
        min_price: min_price ? parseInt(min_price as string) : undefined,
        max_price: max_price ? parseInt(max_price as string) : undefined,
        status: status as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };
      
      const userId = req.user?._id;
      const cars = await CarService.fetchAllCars(userId, filters);
      res.status(200).json(cars);
  } catch (error) {
      res.status(500).json({ message: "Error fetching cars", error: (error as Error).message });
  }
};

export const getDealerCars = async (req: AuthRequest, res: Response) => {
  try {
    const dealer_id = req.user._id;
    const cars = await Car.find({ dealer_id });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dealer cars", error: (error as Error).message });
  }
};

export const createCar = async (req: AuthRequest, res: Response) => {
    try {
        // Ensure user is a dealer
        if (!req.user.roles.includes('dealer')) {
          res.status(403).json({ message: "Only dealers can list cars" });
          return;
        }

        const carData = {
          ...req.body,
          dealer_id: req.user._id
        };

        const newCar = await CarService.createNewCar(carData);
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ message: "Error adding car", error: (error as Error).message });
    }
};

export const updateCar = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dealer_id = req.user._id;

    const car = await Car.findOne({ _id: id, dealer_id });
    if (!car) {
      res.status(404).json({ message: "Car not found or unauthorized" });
      return;
    }

    Object.assign(car, req.body);
    await car.save();

    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ message: "Error updating car", error: (error as Error).message });
  }
};

export const deleteCar = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const dealer_id = req.user._id;

    const result = await Car.deleteOne({ _id: id, dealer_id });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Car not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error: (error as Error).message });
  }
};
