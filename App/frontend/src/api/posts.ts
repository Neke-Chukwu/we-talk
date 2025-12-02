import { apiClient } from './axios';
import type { Post, PostPayload } from '../types';

interface PostsResponse {
  posts: Post[];
}

interface PostResponse {
  post: Post;
}

interface CreatePostResponse {
  message: string;
  postId: string;
  slug: string;
}

interface UpdatePostResponse {
  message: string;
  post: Post;
}

interface DeletePostResponse {
  message: string;
  postId: string;
}

export const fetchPosts = async () => {
  const response = await apiClient.get<PostsResponse>('/posts');
  return response.data;
};

export const fetchPostBySlug = async (slug: string) => {
  const response = await apiClient.get<PostResponse>(`/posts/${slug}`);
  return response.data;
};

export const createPostRequest = async (payload: PostPayload) => {
  const response = await apiClient.post<CreatePostResponse>('/posts/create', payload);
  return response.data;
};

export const updatePostRequest = async (id: string, payload: PostPayload) => {
  const response = await apiClient.put<UpdatePostResponse>(`/posts/${id}`, payload);
  return response.data;
};

export const deletePostRequest = async (id: string) => {
  const response = await apiClient.delete<DeletePostResponse>(`/posts/${id}`);
  return response.data;
};

