import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    if (error.message) {
      return Promise.reject(new Error(error.message));
    }
    return Promise.reject(error);
  },
);

