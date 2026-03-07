import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Booking from '../models/Booking';
import Car from '../models/Car';
import { createNotification } from './notificationController';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { car_id, time_slot, pricing_snapshot } = req.body;
    const renter_id = req.user._id;

    const car = await Car.findById(car_id);
    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    const newBooking = new Booking({
      car_id,
      renter_id,
      dealer_id: car.dealer_id,
      time_slot,
      pricing_snapshot,
      status: 'pending_payment'
    });

    await newBooking.save();

    // Notify dealer
    await createNotification({
      recipient_id: car.dealer_id,
      sender_id: renter_id,
      type: 'booking_update',
      title: 'New Booking Request',
      message: `You have a new booking request for your ${car.specs.make} ${car.specs.model}.`,
      link: '/dealer'
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: (error as Error).message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user._id;
    const bookings = await Booking.find({ renter_id: user_id })
      .populate('car_id')
      .populate('dealer_id', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: (error as Error).message });
  }
};

export const getDealerBookings = async (req: AuthRequest, res: Response) => {
  try {
    const dealer_id = req.user._id;
    const bookings = await Booking.find({ dealer_id })
      .populate('car_id')
      .populate('renter_id', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dealer bookings', error: (error as Error).message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user._id;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Check if user is either renter or dealer
    if (booking.renter_id.toString() !== user_id.toString() && booking.dealer_id.toString() !== user_id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    booking.status = status;
    await booking.save();

    // Notify renter
    await createNotification({
      recipient_id: booking.renter_id,
      type: 'booking_update',
      title: 'Booking Status Updated',
      message: `Your booking for ${booking.status === 'confirmed' ? 'confirmed' : booking.status}!`,
      link: '/profile'
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: (error as Error).message });
  }
};
