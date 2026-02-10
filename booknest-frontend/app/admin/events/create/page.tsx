'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventsService } from '@/services';
import { EventStatus } from '@/types';
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import Link from 'next/link';

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: '',
    price: '',
    status: EventStatus.DRAFT,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    } else {
      const eventDate = new Date(formData.date);
      if (eventDate < new Date()) {
        newErrors.date = 'La date doit être dans le futur';
      }
    }

    if (!formData.location || formData.location.length < 3) {
      newErrors.location = 'Le lieu doit contenir au moins 3 caractères';
    }

    if (!formData.maxParticipants || parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Le nombre de places doit être au moins 1';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Le prix doit être supérieur ou égal à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Veuillez corriger les erreurs dans le formulaire' });
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        maxParticipants: parseInt(formData.maxParticipants),
      };

      await eventsService.create(eventData);
      setAlert({ 
        type: 'success', 
        message: `Événement ${isDraft ? 'enregistré en brouillon' : 'créé et publié'} avec succès !` 
      });
      
      setTimeout(() => {
        router.push('/admin/events');
      }, 2000);
    } catch (error: any) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Erreur lors de la création de l\'événement' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un événement</h1>
          <p className="text-gray-600">Remplissez les informations pour créer un nouvel événement</p>
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
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
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

              {/* Total Seats and Price */}
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

                <Input
                  label="Prix (€)"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  error={errors.price}
                  min="0"
                  placeholder="Ex: 25.00"
                  required
                />
              </div>

              {/* Info Box */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">À propos de la publication</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Cliquez sur &quot;Enregistrer en brouillon&quot; pour sauvegarder sans publier</li>
                      <li>• Cliquez sur &quot;Créer et publier&quot; pour rendre l&apos;événement visible immédiatement</li>
                      <li>• Vous pourrez modifier ces informations à tout moment</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link href="/admin/events" className="flex-1">
                  <Button variant="secondary" fullWidth disabled={loading}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  isLoading={loading}
                >
                  Enregistrer en brouillon
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  isLoading={loading}
                >
                  Créer et publier
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
