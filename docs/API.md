# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

## Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "username": "username",
  "fullName": "John Doe"
}

Response: { user, token }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: { user, token }
```

### Posts

#### Get Feed
```
GET /posts/feed?page=1&limit=20
Authorization: Bearer <token>

Response: { posts: Post[], total: number }
```

#### Create Post
```
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello world!",
  "mediaUrls": [],
  "visibility": "public"
}

Response: { id, content, createdAt }
```

### Messages

#### Send Message
```
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user-id",
  "content": "Hello!",
  "mediaUrls": []
}

Response: { id, content, createdAt }
```

### Users

#### Get Profile
```
GET /users/:userId
Authorization: Bearer <token>

Response: { id, username, email, bio, followers, following }
```

#### Follow User
```
POST /users/:userId/follow
Authorization: Bearer <token>

Response: { message: "Followed" }
```

## WebSocket Events (Socket.io)

### Connection
```javascript
socket.emit('join-room', 'room-id');
```

### Messages
```javascript
socket.on('new-message', (data) => {
  // Handle new message
});

socket.emit('message', { roomId, content });
```

## Rate Limits
- 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
