import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * LEARNING A4: Create a request-scoped Auth client using cookies. Keep cookie persistence in
 * supported server contexts and compare the installed SSR cookie/header callback with official
 * guidance. Do not reuse one user's Auth client globally or cache private responses across
 * users.
 *
 * Verify: Refresh and callback responses preserve the intended session without sharing cookies
 * through caches.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // A Server Component cannot persist these writes. The Proxy's
            // session-refresh response must carry cookies/headers instead.
          }
        },
      },
    },
  );
}
