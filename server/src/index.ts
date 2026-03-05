import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User';
import Car from './models/Car';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || ""; 

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Cartinder API is running...');
});

// GET all users
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// GET all cars
app.get('/api/cars', async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
});

// POST a new car
app.post('/api/cars', async (req: Request, res: Response) => {
  try {
    // Note: In a real app, you'd get dealer_id from auth session
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: "Error adding car", error });
  }
});

// Single Database Connection Logic
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
