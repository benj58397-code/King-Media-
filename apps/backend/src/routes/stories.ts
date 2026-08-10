import { Router, Request, Response } from 'express';

const router = Router();

// Get stories
router.get('/', (req: Request, res: Response) => {
  // TODO: Fetch user's story feed
  res.json({ stories: [] });
});

// Create story
router.post('/', (req: Request, res: Response) => {
  const { media, caption, duration } = req.body;
  // TODO: Create story
  res.status(201).json({
    id: 'story-id',
    caption,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
});

// Delete story
router.delete('/:storyId', (req: Request, res: Response) => {
  const { storyId } = req.params;
  // TODO: Delete story
  res.json({ message: 'Story deleted', storyId });
});

// View story
router.post('/:storyId/view', (req: Request, res: Response) => {
  const { storyId } = req.params;
  // TODO: Record story view
  res.json({ message: 'Story viewed', storyId });
});

export default router;
