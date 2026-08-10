import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getConversations, sendMessage, getMessages } from '../services/messageService';

const router = Router();

router.get('/conversations', authenticate, getConversations as any);
router.post('/', authenticate, sendMessage as any);
router.get('/conversations/:conversationId', authenticate, getMessages as any);

export default router;
