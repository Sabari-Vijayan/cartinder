import { Router } from 'express';
import { recordSwipe, getLikedCars, removeSwipe } from '../controllers/swipeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, recordSwipe);
router.get('/likes', protect, getLikedCars);
router.delete('/:carId', protect, removeSwipe);

export default router;
