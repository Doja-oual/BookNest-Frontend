import axiosInstance from '@/lib/axios';
import type { 
  Event, 
  CreateEventDto, 
  UpdateEventDto, 
  UpdateEventStatusDto,
  EventFilters 
} from '@/types';

const EVENTS_ENDPOINTS = {
  BASE: '/events',
  BY_ID: (id: string) => `/events/${id}`,
  UPDATE_STATUS: (id: string) => `/events/${id}/status`,
};

class EventsService {
  async getAll(filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${EVENTS_ENDPOINTS.BASE}?${queryString}` : EVENTS_ENDPOINTS.BASE;
    
    const response = await axiosInstance.get<Event[]>(url);
    return response.data;
  }

  async getById(id: string): Promise<Event> {
    const response = await axiosInstance.get<Event>(EVENTS_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  async create(data: CreateEventDto): Promise<Event> {
    const response = await axiosInstance.post<Event>(EVENTS_ENDPOINTS.BASE, data);
    return response.data;
  }

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await axiosInstance.patch<Event>(EVENTS_ENDPOINTS.BY_ID(id), data);
    return response.data;
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete<{ message: string }>(EVENTS_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  async updateStatus(id: string, data: UpdateEventStatusDto): Promise<Event> {
    const response = await axiosInstance.patch<Event>(EVENTS_ENDPOINTS.UPDATE_STATUS(id), data);
    return response.data;
  }

  async getPublishedEvents(): Promise<Event[]> {
    return this.getAll({ status: 'PUBLISHED' as any });
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date().toISOString();
    return this.getAll({ 
      status: 'PUBLISHED' as any,
      startDate: now 
    });
  }
}

export default new EventsService();
