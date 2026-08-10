import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pino from 'pino';
import pinoHttp from 'pino-http';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postsRoutes from './routes/posts';
import messagesRoutes from './routes/messages';
import communitiesRoutes from './routes/communities';
import videosRoutes from './routes/videos';
import storiesRoutes from './routes/stories';
import liveRoutes from './routes/live';
import creatorRoutes from './routes/creator';
import moderationRoutes from './routes/moderation';
import analyticsRoutes from './routes/analytics';

// Initialize app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const logger = pino();
const httpLogger = pinoHttp({ logger });

// Middleware
app.use(httpLogger);
app.use(helmet());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Socket.io setup
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    socket.emit('room-joined', { roomId });
  });

  // Leave room
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
  });

  // Message sent
  socket.on('message', (data) => {
    io.to(data.roomId).emit('new-message', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = parseInt(process.env.API_PORT || '3001', 10);
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export { app, io };
