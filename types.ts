
export type Page = 'home' | 'about' | 'services' | 'requests' | 'members' | 'forum' | 'blog' | 'testimonials' | 'profile' | 'moderation' | 'profile-view';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  whatsapp: string;
  gender: 'Homme' | 'Femme';
  country: string;
  bio?: string;
  skills: string[];
  languages: string[];
  hobbies: string[];
  credits: number;
  createdAt: string;
  avatar: string; 
  role: 'user' | 'moderator' | 'admin';
  termsAccepted: boolean;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface BlogComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: string;
  media: MediaItem[];
  likes: string[]; // User IDs
  dislikes: string[]; // User IDs
  reposts: number;
  comments: BlogComment[];
  createdAt: string;
}

export interface Testimonial {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  rating: number;
  votes: string[]; // User IDs who voted
  createdAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  serviceTitle: string;
  type: 'service' | 'request';
  date: string;
}

export interface Service {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  creditCost: number;
  category: string;
  createdAt: string;
}

export interface Request {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  creditOffer: number;
  category: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
