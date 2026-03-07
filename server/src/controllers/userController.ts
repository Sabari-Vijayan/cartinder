import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserService.fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: (error as Error).message });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, profile_pic } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (profile_pic) {
      if (!user.profile) user.profile = { joined_at: new Date() };
      user.profile.pic_url = profile_pic;
    }

    const updatedUser = await user.save();
    
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profile: updatedUser.profile,
      roles: updatedUser.roles
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: (error as Error).message });
  }
};
