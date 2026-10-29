import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAuthConfig } from '@/lib/supabase/config';

/**
 * LEARNING A4: This helper runs from proxy.ts, not a second framework middleware. Preserve
 * refreshed cookies and required cache headers on the final response, including redirects; the
 * current callback copies cookies only. Token verification supports navigation but does not
 * replace current database authorization.
 *
 * Verify: An expired-token refresh followed by a protected redirect retains correct
 * cookies/cache headers.
 *
 * @param request - Incoming request whose session transport is being refreshed.
 * @returns The response carrying refresh state and the token snapshot; neither grants current
 * business access.
 * @see docs/learning/01-supabase-auth.md
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const config = getSupabaseAuthConfig();
  if (!config) {
    console.error(
      '[middleware] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY unset; treating request as signed out.',
    );
    return { response, claims: null };
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getClaims() verifies the JWT (rather than trusting an unread cookie
  // value) and returns the full claim set, including is_admin/client_id
  // from the Custom Access Token Hook — getUser() would NOT expose those,
  // since custom hook claims are sibling top-level JWT claims, not mirrored
  // into user.app_metadata.
  const { data } = await supabase.auth.getClaims();

  return { response, claims: data?.claims ?? null };
}
