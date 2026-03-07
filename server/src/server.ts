import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import carRoutes from './routes/carRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import swipeRoutes from './routes/swipeRoutes';
import chatRoutes from './routes/chatRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('CarTinder API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server running ${process.env.NODE_ENV || 'development mode' } on port ${PORT}`);
});
