import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        profileMode: true,
        isVerified: true,
        isCreator: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatar: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const existing = await prisma.following.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.userId,
          followingId: userId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already following' });
    }

    // Create following relationship
    await prisma.following.create({
      data: {
        followerId: req.user.userId,
        followingId: userId,
      },
    });

    res.json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to follow user' });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.params;

    await prisma.following.delete({
      where: {
        followerId_followingId: {
          followerId: req.user.userId,
          followingId: userId,
        },
      },
    });

    res.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unfollow user' });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const followers = await prisma.following.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.following.count({
      where: { followingId: userId },
    });

    res.json({
      success: true,
      data: followers.map((f) => f.follower),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        hasMore: Number(page) * Number(limit) < total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch followers' });
  }
};
