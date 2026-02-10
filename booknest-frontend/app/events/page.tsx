'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { Event, EventStatus } from '@/types';
import { eventsService } from '@/services';

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const startDate = searchParams.get('startDate') || '';

  useEffect(() => {
    console.log('🔄 useEffect triggered - Fetching events...');
    console.log('📊 Params:', { currentPage, searchQuery, startDate });
    
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('⏳ Starting API call...');
        
        const data = await eventsService.getAll({
          status: EventStatus.PUBLISHED,
          page: currentPage,
          limit: 10,
          search: searchQuery || undefined,
          startDate: startDate || undefined,
        });
        
        console.log('✅ API Response received:', data);
        console.log('📦 Data type:', Array.isArray(data) ? 'Array' : typeof data);
        console.log('📊 Data length:', Array.isArray(data) ? data.length : 'Not an array');
        
        // Backend returns array directly
        const eventsList = Array.isArray(data) ? data : [];
        setEvents(eventsList);
        setTotal(eventsList.length);
        
        console.log('✅ Events set:', eventsList.length, 'events');
      } catch (error: any) {
        console.error('❌ Error fetching events:', error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error response:', error?.response?.data);
        console.error('❌ Error status:', error?.response?.status);
        setEvents([]);
        setTotal(0);
      } finally {
        setLoading(false);
        console.log('✅ Loading complete');
      }
    };

    fetchEvents();
  }, [currentPage, searchQuery, startDate]);

  const totalPages = Math.ceil(total / 10);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const date = formData.get('startDate') as string;
    
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (date) params.set('startDate', date);
    params.set('page', '1');
    
    router.push(`/events?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Découvrez nos Événements
              </h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Explorez notre catalogue d&apos;événements et réservez votre place
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Découvrez nos Événements
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Explorez notre catalogue d&apos;événements et réservez votre place
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres et Recherche */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div className="md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher un événement
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      name="search"
                      defaultValue={searchQuery}
                      placeholder="Rechercher par titre..."
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Filtre par date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    À partir de
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    defaultValue={startDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Rechercher
                </button>
                {(searchQuery || startDate) && (
                  <Link
                    href="/events"
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Réinitialiser
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-gray-600">
            {total > 0 ? (
              <>
                <span className="font-semibold text-gray-900">{total}</span>{' '}
                événement{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                {searchQuery && (
                  <span> pour &quot;{searchQuery}&quot;</span>
                )}
              </>
            ) : (
              'Aucun événement trouvé'
            )}
          </p>
        </div>

        {/* Liste des événements */}
        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event: Event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {/* Bouton Précédent */}
                {currentPage > 1 ? (
                  <Link
                    href={`/events?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}${startDate ? `&startDate=${startDate}` : ''}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Numéros de pages */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/events?page=${pageNum}${searchQuery ? `&search=${searchQuery}` : ''}${startDate ? `&startDate=${startDate}` : ''}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pageNum === currentPage
                          ? 'bg-orange-500 text-white font-semibold'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                </div>

                {/* Bouton Suivant */}
                {currentPage < totalPages ? (
                  <Link
                    href={`/events?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}${startDate ? `&startDate=${startDate}` : ''}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement disponible</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || startDate
                ? 'Aucun événement ne correspond à vos critères de recherche.'
                : 'Il n&apos;y a pas d&apos;événements publiés pour le moment.'}
            </p>
            {(searchQuery || startDate) && (
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Voir tous les événements
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Découvrez nos Événements
              </h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Explorez notre catalogue d&apos;événements et réservez votre place
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
