import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user._id;
    const notifications = await Notification.find({ recipient_id: user_id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: (error as Error).message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    await Notification.findOneAndUpdate(
      { _id: id, recipient_id: user_id },
      { is_read: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: (error as Error).message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user._id;
    await Notification.updateMany(
      { recipient_id: user_id, is_read: false },
      { is_read: true }
    );
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error: (error as Error).message });
  }
};

// Internal utility to create notification
export const createNotification = async (data: any) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
