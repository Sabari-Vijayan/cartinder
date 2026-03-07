import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_weekend_project_secret_key_123';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, roles } = req.body;
    console.log('Registration attempt:', { name, email, roles });

    if (!password) {
      res.status(400).json({ message: 'Password is required' });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists:', email);
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      roles: roles || ['buyer']
    });

    console.log('Attempting to save user...');
    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Registration Error details:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: (error as Error).message,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};
