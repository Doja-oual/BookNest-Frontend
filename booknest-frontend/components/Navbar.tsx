'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">BookNest</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Événements
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === UserRole.ADMIN ? (
                  <>
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                      Dashboard Admin
                    </Link>
                    <Link href="/admin/events" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                      Gérer Événements
                    </Link>
                    <Link href="/admin/reservations" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                      Réservations
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/participant/dashboard" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/participant/reservations" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                      Mes Réservations
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="text-gray-700 font-medium">{user.firstName}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        Mon Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md transition-all">
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Link href="/events" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
              Événements
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === UserRole.ADMIN ? (
                  <>
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Dashboard Admin
                    </Link>
                    <Link href="/admin/events" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Gérer Événements
                    </Link>
                    <Link href="/admin/reservations" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Réservations
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/participant/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/participant/reservations" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Mes Réservations
                    </Link>
                  </>
                )}
                <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                  Connexion
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 text-orange-600 font-semibold hover:bg-orange-50 transition-colors">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
