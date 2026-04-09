import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const rawClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

rawClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

rawClient.interceptors.response.use(
  (response) => (response.data?.data !== undefined ? response.data.data : response.data),
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('accessToken');
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);

function get<T>(url: string, params?: Record<string, string | number>): Promise<T> {
  return rawClient.get(url, { params }) as Promise<T>;
}

function post<T>(url: string, data?: unknown): Promise<T> {
  return rawClient.post(url, data) as Promise<T>;
}

function patch<T>(url: string, data?: unknown): Promise<T> {
  return rawClient.patch(url, data) as Promise<T>;
}

function del<T>(url: string): Promise<T> {
  return rawClient.delete(url) as Promise<T>;
}

export const apiClient = rawClient;
export const apiGet = get;
export const apiPost = post;
export const apiPatch = patch;
export const apiDelete = del;
