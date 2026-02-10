'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reservationsService } from '@/services';
import { Reservation, ReservationStatus, UserRole } from '@/types';
import { Loader, Badge, Alert, Modal, ModalFooter, Button, Pagination, Card } from '@/components/ui';

export default function AdminReservations() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ReservationStatus | 'ALL'>('ALL');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<{ id: string; action: 'confirm' | 'refuse' | 'cancel' } | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
      router.push('/403');
      return;
    }
    fetchReservations();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    filterReservations();
  }, [reservations, selectedFilter]);

  const fetchReservations = async () => {
    try {
      console.log('🔄 Fetching all reservations...');
      const data = await reservationsService.getAll({});
      console.log('✅ Received', data.length, 'reservations');
      setReservations(data);
    } catch (error: any) {
      console.error('❌ Error fetching reservations:', error);
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

  const handleAction = async () => {
    if (!selectedReservation) return;

    setActionLoading(true);
    try {
      switch (selectedReservation.action) {
        case 'confirm':
          await reservationsService.confirm(selectedReservation.id);
          setAlert({ type: 'success', message: 'Réservation confirmée avec succès' });
          break;
        case 'refuse':
          await reservationsService.refuse(selectedReservation.id);
          setAlert({ type: 'success', message: 'Réservation refusée' });
          break;
        case 'cancel':
          await reservationsService.adminCancel(selectedReservation.id);
          setAlert({ type: 'success', message: 'Réservation annulée' });
          break;
      }
      fetchReservations();
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de l\'action' 
      });
    } finally {
      setActionLoading(false);
      setShowActionModal(false);
      setSelectedReservation(null);
    }
  };

  const getStatusCount = (status: ReservationStatus) => {
    return reservations.filter(r => r.status === status).length;
  };

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return <Badge variant="success">Confirmée</Badge>;
      case ReservationStatus.PENDING:
        return <Badge variant="warning">En attente</Badge>;
      case ReservationStatus.REFUSED:
        return <Badge variant="danger">Refusée</Badge>;
      case ReservationStatus.CANCELED:
        return <Badge variant="default">Annulée</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getActionModalContent = () => {
    if (!selectedReservation) return null;

    switch (selectedReservation.action) {
      case 'confirm':
        return {
          title: 'Confirmer la réservation',
          message: 'Voulez-vous confirmer cette réservation ? Le participant recevra une notification de confirmation.',
          confirmButton: 'Confirmer',
          variant: 'success' as const,
        };
      case 'refuse':
        return {
          title: 'Refuser la réservation',
          message: 'Voulez-vous refuser cette réservation ? Le participant sera notifié du refus.',
          confirmButton: 'Refuser',
          variant: 'danger' as const,
        };
      case 'cancel':
        return {
          title: 'Annuler la réservation',
          message: 'Voulez-vous annuler cette réservation ? Cette action est irréversible.',
          confirmButton: 'Annuler la réservation',
          variant: 'danger' as const,
        };
    }
  };

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loader size="lg" text="Chargement des réservations..." fullScreen />;
  }

  const modalContent = getActionModalContent();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validation des Réservations</h1>
          <p className="text-gray-600">Gérez et validez les réservations des participants</p>
        </div>

        {alert && (
          <div className="mb-6">
            <Alert variant={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <button onClick={() => setSelectedFilter('ALL')} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === 'ALL' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300'}`}>
            Toutes ({reservations.length})
          </button>
          <button onClick={() => setSelectedFilter(ReservationStatus.PENDING)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === ReservationStatus.PENDING ? 'bg-yellow-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-yellow-300'}`}>
            En attente ({getStatusCount(ReservationStatus.PENDING)})
          </button>
          <button onClick={() => setSelectedFilter(ReservationStatus.CONFIRMED)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === ReservationStatus.CONFIRMED ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'}`}>
            Confirmées ({getStatusCount(ReservationStatus.CONFIRMED)})
          </button>
          <button onClick={() => setSelectedFilter(ReservationStatus.REFUSED)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === ReservationStatus.REFUSED ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'}`}>
            Refusées ({getStatusCount(ReservationStatus.REFUSED)})
          </button>
          <button onClick={() => setSelectedFilter(ReservationStatus.CANCELED)} className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedFilter === ReservationStatus.CANCELED ? 'bg-gray-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'}`}>
            Annulées ({getStatusCount(ReservationStatus.CANCELED)})
          </button>
        </div>

        {filteredReservations.length === 0 ? (
          <Card className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-gray-600">
              {selectedFilter === 'ALL' ? 'Aucune réservation trouvée' : `Aucune réservation ${selectedFilter.toLowerCase()}`}
            </p>
          </Card>
        ) : (
          <>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Participant</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Événement</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Places</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date réservation</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReservations.map((reservation) => (
                      <tr key={reservation._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {reservation.participant?.firstName} {reservation.participant?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.participant?.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/events/${typeof reservation.event === 'object' ? reservation.event._id : reservation.event}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            {typeof reservation.event === 'object' ? reservation.event.title : 'N/A'}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{reservation.numberOfSeats}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(reservation.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {reservation.status === ReservationStatus.PENDING && (
                              <>
                                <Button variant="success" size="sm" onClick={() => { setSelectedReservation({ id: reservation._id, action: 'confirm' }); setShowActionModal(true); }}>
                                  Confirmer
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => { setSelectedReservation({ id: reservation._id, action: 'refuse' }); setShowActionModal(true); }}>
                                  Refuser
                                </Button>
                              </>
                            )}
                            {reservation.status === ReservationStatus.CONFIRMED && (
                              <Button variant="danger" size="sm" onClick={() => { setSelectedReservation({ id: reservation._id, action: 'cancel' }); setShowActionModal(true); }}>
                                Annuler
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        )}

        <Modal isOpen={showActionModal} onClose={() => !actionLoading && setShowActionModal(false)} title={modalContent?.title || ''} size="md">
          <p className="text-gray-700 mb-6">{modalContent?.message}</p>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowActionModal(false)} disabled={actionLoading}>
              Annuler
            </Button>
            <Button variant={modalContent?.variant} onClick={handleAction} disabled={actionLoading} isLoading={actionLoading}>
              {modalContent?.confirmButton}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
