# NEXA 2030 Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Web Browser │  │  iOS App     │  │ Android App  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                     │
│  ┌─────────────────────────────────────────────────────┐│
│  │    Express.js + Socket.io Server                    ││
│  │    - Authentication Middleware                      ││
│  │    - Rate Limiting                                  ││
│  │    - CORS Handler                                   ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Auth Service │  │ Post Service │  │ User Service │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Message Service│  │Community Svc │  │  Video Svc   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │   Redis      │  │  MinIO S3    │  │
│  │  (Database)  │  │   (Cache)    │  │  (Storage)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT + Passport.js
- **File Storage**: MinIO (S3 compatible)
- **Real-time**: Socket.io

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose (dev), Kubernetes (prod)
- **Payment**: Stripe
- **Email**: SendGrid
- **AI**: OpenAI API

## Database Schema

### Core Models
- **User**: User accounts and profiles
- **Post**: User posts and content
- **Comment**: Post comments
- **Like**: Post/content likes
- **Message**: Private messages
- **Conversation**: Message conversations
- **Story**: Temporary stories
- **Video**: Video content
- **Community**: User communities
- **LiveStream**: Live streaming sessions

### Supporting Models
- **Following**: User relationships
- **Block**: Blocked users
- **Notification**: User notifications
- **Report**: Content reports
- **ModerationAction**: Moderation records
- **CreatorProfile**: Creator details
- **Subscription**: Creator subscriptions

## API Layers

### Route Layer
- Handles HTTP requests
- Validates input
- Calls service layer

### Service Layer
- Business logic
- Data transformation
- Third-party integrations

### Repository Layer
- Database queries
- Cache operations
- Data access

## Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. JWT token generated
   ↓
4. Token sent to client
   ↓
5. Client stores token (localStorage/cookie)
   ↓
6. Client includes token in API requests
   ↓
7. Backend verifies token
   ↓
8. Request processed
```

## Real-time Communication (WebSocket)

```
Client                          Server
  │                              │
  ├─── connect ────────────────→ │
  │                              │
  ├─── join-room ───────────────→ │
  │                              │
  ├─── message ──────────────────→ │
  │                              ├─→ Broadcast to room
  │                              │
  ←─────── new-message ──────────┤
  │                              │
  ├─── disconnect ───────────────→ │
```

## Deployment Architecture

### Development
- Docker Compose for local services
- Hot reload enabled
- Console logging

### Production
- Containerized services
- Load balancer (Nginx)
- Database replication
- Redis cluster
- S3 for media storage
- CDN for static assets

## Security

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS for transit, AES for sensitive data
- **API Security**: Rate limiting, CORS, CSRF protection
- **Database**: SQL injection prevention via Prisma
- **Input Validation**: Zod schemas
- **OWASP**: Following OWASP Top 10 guidelines
