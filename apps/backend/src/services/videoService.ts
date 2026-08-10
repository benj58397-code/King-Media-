import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const uploadVideoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().positive(),
});

export const getVideoFeed = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const videos = await prisma.video.findMany({
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
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.video.count();

    res.json({
      success: true,
      data: videos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
};

export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = uploadVideoSchema.parse(req.body);

    const video = await prisma.video.create({
      data: {
        ...data,
        authorId: req.user.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded',
      data: video,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    res.status(500).json({ success: false, error: 'Failed to upload video' });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
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

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Increment views
    await prisma.video.update({
      where: { id: videoId },
      data: { views: video.views + 1 },
    });

    res.json({
      success: true,
      data: { ...video, views: video.views + 1 },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch video' });
  }
};

export const likeVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { videoId } = req.params;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Toggle like (in a real app, create a Like model for videos)
    await prisma.video.update({
      where: { id: videoId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    res.json({ success: true, message: 'Video liked' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to like video' });
  }
};
