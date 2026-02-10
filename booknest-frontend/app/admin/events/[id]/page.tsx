'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { eventsService, reservationsService } from '@/services';
import { Loader, Card, Badge } from '@/components/ui';
import { UserRole, Event, EventStatus } from '@/types';
import Navbar from '@/components/Navbar';

export default function AdminEventDetails() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const userRole = user?.role?.toString().toUpperCase();
    if (userRole !== 'ADMIN' && userRole !== UserRole.ADMIN) {
      router.push('/403');
      return;
    }

    if (eventId) {
      fetchEventDetails();
      fetchEventReservations();
    }
  }, [isAuthenticated, user, router, eventId]);

  const fetchEventDetails = async () => {
    try {
      const data = await eventsService.getById(eventId);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventReservations = async () => {
    try {
      const data = await reservationsService.getByEventId(eventId);
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case EventStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case EventStatus.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loader size="lg" text="Chargement..." fullScreen />;
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
          <Card className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Événement introuvable</h2>
            <Link href="/admin/events">
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium">
                Retour aux événements
              </button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/admin/events" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
                ← Retour aux événements
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-gray-500">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <Link href={`/admin/events/${eventId}/edit`}>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium">
                Modifier
              </button>
            </Link>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">{event.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lieu</p>
                  <p className="font-medium text-gray-900">{event.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Créé par</p>
                  <p className="font-medium text-gray-900">
                    {event.createdBy?.firstName} {event.createdBy?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Créé le</p>
                  <p className="font-medium text-gray-900">
                    {new Date(event.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Capacité</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Places disponibles</p>
                    <p className="text-3xl font-bold text-green-600">{event.availableSeats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Places totales</p>
                    <p className="text-xl font-semibold text-gray-900">{event.maxParticipants}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Taux de remplissage</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${((event.maxParticipants - event.availableSeats) / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(((event.maxParticipants - event.availableSeats) / event.maxParticipants) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Réservations</h2>
                <p className="text-3xl font-bold text-blue-600">{reservations.length}</p>
                <p className="text-sm text-gray-500 mt-1">réservation(s)</p>
              </Card>
            </div>
          </div>

          {/* Reservations List */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des réservations</h2>
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune réservation pour cet événement</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Participant</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Places</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation: any) => {
                      const participant = typeof reservation.user === 'object' ? reservation.user : null;
                      return (
                        <tr key={reservation._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">
                            {participant ? `${participant.firstName} ${participant.lastName}` : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {participant?.email || 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {reservation.numberOfSeats}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              reservation.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : reservation.status === 'REFUSED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
