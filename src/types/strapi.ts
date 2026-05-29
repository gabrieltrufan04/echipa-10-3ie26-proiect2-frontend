export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
  alternativeText?: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover?: StrapiMedia;
  category?: Category;
  author?: Author;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  avatar?: StrapiMedia;
  bio?: string;
}

export interface About {
  id: number;
  documentId: string;
  title: string;
  content: string;
  profileImage?: StrapiMedia;
  skills?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface HomePage {
  id: number;
  documentId: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: StrapiMedia;
  featuredArticles?: Article[];
  featuredCategories?: Category[];
}
