import { createBrowserClient } from '@supabase/ssr';

/**
 * LEARNING A1: This browser client calls Auth with a public key. It must never receive the
 * privileged server key. Keep business-table writes on guarded server code in this architecture;
 * inspect errors when config is absent rather than assuming non-null assertions initialize it.
 *
 * Verify: The browser bundle/network contains no privileged key, and unauthenticated table reads
 * are denied.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
