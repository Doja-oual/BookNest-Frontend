import axiosInstance from '@/lib/axios';
import type { 
  Reservation, 
  CreateReservationDto,
  ReservationFilters 
} from '@/types';

const RESERVATIONS_ENDPOINTS = {
  BASE: '/reservations',
  MY_RESERVATIONS: '/reservations/me',
  BY_ID: (id: string) => `/reservations/${id}`,
  CANCEL: (id: string) => `/reservations/${id}/cancel`,
  CONFIRM: (id: string) => `/reservations/${id}/confirm`,
  REFUSE: (id: string) => `/reservations/${id}/refuse`,
  ADMIN_CANCEL: (id: string) => `/reservations/${id}/admin-cancel`,
  EVENT_RESERVATIONS: (eventId: string) => `/reservations/event/${eventId}`,
  EVENT_STATS: (eventId: string) => `/reservations/event/${eventId}/stats`,
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
    
    console.log('🌐 [ReservationsService] Calling:', url);
    const response = await axiosInstance.get<Reservation[]>(url);
    console.log('✅ [ReservationsService] Got', response.data.length, 'reservations');
    
    return response.data;
  }

  async getById(id: string): Promise<Reservation> {
    const response = await axiosInstance.get<Reservation>(RESERVATIONS_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  async cancel(id: string): Promise<Reservation> {
    const response = await axiosInstance.patch<Reservation>(RESERVATIONS_ENDPOINTS.CANCEL(id));
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
    const response = await axiosInstance.patch<Reservation>(RESERVATIONS_ENDPOINTS.ADMIN_CANCEL(id));
    return response.data;
  }

  async getEventReservations(eventId: string): Promise<Reservation[]> {
    const response = await axiosInstance.get<Reservation[]>(RESERVATIONS_ENDPOINTS.EVENT_RESERVATIONS(eventId));
    return response.data;
  }

  async getEventStats(eventId: string): Promise<any> {
    const response = await axiosInstance.get(RESERVATIONS_ENDPOINTS.EVENT_STATS(eventId));
    return response.data;
  }

  async getByEventId(eventId: string): Promise<Reservation[]> {
    const response = await axiosInstance.get<Reservation[]>(RESERVATIONS_ENDPOINTS.EVENT_RESERVATIONS(eventId));
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
