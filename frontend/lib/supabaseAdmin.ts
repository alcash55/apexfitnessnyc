import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service-role key.
 *
 * SECURITY: the service-role key bypasses Row Level Security. It must never be
 * imported into a client component or exposed through a NEXT_PUBLIC_ variable.
 * Every file that imports this module must be a route handler or server
 * component.
 */
let client: SupabaseClient | null = null;

/**
 * LEARNING A1: This is privileged database access and bypasses RLS. Add a server-only import
 * boundary in your implementation, verify matching project configuration, and call it for
 * sensitive queries only after current user/admin authorization. Never attach a visitor session
 * to this shared privileged client.
 *
 * Verify: A Client Component cannot import this module and no key or unrestricted row set
 * reaches client props.
 *
 * @returns A server-privileged client, not a user-scoped authorization layer.
 * @see docs/learning/01-supabase-auth.md
 */
export function getDb(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('SUPABASE_URL must be set.');
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY must be set.');

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
    db: { schema: 'public' },
  });

  return client;
}
