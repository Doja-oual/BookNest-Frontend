import Link from 'next/link';
import { Reservation, ReservationStatus } from '@/types';
import Badge from './ui/Badge';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
  onDownloadTicket?: (id: string) => void;
  showActions?: boolean;
}

export default function ReservationCard({
  reservation,
  onCancel,
  onDownloadTicket,
  showActions = true,
}: ReservationCardProps) {
  const event = typeof reservation.event === 'string' ? null : reservation.event;
  
  if (!event) return null;

  const reservationDate = new Date(reservation.createdAt);
  const eventDate = new Date(event.date);
  
  const formattedReservationDate = reservationDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  const formattedEventDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedEventTime = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusBadge = () => {
    switch (reservation.status) {
      case ReservationStatus.CONFIRMED:
        return (
          <Badge variant="success" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }>
            Confirmée
          </Badge>
        );
      case ReservationStatus.PENDING:
        return (
          <Badge variant="warning" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }>
            En attente
          </Badge>
        );
      case ReservationStatus.REFUSED:
        return (
          <Badge variant="danger" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          }>
            Refusée
          </Badge>
        );
      case ReservationStatus.CANCELED:
        return (
          <Badge variant="default" icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
          }>
            Annulée
          </Badge>
        );
    }
  };

  const canCancel = 
    (reservation.status === ReservationStatus.CONFIRMED || 
     reservation.status === ReservationStatus.PENDING) &&
    eventDate > new Date();

  const canDownload = reservation.status === ReservationStatus.CONFIRMED;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/events/${event._id}`} className="group">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                {event.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <span className="text-xs text-gray-500">
                Réservée le {formattedReservationDate}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-gray-700">
            <svg className="w-5 h-5 text-orange-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium capitalize">{formattedEventDate} à {formattedEventTime}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <svg className="w-5 h-5 text-orange-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <svg className="w-5 h-5 text-orange-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-semibold">
              {reservation.numberOfSeats} place{reservation.numberOfSeats > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {showActions && (canCancel || canDownload) && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {canDownload && onDownloadTicket && (
              <button
                onClick={() => onDownloadTicket(reservation._id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger le ticket
              </button>
            )}
            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(reservation._id)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 font-medium border-2 border-red-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annuler la réservation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
