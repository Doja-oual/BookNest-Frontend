'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { eventsService, reservationsService } from '@/services';
import { Event } from '@/types';
import { Button, Input, Loader, Alert, Modal, ModalFooter, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function ReservePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/events/${eventId}/reserve`);
      return;
    }
    fetchEvent();
  }, [isAuthenticated, eventId]);

  const fetchEvent = async () => {
    try {
      const data = await eventsService.getById(eventId);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setAlert({ type: 'error', message: 'Erreur lors du chargement de l\'événement' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!event) return;

    if (numberOfSeats < 1) {
      setAlert({ type: 'error', message: 'Le nombre de places doit être au moins 1' });
      return;
    }

    if (numberOfSeats > event.availableSeats) {
      setAlert({ type: 'error', message: `Seulement ${event.availableSeats} places disponibles` });
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmReservation = async () => {
    setSubmitting(true);
    try {
      await reservationsService.create({
        eventId,
        numberOfSeats,
      });
      
      setAlert({ type: 'success', message: 'Réservation créée avec succès !' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/participant/reservations');
      }, 2000);
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de la création de la réservation' 
      });
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return <Loader size="lg" text="Chargement..." fullScreen />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Événement non trouvé</h1>
          <Link href="/events">
            <Button>Retour aux événements</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPastEvent = new Date(event.date) < new Date();
  const isFull = event.availableSeats <= 0;

  if (isPastEvent || isFull) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isPastEvent ? 'Événement passé' : 'Événement complet'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isPastEvent 
              ? 'Cet événement a déjà eu lieu' 
              : 'Il n\'y a plus de places disponibles pour cet événement'}
          </p>
          <Link href="/events">
            <Button>Retour aux événements</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Event Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Récapitulatif de l&apos;événement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Lieu</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-medium text-gray-900">
                      {new Date(event.date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Places disponibles</p>
                    <p className="font-medium text-gray-900">{event.availableSeats} / {event.maxParticipants}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Formulaire de réservation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input
                type="number"
                label="Nombre de places"
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(parseInt(e.target.value) || 1)}
                min={1}
                max={event.availableSeats}
                helperText={`Maximum ${event.availableSeats} places disponibles`}
              />

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">À propos de votre réservation</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Votre réservation sera en attente de validation par l&apos;administrateur</li>
                      <li>• Vous recevrez une notification dès que votre réservation sera confirmée</li>
                      <li>• Vous pourrez télécharger votre ticket une fois la réservation confirmée</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={submitting}
                  isLoading={submitting}
                >
                  Réserver {numberOfSeats} place{numberOfSeats > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={() => !submitting && setShowConfirmModal(false)}
          title="Confirmer votre réservation"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Vous êtes sur le point de réserver <strong>{numberOfSeats}</strong> place{numberOfSeats > 1 ? 's' : ''} pour l&apos;événement :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">{event.title}</p>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Votre réservation sera en attente de validation par l&apos;administrateur.
            </p>
          </div>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={confirmReservation}
              disabled={submitting}
              isLoading={submitting}
            >
              Confirmer la réservation
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
