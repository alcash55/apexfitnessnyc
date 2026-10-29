import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED_PREFIXES = ['/dashboard', '/account', '/payments', '/library'];
const ADMIN_PREFIX = '/admin';

/**
 * LEARNING A5: Use early session/route checks for navigation while keeping final authorization
 * in every page/API data boundary. Protected API paths are not covered by the page-prefix
 * checks. Preserve refreshed response state on redirects and leave signed Stripe webhooks
 * reachable without customer cookies.
 *
 * Verify: Direct protected API requests are denied independently, and valid Stripe events never
 * redirect to Login.
 *
 * @param request - The incoming Next.js request.
 * @see docs/learning/01-supabase-auth.md
 */
export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith(ADMIN_PREFIX);
  const isProtectedRoute = isAdminRoute || PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  if (!isProtectedRoute) {
    return response;
  }

  if (!claims) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    // Token snapshot only. Admin APIs re-check membership, but the current
    // admin pages still trust this claim before sensitive reads. A5 asks you
    // to add current authorization there; this redirect is not that guard.
    const isAdmin = (claims as Record<string, unknown>).is_admin === true;

    if (!isAdmin) {
      // A genuine 404, not a redirect or 403 — indistinguishable from a
      // route that was never built, per "hidden protected pages by rule".
      const notFoundUrl = new URL('/__admin_guard', request.url);
      return NextResponse.rewrite(notFoundUrl, { status: 404 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image optimization,
     * so the session cookie still refreshes on every real navigation.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
