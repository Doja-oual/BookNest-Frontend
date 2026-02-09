import axiosInstance, { setAuthToken, removeAuthToken } from '@/lib/axios';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
};

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, data);
    
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
      this.saveUserToStorage(response.data.user);
    }
    
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
      this.saveUserToStorage(response.data.user);
    }
    
    return response.data;
  }

  logout(): void {
    removeAuthToken();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  async getProfile(): Promise<User> {
    const response = await axiosInstance.get<User>(AUTH_ENDPOINTS.PROFILE);
    
    this.saveUserToStorage(response.data);
    
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await axiosInstance.patch<User>(AUTH_ENDPOINTS.UPDATE_PROFILE, data);
    
    this.saveUserToStorage(response.data);
    
    return response.data;
  }

  private saveUserToStorage(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}

export default new AuthService();
