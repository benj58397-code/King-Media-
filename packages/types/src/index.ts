// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  profileMode: 'personal' | 'creator' | 'business' | 'community';
  isVerified: boolean;
  isCreator: boolean;
  privacyLevel: 'public' | 'private' | 'friends-only';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  followers: number;
  following: number;
  posts: number;
}

// Authentication Types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  username: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Post Types
export interface Post {
  id: string;
  content: string;
  mediaUrls: string[];
  authorId: string;
  author?: User;
  likes: number;
  comments: number;
  shares: number;
  visibility: 'public' | 'friends-only' | 'private';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostInput {
  content: string;
  mediaUrls?: string[];
  visibility?: 'public' | 'friends-only' | 'private';
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  mediaUrls: string[];
  senderId: string;
  sender?: User;
  recipientId: string;
  recipient?: User;
  conversationId: string;
  isEdited: boolean;
  isDeleted: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  name?: string;
  isGroup: boolean;
  members: User[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isPrivate: boolean;
  members: number;
  createdAt: Date;
  updatedAt: Date;
}

// Video Types
export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  authorId: string;
  author?: User;
  views: number;
  likes: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

// Story Types
export interface Story {
  id: string;
  mediaUrl: string;
  caption?: string;
  authorId: string;
  author?: User;
  views: number;
  createdAt: Date;
  expiresAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'message' | 'mention';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
