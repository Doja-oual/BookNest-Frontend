'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reservationsService } from '@/services';
import { Reservation, ReservationStatus } from '@/types';
import { Loader, Alert, Modal, ModalFooter, Button, Pagination } from '@/components/ui';
import ReservationCard from '@/components/ReservationCard';

export default function MyReservations() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ReservationStatus | 'ALL'>('ALL');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchReservations();
  }, [isAuthenticated]);

  useEffect(() => {
    filterReservations();
  }, [reservations, selectedFilter]);

  const fetchReservations = async () => {
    try {
      const data = await reservationsService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setAlert({ type: 'error', message: 'Erreur lors du chargement des réservations' });
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    if (selectedFilter === 'ALL') {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter(r => r.status === selectedFilter));
    }
    setCurrentPage(1);
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      await reservationsService.cancel(selectedReservation);
      setAlert({ type: 'success', message: 'Réservation annulée avec succès' });
      fetchReservations();
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur lors de l\'annulation de la réservation' });
    } finally {
      setShowCancelModal(false);
      setSelectedReservation(null);
    }
  };

  const handleDownloadTicket = async (id: string) => {
    try {
      await reservationsService.downloadTicket(id);
      setAlert({ type: 'success', message: 'Ticket téléchargé avec succès' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Erreur lors du téléchargement du ticket' });
    }
  };

  const getStatusCount = (status: ReservationStatus) => {
    return reservations.filter(r => r.status === status).length;
  };

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loader size="lg" text="Chargement des réservations..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
          <p className="text-gray-600">Gérez toutes vos réservations d&apos;événements</p>
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
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-300'
            }`}
          >
            Toutes ({reservations.length})
          </button>
          <button
            onClick={() => setSelectedFilter(ReservationStatus.CONFIRMED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === ReservationStatus.CONFIRMED
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'
            }`}
          >
            Confirmées ({getStatusCount(ReservationStatus.CONFIRMED)})
          </button>
          <button
            onClick={() => setSelectedFilter(ReservationStatus.PENDING)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === ReservationStatus.PENDING
                ? 'bg-yellow-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-300'
            }`}
          >
            En attente ({getStatusCount(ReservationStatus.PENDING)})
          </button>
          <button
            onClick={() => setSelectedFilter(ReservationStatus.REFUSED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === ReservationStatus.REFUSED
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
            }`}
          >
            Refusées ({getStatusCount(ReservationStatus.REFUSED)})
          </button>
          <button
            onClick={() => setSelectedFilter(ReservationStatus.CANCELED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedFilter === ReservationStatus.CANCELED
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            Annulées ({getStatusCount(ReservationStatus.CANCELED)})
          </button>
        </div>

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-gray-600 mb-6">
              {selectedFilter === 'ALL'
                ? 'Vous n\'avez pas encore de réservations'
                : `Vous n'avez aucune réservation ${selectedFilter.toLowerCase()}`}
            </p>
            <Link href="/events">
              <Button variant="primary">
                Découvrir les événements
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {paginatedReservations.map((reservation) => (
                <ReservationCard
                  key={reservation._id}
                  reservation={reservation}
                  onCancel={(id) => {
                    setSelectedReservation(id);
                    setShowCancelModal(true);
                  }}
                  onDownloadTicket={handleDownloadTicket}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedReservation(null);
          }}
          title="Annuler la réservation"
          size="md"
        >
          <p className="text-gray-700 mb-6">
            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
          </p>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCancelModal(false);
                setSelectedReservation(null);
              }}
            >
              Annuler
            </Button>
            <Button variant="danger" onClick={handleCancelReservation}>
              Confirmer l&apos;annulation
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
