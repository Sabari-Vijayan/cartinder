import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Chat from '../models/Chat';
import Message from '../models/Message';
import mongoose from 'mongoose';
import { createNotification } from './notificationController';

// Get all chats for the logged-in user
export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user._id;
    const chats = await Chat.find({ participants: user_id })
      .populate('participants', 'name email profile.pic_url')
      .sort({ last_updated: -1 });
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: (error as Error).message });
  }
};

// Get messages for a specific chat
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const user_id = req.user._id;

    // Verify user is part of the chat
    const chat = await Chat.findOne({ _id: chatId, participants: user_id });
    if (!chat) {
      res.status(403).json({ message: 'Not authorized to view this chat' });
      return;
    }

    const messages = await Message.find({ chat_id: chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: (error as Error).message });
  }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId, content } = req.body;
    const sender_id = req.user._id;

    // Verify user is part of the chat
    const chat = await Chat.findOne({ _id: chatId, participants: sender_id });
    if (!chat) {
      res.status(403).json({ message: 'Not authorized to send messages in this chat' });
      return;
    }

    const newMessage = new Message({
      chat_id: chatId,
      sender_id,
      content
    });

    await newMessage.save();

    // Notify recipient
    const recipient_id = chat.participants.find(p => p.toString() !== sender_id.toString());
    if (recipient_id) {
      await createNotification({
        recipient_id,
        sender_id,
        type: 'new_message',
        title: 'New Message',
        message: `${req.user.name} sent you a message.`,
        link: `/chat/${chatId}`
      });
    }

    // Update chat last message info
    chat.last_message = content;
    chat.last_updated = new Date();
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: (error as Error).message });
  }
};

// Start or get a chat with another user
export const startChat = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId } = req.body;
    const sender_id = req.user._id;

    if (sender_id.toString() === recipientId) {
      res.status(400).json({ message: 'Cannot start a chat with yourself' });
      return;
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [sender_id, new mongoose.Types.ObjectId(recipientId)] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [sender_id, recipientId]
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error starting chat', error: (error as Error).message });
  }
};
