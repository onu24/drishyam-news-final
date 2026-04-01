export type ArticleStatus = 'draft' | 'review' | 'published';

export interface Category {
  id: string;
  name: string;
  slug: string;
  order?: number;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string; // Legacy
  avatar?: string; // Admin style
  email?: string;
  role?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  
  // Legacy fields
  category?: string;
  headline?: string;
  date?: number;
  imageUrl?: string;
  language?: 'en' | 'hi';
  isLive?: boolean;
  isBreaking?: boolean;
  
  // New Admin fields
  categoryId?: string;
  authorId?: string;
  status?: ArticleStatus;
  featured?: boolean;
  views?: number;
  createdAt?: string | number; 
  updatedAt?: string | number;
  coverImage?: string;
  tags?: string[];
  
  // Editorial additions
  articleType?: 'standard' | 'opinion' | 'explainer' | 'video';
  keyPoints?: string[];
  videoUrl?: string;
  readingTime?: number;
}

export interface DashboardStats {
  totalArticles: number;
  featuredArticles: number;
  totalViews: number;
  totalCategories: number;
  totalAuthors: number;
  publishedCount: number;
  draftCount: number;
  reviewCount: number;
}

// ... other existing types (VideoArticle, ExplainerArticle, etc.) if needed can extend Article
export interface NewsArticle extends Article {}

export interface ExplainerArticle extends Article {
  topicTag?: string;
}

export interface VideoArticle extends Article {
  videoUrl?: string;
  duration?: string;
}

export interface AdPlacement {
  id: string;
  position: string;
  content: string;
  active: boolean;
  startDate: number;
  endDate: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

export interface StorySlide {
  id: string;
  title: string;
  caption: string;
  image: string;
}

export interface VisualStory {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  slides: StorySlide[];
  createdAt?: string | number;
}
