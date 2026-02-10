'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event, EventStatus } from '@/types';
import { eventsService } from '@/services';
import { useAuth } from '@/hooks/useAuth';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params?.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Fetching event details for ID:', eventId);
    
    const fetchEvent = async () => {
      try {
        setLoading(true);
        console.log('⏳ API call starting...');
        const data = await eventsService.getById(eventId);
        console.log('✅ Event data received:', data);
        setEvent(data);
        setError(null);
      } catch (err: any) {
        console.error('❌ Error fetching event:', err);
        console.error('❌ Error details:', err?.response?.data);
        setError(err?.response?.data?.message || 'Événement introuvable');
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Événement introuvable</h3>
            <p className="text-gray-600 mb-6">{error || 'Cet événement n\'existe pas.'}</p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              ← Retour aux événements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

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
  const isPastEvent = eventDate < new Date();
  const canReserve = 
    event.status === EventStatus.PUBLISHED && 
    !isFull && 
    !isPastEvent &&
    event.availableSeats > 0;

  const getStatusBadge = () => {
    switch (event.status) {
      case EventStatus.PUBLISHED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Publié
          </span>
        );
      case EventStatus.DRAFT:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Brouillon
          </span>
        );
      case EventStatus.CANCELED:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Annulé
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      {/* En-tête avec breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-orange-600 transition-colors">
              Événements
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{event.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Détails de l'événement */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card principale */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* En-tête avec gradient */}
              <div className="bg-linear-to-r from-orange-500 to-orange-600 p-8 text-white">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight flex-1">
                    {event.title}
                  </h1>
                  {getStatusBadge()}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-orange-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium capitalize">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{formattedTime}</span>
                  </div>
                </div>
              </div>

              {/* Corps de la card */}
              <div className="p-8">
                {/* Localisation */}
                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-200">
                  <svg className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Lieu</h3>
                    <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                {/* Organisateur */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg shrink-0">
                    {event.createdBy.firstName[0]}{event.createdBy.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Organisé par</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {event.createdBy.firstName} {event.createdBy.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{event.createdBy.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Informations et réservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Card de réservation */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations</h2>

                {/* Disponibilité */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Places disponibles</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {event.availableSeats}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-sm font-medium text-gray-600">
                      {event.maxParticipants} places
                    </span>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="relative w-full bg-gray-200 rounded-full h-2.5 mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull
                          ? 'bg-red-500'
                          : isLowAvailability
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${100 - availabilityPercentage}%` }}
                    />
                  </div>

                  {/* Badge de disponibilité */}
                  {isFull && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold">Complet</span>
                    </div>
                  )}
                  {isLowAvailability && !isFull && (
                    <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold">Places limitées</span>
                    </div>
                  )}
                  {!isLowAvailability && !isFull && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold">Places disponibles</span>
                    </div>
                  )}
                </div>

                {/* Messages d'état */}
                {isPastEvent && (
                  <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Événement terminé
                    </p>
                  </div>
                )}

                {event.status === EventStatus.CANCELED && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Événement annulé
                    </p>
                  </div>
                )}

                {event.status === EventStatus.DRAFT && (
                  <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Événement en brouillon
                    </p>
                  </div>
                )}

                {/* Bouton de réservation */}
                {canReserve ? (
                  isAuthenticated ? (
                    <Link
                      href={`/events/${event._id}/reserve`}
                      className="w-full block text-center bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Réserver ma place
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href={`/auth/login?redirect=/events/${event._id}`}
                      className="w-full block text-center bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Se connecter pour réserver
                      </span>
                    </Link>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 font-bold py-4 px-6 rounded-xl cursor-not-allowed"
                  >
                    Réservation indisponible
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  {canReserve && !isAuthenticated && "Vous devez vous connecter pour réserver"}
                  {isFull && "Toutes les places sont réservées"}
                  {isPastEvent && "Cet événement est déjà passé"}
                  {event.status === EventStatus.CANCELED && "Cet événement a été annulé"}
                  {event.status === EventStatus.DRAFT && "Cet événement n'est pas encore publié"}
                </p>
              </div>

              {/* Bouton retour */}
              <Link
                href="/events"
                className="block w-full text-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-300"
              >
                ← Retour aux événements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
