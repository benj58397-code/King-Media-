import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getProfile, updateProfile, followUser, unfollowUser, getFollowers } from '../services/userService';

const router = Router();

router.get('/:userId', getProfile);
router.put('/:userId', authenticate, updateProfile as any);
router.post('/:userId/follow', authenticate, followUser as any);
router.delete('/:userId/follow', authenticate, unfollowUser as any);
router.get('/:userId/followers', getFollowers);

export default router;
