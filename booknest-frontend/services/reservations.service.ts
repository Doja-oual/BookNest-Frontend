import axiosInstance from '@/lib/axios';
import type { 
  Reservation, 
  CreateReservationDto,
  ReservationFilters 
} from '@/types';

const RESERVATIONS_ENDPOINTS = {
  BASE: '/reservations',
  MY_RESERVATIONS: '/reservations/my-reservations',
  BY_ID: (id: string) => `/reservations/${id}`,
  CONFIRM: (id: string) => `/reservations/${id}/confirm`,
  REFUSE: (id: string) => `/reservations/${id}/refuse`,
  ADMIN_CANCEL: (id: string) => `/reservations/${id}/admin-cancel`,
};

class ReservationsService {
  async create(data: CreateReservationDto): Promise<Reservation> {
    const response = await axiosInstance.post<Reservation>(RESERVATIONS_ENDPOINTS.BASE, data);
    return response.data;
  }

  async getMyReservations(): Promise<Reservation[]> {
    const response = await axiosInstance.get<Reservation[]>(RESERVATIONS_ENDPOINTS.MY_RESERVATIONS);
    return response.data;
  }

  async getAll(filters?: ReservationFilters): Promise<Reservation[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.eventId) params.append('eventId', filters.eventId);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${RESERVATIONS_ENDPOINTS.BASE}?${queryString}` : RESERVATIONS_ENDPOINTS.BASE;
    
    const response = await axiosInstance.get<Reservation[]>(url);
    return response.data;
  }

  async getById(id: string): Promise<Reservation> {
    const response = await axiosInstance.get<Reservation>(RESERVATIONS_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  async cancel(id: string): Promise<Reservation> {
    const response = await axiosInstance.delete<Reservation>(RESERVATIONS_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  async confirm(id: string): Promise<Reservation> {
    const response = await axiosInstance.patch<Reservation>(RESERVATIONS_ENDPOINTS.CONFIRM(id));
    return response.data;
  }

  async refuse(id: string): Promise<Reservation> {
    const response = await axiosInstance.patch<Reservation>(RESERVATIONS_ENDPOINTS.REFUSE(id));
    return response.data;
  }

  async adminCancel(id: string): Promise<Reservation> {
    const response = await axiosInstance.delete<Reservation>(RESERVATIONS_ENDPOINTS.ADMIN_CANCEL(id));
    return response.data;
  }

  async downloadTicket(id: string): Promise<Blob> {
    const response = await axiosInstance.get(`${RESERVATIONS_ENDPOINTS.BY_ID(id)}/ticket`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new ReservationsService();
