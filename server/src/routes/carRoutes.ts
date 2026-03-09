import { Router } from 'express';
import { createCar, getAllCars, getCarById, getDealerCars, updateCar, deleteCar } from '../controllers/carController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAllCars);
router.get('/dealer', protect, getDealerCars);
router.get('/:id', protect, getCarById);
router.post('/', protect, createCar);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);

export default router;
