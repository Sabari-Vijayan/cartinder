import { Router } from 'express';
import { recordSwipe, getLikedCars } from '../controllers/swipeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, recordSwipe);
router.get('/likes', protect, getLikedCars);

export default router;
