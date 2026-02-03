import axiosInstance from '@/lib/axios';
import type { DashboardStats } from '@/types';

const DASHBOARD_ENDPOINTS = {
  STATS: '/dashboard/stats',
  ADMIN_STATS: '/admin/dashboard/stats',
};

class DashboardService {
  async getAdminStats(): Promise<DashboardStats> {
    const response = await axiosInstance.get<DashboardStats>(DASHBOARD_ENDPOINTS.ADMIN_STATS);
    return response.data;
  }

  async getParticipantStats(): Promise<any> {
    const response = await axiosInstance.get(DASHBOARD_ENDPOINTS.STATS);
    return response.data;
  }
}

export default new DashboardService();
