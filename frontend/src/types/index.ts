export interface PostContent {
  text: string;
  imageUrl?: string[];
}

export interface AuthorSummary {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  title: string;
  content: PostContent;
  author: AuthorSummary;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  createdAt?: string;
}

export interface PostPayload {
  title: string;
  content: PostContent;
}

