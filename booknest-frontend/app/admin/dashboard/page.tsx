'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { eventsService, reservationsService, usersService } from '@/services';
import { Loader, Card } from '@/components/ui';
import { UserRole, ReservationStatus } from '@/types';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
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

    fetchEvents();
  }, [isAuthenticated, user, router]);

  const fetchEvents = async () => {
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Gestion des événements BookNest
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/events/create">
            <Card hover className="h-full bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Créer un événement</h3>
                  <p className="text-orange-100 text-sm">Ajouter un nouvel événement</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/reservations">
            <Card hover className="h-full bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Réservations</h3>
                  <p className="text-purple-100 text-sm">Gérer les demandes</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card hover className="h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Participants</h3>
                  <p className="text-blue-100 text-sm">Voir tous les utilisateurs</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Events List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Événements</h2>
            <span className="text-sm text-gray-500">{events.length} événement(s)</span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h3>
              <p className="text-gray-500 mb-4">Commencez par créer votre premier événement</p>
              <Link href="/admin/events/create">
                <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium">
                  Créer un événement
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Titre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Lieu</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Places</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: any) => (
                    <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link href={`/admin/events/${event._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {event.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {event.location}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {event.availableSeats} / {event.maxParticipants}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          event.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'DRAFT'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link 
                          href={`/admin/events/${event._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Voir détails →
                        </Link>
                      </td>
                    </tr>
                  ))}
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
