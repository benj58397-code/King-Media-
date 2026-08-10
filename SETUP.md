# NEXA 2030 - Backend Setup Guide

## Database Migration

### Prerequisites
```bash
# Start PostgreSQL
docker-compose up -d postgres redis minio

# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready
```

### Run Migrations

```bash
cd apps/backend

# Install dependencies
npm install

# Generate Prisma Client
npm run generate

# Run migrations
npm run migrate:dev

# Seed database (optional)
npm run seed
```

## Environment Setup

### Backend (.env)
```bash
cp apps/backend/.env.example apps/backend/.env
```

Update with your settings:
```
DATABASE_URL="postgresql://nexa_user:nexa_password_dev@localhost:5432/nexa_db"
REDIS_URL="redis://localhost:6379"
NODE_ENV="development"
API_PORT=3001
JWT_SECRET="your-super-secret-jwt-key"
```

### Frontend (.env.local)
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

## Running the App

### Terminal 1 - Backend
```bash
cd apps/backend
npm run dev
```
Backend runs on: http://localhost:3001

### Terminal 2 - Frontend
```bash
cd apps/web
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/apple` - Apple OAuth

### Posts
- `GET /api/posts/feed` - Get personalized feed
- `POST /api/posts` - Create post
- `GET /api/posts/:postId` - Get post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like post
- `GET /api/posts/:postId/comments` - Get comments

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile
- `POST /api/users/:userId/follow` - Follow user
- `DELETE /api/users/:userId/follow` - Unfollow user

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Communities
- `GET /api/communities` - List communities
- `POST /api/communities` - Create community
- `POST /api/communities/:communityId/join` - Join community

### Videos
- `GET /api/videos/feed` - Get video feed
- `POST /api/videos/upload` - Upload video
- `POST /api/videos/:videoId/like` - Like video

### Weather
- Weather Dashboard fetches from Open-Meteo API (free, no key needed)
- Available at frontend: http://localhost:3000

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart services
docker-compose down
docker-compose up -d
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in .env
API_PORT=3002
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```
