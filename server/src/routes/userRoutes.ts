import { Router } from 'express';
import { getAllUsers, getProfile, updateProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
