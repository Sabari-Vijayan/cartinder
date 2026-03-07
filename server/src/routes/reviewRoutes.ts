import { Router } from 'express';
import { createReview, getCarReviews } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createReview);
router.get('/car/:carId', getCarReviews);

export default router;
