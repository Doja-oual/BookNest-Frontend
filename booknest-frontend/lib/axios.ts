import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }

    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    console.error('Response Error:', error.response?.status, error.config?.url);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login';
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      console.error('Accès interdit - Rôle insuffisant');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/403';
      }
    }

    if (error.response?.status === 500) {
      console.error('Erreur serveur');
    }

    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Une erreur est survenue',
      data: error.response?.data,
    });
  }
);

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default axiosInstance;
