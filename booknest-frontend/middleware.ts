import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques (pas de vérification de token)
  const publicRoutes = ['/', '/auth', '/events', '/403'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Si c'est une route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Routes protégées (participant)
  const participantRoutes = ['/participant'];
  const isParticipantRoute = participantRoutes.some(route => pathname.startsWith(route));

  // Routes admin
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Redirection vers login si pas de token sur route protégée
  if ((isParticipantRoute || isAdminRoute) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
