import Link from 'next/link';
import EventCard from '@/components/EventCard';
import { Event, EventStatus } from '@/types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface EventsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    startDate?: string;
  };
}

async function getPublishedEvents(page: number = 1, search?: string, startDate?: string) {
  try {
    const params = new URLSearchParams();
    params.append('status', EventStatus.PUBLISHED);
    params.append('page', page.toString());
    params.append('limit', '10');
    
    if (search) {
      params.append('search', search);
    }
    
    if (startDate) {
      params.append('startDate', startDate);
    }

    const response = await axios.get(`${API_BASE_URL}/events?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      events: response.data.data || response.data || [],
      total: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
      page: response.data.page || page,
      totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / 10),
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      events: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const searchQuery = searchParams.search;
  const startDate = searchParams.startDate;

  const { events, total, page, totalPages } = await getPublishedEvents(
    currentPage,
    searchQuery,
    startDate
  );

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
            <form method="GET" className="space-y-4">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {/* Bouton Précédent */}
                {page > 1 ? (
                  <Link
                    href={`/events?page=${page - 1}${searchQuery ? `&search=${searchQuery}` : ''}${startDate ? `&startDate=${startDate}` : ''}`}
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
                        pageNum === page
                          ? 'bg-orange-500 text-white font-semibold'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                </div>

                {/* Bouton Suivant */}
                {page < totalPages ? (
                  <Link
                    href={`/events?page=${page + 1}${searchQuery ? `&search=${searchQuery}` : ''}${startDate ? `&startDate=${startDate}` : ''}`}
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
