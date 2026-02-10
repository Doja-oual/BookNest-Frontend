'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { eventsService } from '@/services';
import { Event, EventStatus } from '@/types';
import { Loader, Button, Badge, Alert, Modal, ModalFooter, Card, Pagination } from '@/components/ui';
import { UserRole } from '@/types';

export default function AdminEvents() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
      router.push('/403');
      return;
    }
    fetchEvents();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    filterEvents();
  }, [events, selectedFilter]);

  const fetchEvents = async () => {
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setAlert({ type: 'error', message: 'Erreur lors du chargement des événements' });
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (selectedFilter === 'ALL') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => e.status === selectedFilter));
    }
    setCurrentPage(1);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await eventsService.delete(selectedEvent);
      setAlert({ type: 'success', message: 'Événement supprimé avec succès' });
      fetchEvents();
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur lors de la suppression de l\'événement' });
    } finally {
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: EventStatus) => {
    try {
      await eventsService.updateStatus(id, { status });
      setAlert({ type: 'success', message: `Événement ${status === EventStatus.PUBLISHED ? 'publié' : 'annulé'} avec succès` });
      fetchEvents();
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur lors de la mise à jour du statut' });
    }
  };

  const getStatusCount = (status: EventStatus) => {
    return events.filter(e => e.status === status).length;
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.PUBLISHED:
        return <Badge variant="success">Publié</Badge>;
      case EventStatus.DRAFT:
        return <Badge variant="default">Brouillon</Badge>;
      case EventStatus.CANCELED:
        return <Badge variant="danger">Annulé</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loader size="lg" text="Chargement des événements..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Événements</h1>
            <p className="text-gray-600">Créez, modifiez et gérez tous les événements</p>
          </div>
          <Link href="/admin/events/create">
            <Button variant="primary" leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>
              Créer un événement
            </Button>
          </Link>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              variant={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Tous ({events.length})
          </button>
          <button
            onClick={() => setSelectedFilter(EventStatus.PUBLISHED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === EventStatus.PUBLISHED
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'
            }`}
          >
            Publiés ({getStatusCount(EventStatus.PUBLISHED)})
          </button>
          <button
            onClick={() => setSelectedFilter(EventStatus.DRAFT)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === EventStatus.DRAFT
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            Brouillons ({getStatusCount(EventStatus.DRAFT)})
          </button>
          <button
            onClick={() => setSelectedFilter(EventStatus.CANCELED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === EventStatus.CANCELED
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
            }`}
          >
            Annulés ({getStatusCount(EventStatus.CANCELED)})
          </button>
        </div>

        {/* Events Table */}
        {filteredEvents.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement</h3>
            <p className="text-gray-600 mb-6">
              {selectedFilter === 'ALL'
                ? 'Créez votre premier événement'
                : `Aucun événement ${selectedFilter.toLowerCase()}`}
            </p>
            <Link href="/admin/events/create">
              <Button variant="primary">Créer un événement</Button>
            </Link>
          </Card>
        ) : (
          <>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Titre</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Lieu</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Réservations</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map((event) => (
                      <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link href={`/events/${event._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            {event.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{event.location}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {(event.maxParticipants - event.availableSeats) || 0} / {event.maxParticipants}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(event.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/events/${event._id}/edit`}>
                              <Button variant="secondary" size="sm">
                                Modifier
                              </Button>
                            </Link>
                            
                            {event.status === EventStatus.DRAFT && (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleUpdateStatus(event._id, EventStatus.PUBLISHED)}
                              >
                                Publier
                              </Button>
                            )}
                            
                            {event.status === EventStatus.PUBLISHED && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleUpdateStatus(event._id, EventStatus.CANCELED)}
                              >
                                Annuler
                              </Button>
                            )}
                            
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedEvent(event._id);
                                setShowDeleteModal(true);
                              }}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEvent(null);
          }}
          title="Supprimer l'événement"
          size="md"
        >
          <p className="text-gray-700 mb-6">
            Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible et supprimera également toutes les réservations associées.
          </p>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedEvent(null);
              }}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDeleteEvent}>
              Supprimer définitivement
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
