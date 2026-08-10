import { Router, Request, Response } from 'express';

const router = Router();

// Get moderation queue
router.get('/queue', (req: Request, res: Response) => {
  // TODO: Fetch reported content
  res.json({ items: [] });
});

// Report content
router.post('/report', (req: Request, res: Response) => {
  const { contentId, reason, description } = req.body;
  // TODO: Create report
  res.status(201).json({ id: 'report-id', reason });
});

// Review report
router.put('/reports/:reportId', (req: Request, res: Response) => {
  const { reportId } = req.params;
  const { action } = req.body;
  // TODO: Take moderation action
  res.json({ message: 'Report reviewed', reportId });
});

export default router;
