import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const createCommunitySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
});

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const communities = await prisma.community.findMany({
      where: {
        isPrivate: false,
        name: search ? { contains: String(search), mode: 'insensitive' } : undefined,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.community.count({
      where: {
        isPrivate: false,
      },
    });

    res.json({
      success: true,
      data: communities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch communities' });
  }
};

export const createCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = createCommunitySchema.parse(req.body);

    const community = await prisma.community.create({
      data: {
        ...data,
        creatorId: req.user.userId,
        members: {
          create: {
            userId: req.user.userId,
            role: 'admin',
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Community created',
      data: community,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    res.status(500).json({ success: false, error: 'Failed to create community' });
  }
};

export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { communityId } = req.params;

    const existing = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: req.user.userId,
          communityId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already a member' });
    }

    await prisma.communityMember.create({
      data: {
        userId: req.user.userId,
        communityId,
        role: 'member',
      },
    });

    res.json({ success: true, message: 'Joined community' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to join community' });
  }
};

export const leaveCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { communityId } = req.params;

    await prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId: req.user.userId,
          communityId,
        },
      },
    });

    res.json({ success: true, message: 'Left community' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to leave community' });
  }
};
