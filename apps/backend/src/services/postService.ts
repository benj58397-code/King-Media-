import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000),
  mediaUrls: z.array(z.string().url()).optional(),
  visibility: z.enum(['public', 'friends-only', 'private']).default('public'),
});

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { page = 1, limit = 20 } = req.query;

    // Get posts from followed users and own posts
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: req.user.userId },
          {
            author: {
              followers: {
                some: { followerId: req.user.userId },
              },
            },
          },
        ],
        isPublished: true,
        visibility: 'public',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isVerified: true,
          },
        },
        likes: {
          where: { userId: req.user.userId },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.post.count({
      where: {
        OR: [
          { authorId: req.user.userId },
          {
            author: {
              followers: {
                some: { followerId: req.user.userId },
              },
            },
          },
        ],
        isPublished: true,
        visibility: 'public',
      },
    });

    res.json({
      success: true,
      data: posts.map((post) => ({
        ...post,
        liked: post.likes.length > 0,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        hasMore: Number(page) * Number(limit) < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch feed' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = createPostSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        visibility: data.visibility,
        authorId: req.user.userId,
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isVerified: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { postId } = req.params;

    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.userId,
          postId,
        },
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: req.user.userId,
            postId,
          },
        },
      });
      return res.json({ success: true, message: 'Post unliked' });
    }

    await prisma.like.create({
      data: {
        userId: req.user.userId,
        postId,
      },
    });

    res.json({ success: true, message: 'Post liked' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to like post' });
  }
};
