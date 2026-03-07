import { Router } from 'express';
import { createBooking, getMyBookings, getDealerBookings, updateBookingStatus } from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/dealer', protect, getDealerBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
