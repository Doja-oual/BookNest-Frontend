'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { eventsService } from '@/services';
import { Event, EventStatus } from '@/types';
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardContent, Loader } from '@/components/ui';
import Link from 'next/link';

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log('🔄 Fetching event:', eventId);
        const data = await eventsService.getById(eventId);
        console.log('✅ Event loaded:', data);
        
        setEvent(data);
        
        // Format date for datetime-local input
        const eventDate = new Date(data.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        
        setFormData({
          title: data.title,
          description: data.description,
          date: formattedDate,
          location: data.location,
          maxParticipants: data.maxParticipants.toString(),
        });
      } catch (error: any) {
        console.error('❌ Error loading event:', error);
        setAlert({ 
          type: 'error', 
          message: 'Erreur lors du chargement de l\'événement' 
        });
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    if (!formData.location || formData.location.length < 3) {
      newErrors.location = 'Le lieu doit contenir au moins 3 caractères';
    }

    if (!formData.maxParticipants || parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Le nombre de places doit être au moins 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Veuillez corriger les erreurs dans le formulaire' });
      return;
    }

    setSubmitting(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        maxParticipants: parseInt(formData.maxParticipants),
      };

      console.log('📤 Updating event:', eventId, eventData);
      await eventsService.update(eventId, eventData);
      
      setAlert({ 
        type: 'success', 
        message: 'Événement modifié avec succès !' 
      });
      
      setTimeout(() => {
        router.push('/admin/events');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Error updating event:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de la modification de l\'événement' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Événement non trouvé</h2>
          <Link href="/admin/events">
            <Button variant="primary">Retour aux événements</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/events" className="text-purple-600 hover:text-purple-800 font-medium mb-4 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux événements
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifier l&apos;événement</h1>
          <p className="text-gray-600">Modifiez les informations de l&apos;événement</p>
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

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l&apos;événement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Input
                label="Titre de l'événement"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                placeholder="Ex: Concert de jazz"
                required
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={5}
                  className={`block w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez votre événement..."
                  required
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date et heure"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  error={errors.date}
                  required
                />

                <Input
                  label="Lieu"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  error={errors.location}
                  placeholder="Ex: Salle Pleyel, Paris"
                  required
                />
              </div>

              {/* Max Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre de places"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', e.target.value)}
                  error={errors.maxParticipants}
                  min="1"
                  placeholder="Ex: 100"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Places disponibles
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                    {event.availableSeats} / {event.maxParticipants}
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Statut actuel</h4>
                    <p className="text-sm text-blue-800">
                      Cet événement est actuellement <span className="font-semibold">{event.status === EventStatus.PUBLISHED ? 'publié' : event.status === EventStatus.DRAFT ? 'en brouillon' : 'annulé'}</span>.
                      Vous pouvez changer le statut depuis la liste des événements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link href="/admin/events" className="flex-1">
                  <Button variant="secondary" fullWidth disabled={submitting}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={submitting}
                  isLoading={submitting}
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
