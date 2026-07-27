// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// List of routes that should be protected (require auth)
const protectedRoutes = ['/'];
// Public routes anyone can access
const publicRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value; // 👈 checks for 'auth-token' cookie
  const isAuthenticated = !!token;

  // If user is authenticated and tries to visit a public route (like /login), redirect to home/dashboard
  if (isAuthenticated && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is NOT authenticated and tries to access a protected route → redirect to login
  if (!isAuthenticated && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Only run middleware on specific paths (avoid static assets, API routes, etc.)
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - static files (e.g., .png, .css, .js)
     * - Next.js internals (_next)
     * - favicon, robots.txt, etc.
     */
    '/((?!.*\\..*|_next|api).*)',
    '/', // include root
  ],
};