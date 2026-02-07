import Link from 'next/link';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const availabilityPercentage = (event.availableSeats / event.maxParticipants) * 100;
  const isLowAvailability = availabilityPercentage <= 20 && availabilityPercentage > 0;
  const isFull = event.availableSeats === 0;

  return (
    <Link href={`/events/${event._id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* En-tête avec gradient */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 p-6 text-white">
          <h3 className="text-xl font-bold mb-2 group-hover:text-orange-100 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-orange-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium capitalize">{formattedDate}</span>
          </div>
        </div>

        {/* Corps de la carte */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {event.description}
          </p>

          {/* Informations */}
          <div className="space-y-3">
            {/* Heure */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{formattedTime}</span>
            </div>

            {/* Lieu */}
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm truncate">{event.location}</span>
            </div>

            {/* Places disponibles */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {isFull ? (
                      <span className="text-red-600 font-semibold">Complet</span>
                    ) : (
                      <>
                        <span className={isLowAvailability ? 'text-orange-600 font-semibold' : 'text-gray-900'}>
                          {event.availableSeats}
                        </span>
                        <span className="text-gray-500"> / {event.maxParticipants} places</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Badge de disponibilité */}
                {isFull ? (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Complet
                  </span>
                ) : isLowAvailability ? (
                  <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                    Places limitées
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Disponible
                  </span>
                )}
              </div>

              {/* Barre de progression */}
              {!isFull && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isLowAvailability ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${100 - availabilityPercentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Créé par{' '}
              <span className="font-medium text-gray-700">
                {event.createdBy.firstName} {event.createdBy.lastName}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Voir détails</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
