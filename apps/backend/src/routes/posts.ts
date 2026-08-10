import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getFeed, createPost, getPost, likePost } from '../services/postService';

const router = Router();

router.get('/feed', authenticate, getFeed as any);
router.post('/', authenticate, createPost as any);
router.get('/:postId', getPost);
router.post('/:postId/like', authenticate, likePost as any);

export default router;
