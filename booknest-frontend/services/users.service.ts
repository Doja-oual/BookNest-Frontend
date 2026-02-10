import axiosInstance from '@/lib/axios';
import type { User } from '@/types';

const USERS_ENDPOINTS = {
  BASE: '/users',
  BY_ID: (id: string) => `/users/${id}`,
};

class UsersService {
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get<User[]>(USERS_ENDPOINTS.BASE);
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await axiosInstance.get<User>(USERS_ENDPOINTS.BY_ID(id));
    return response.data;
  }
}

export default new UsersService();
