'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Accès interdit
          </h2>
          <p className="text-gray-600 mb-8">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
            Seuls les administrateurs peuvent accéder à cette ressource.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Retour
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            Retour à l'accueil
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
}
