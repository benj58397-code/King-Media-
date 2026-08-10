import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getCommunities, createCommunity, joinCommunity, leaveCommunity } from '../services/communityService';

const router = Router();

router.get('/', getCommunities);
router.post('/', authenticate, createCommunity as any);
router.post('/:communityId/join', authenticate, joinCommunity as any);
router.delete('/:communityId/join', authenticate, leaveCommunity as any);

export default router;
