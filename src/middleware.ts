import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './navigation';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let API routes and static files bypass intl middleware
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json'
  ) {
    return NextResponse.next();
  }

  // Handle protected /admin route directly
  if (pathname.startsWith('/admin')) {
    // Check for Supabase auth token cookie
    const hasAuthCookie = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));

    if (!hasAuthCookie) {
      // Get preferred locale from cookie or default to 'en'
      const preferredLocale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
      const redirectUrl = new URL(`/${preferredLocale}/auth/login?redirect=/admin`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Language routing for all other public routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
