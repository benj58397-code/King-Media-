import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const sendMessageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1).max(5000),
  mediaUrls: z.array(z.string().url()).optional(),
});

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: { id: req.user.userId },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = sendMessageSchema.parse(req.body);

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        members: {
          every: {
            id: {
              in: [req.user.userId, data.recipientId],
            },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          isGroup: false,
          members: {
            connect: [
              { id: req.user.userId },
              { id: data.recipientId },
            ],
          },
        },
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        senderId: req.user.userId,
        recipientId: data.recipientId,
        conversationId: conversation.id,
      },
      include: {
        sender: {
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
      message: 'Message sent',
      data: message,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json({
      success: true,
      data: messages.reverse(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};
