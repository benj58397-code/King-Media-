import { Router, Request, Response } from 'express';

const router = Router();

// Get feed
router.get('/feed', (req: Request, res: Response) => {
  // TODO: Fetch personalized feed
  res.json({ posts: [] });
});

// Create post
router.post('/', (req: Request, res: Response) => {
  const { content, media } = req.body;
  // TODO: Create post in database
  res.status(201).json({
    id: 'post-id',
    content,
    createdAt: new Date(),
  });
});

// Get post
router.get('/:postId', (req: Request, res: Response) => {
  const { postId } = req.params;
  // TODO: Fetch post
  res.json({ id: postId, content: 'Post content' });
});

// Update post
router.put('/:postId', (req: Request, res: Response) => {
  const { postId } = req.params;
  // TODO: Update post
  res.json({ message: 'Post updated', postId });
});

// Delete post
router.delete('/:postId', (req: Request, res: Response) => {
  const { postId } = req.params;
  // TODO: Delete post
  res.json({ message: 'Post deleted', postId });
});

// Like post
router.post('/:postId/like', (req: Request, res: Response) => {
  const { postId } = req.params;
  // TODO: Add like
  res.json({ message: 'Post liked', postId });
});

// Unlike post
router.delete('/:postId/like', (req: Request, res: Response) => {
  const { postId } = req.params;
  // TODO: Remove like
  res.json({ message: 'Post unliked', postId });
});

// Comment on post
router.post('/:postId/comments', (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  // TODO: Create comment
  res.status(201).json({ id: 'comment-id', content, postId });
});

// Get comments
router.get('/:postId/comments', (req: Request, res: Response) => {
  const { postId } = req.params;
  // TODO: Fetch comments
  res.json({ comments: [] });
});

export default router;
