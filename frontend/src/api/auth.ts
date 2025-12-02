import { apiClient } from './axios';
import type { User } from '../types';

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  userId?: string;
}

interface ProfileResponse {
  user: User;
}

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await apiClient.post<AuthResponse>('/register', payload);
  return response.data;
};

export const loginRequest = async (payload: LoginPayload) => {
  const response = await apiClient.post<AuthResponse>('/login', payload);
  return response.data;
};

export const logoutRequest = async () => {
  const response = await apiClient.post<{ message: string }>('/logout');
  return response.data;
};

export const fetchProfile = async () => {
  const response = await apiClient.get<ProfileResponse>('/profile');
  return response.data;
};


