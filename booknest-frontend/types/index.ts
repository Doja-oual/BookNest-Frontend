export enum UserRole {
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT',
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED',
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  availableSeats: number;
  status: EventStatus;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  maxParticipants?: number;
}

export interface UpdateEventStatusDto {
  status: EventStatus;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REFUSED = 'REFUSED',
  CANCELED = 'CANCELED',
}

export interface Reservation {
  _id: string;
  user: string | User;
  event: string | Event;
  numberOfSeats: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  eventId: string;
  numberOfSeats: number;
}

export interface DashboardStats {
  totalEvents: number;
  totalReservations: number;
  upcomingEvents: number;
  averageFillRate: number;
  reservationsByStatus: {
    pending: number;
    confirmed: number;
    refused: number;
    canceled: number;
  };
}

export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventFilters {
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  eventId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
