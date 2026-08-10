import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getVideoFeed, uploadVideo, getVideo, likeVideo } from '../services/videoService';

const router = Router();

router.get('/feed', getVideoFeed);
router.post('/upload', authenticate, uploadVideo as any);
router.get('/:videoId', getVideo);
router.post('/:videoId/like', authenticate, likeVideo as any);

export default router;
