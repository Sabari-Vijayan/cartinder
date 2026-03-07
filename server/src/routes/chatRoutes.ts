import { Router } from 'express';
import { getChats, getMessages, sendMessage, startChat } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getChats);
router.get('/:chatId/messages', protect, getMessages);
router.post('/message', protect, sendMessage);
router.post('/start', protect, startChat);

export default router;
