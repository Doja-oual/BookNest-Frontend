'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reservationsService, eventsService } from '@/services';
import { Loader, Card } from '@/components/ui';
import Navbar from '@/components/Navbar';
import { ReservationStatus } from '@/types';

export default function ParticipantDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchReservations();
  }, [isAuthenticated, router]);

  const fetchReservations = async () => {
    try {
      const data = await reservationsService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader size="lg" text="Chargement..." fullScreen />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.firstName} !
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations et découvrez de nouveaux événements
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/events">
            <Card hover className="h-full bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Découvrir les événements</h3>
                  <p className="text-orange-100 text-sm">Parcourez tous les événements disponibles</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/participant/reservations">
            <Card hover className="h-full bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Mes Réservations</h3>
                  <p className="text-purple-100 text-sm">Gérez toutes vos réservations</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* My Reservations */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Réservations</h2>
            <span className="text-sm text-gray-500">{reservations.length} réservation(s)</span>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation</h3>
              <p className="text-gray-500 mb-4">Découvrez nos événements et réservez votre place</p>
              <Link href="/events">
                <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium">
                  Voir les événements
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Événement</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Places</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation: any) => {
                    const event = typeof reservation.event === 'object' ? reservation.event : null;
                    return (
                      <tr key={reservation._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {event?.title || 'Événement'}
                          </p>
                          <p className="text-sm text-gray-500">{event?.location || '-'}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {event?.date ? new Date(event.date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {reservation.numberOfSeats} place(s)
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            reservation.status === ReservationStatus.CONFIRMED
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === ReservationStatus.PENDING
                              ? 'bg-yellow-100 text-yellow-800'
                              : reservation.status === ReservationStatus.REFUSED
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {event && (
                            <Link 
                              href={`/events/${event._id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Voir événement →
                            </Link>
                          )}
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
