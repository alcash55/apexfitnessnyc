import type { SessionClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

/**
 * Who may open the members-only exercise library (/library).
 *
 * middleware.ts already sends signed-out visitors to /login. On top of that,
 * a client needs a current program enrollment: clients.current_offering_id,
 * which the client_offerings trigger keeps pointing at their open enrollment
 * (end_date null). Ending the enrollment in /admin ends library access.
 * Admins always get in.
 *
 * Re-checked against the database on every request rather than read off the
 * JWT, so access ends as soon as the enrollment does, not when the token
 * next refreshes.
 */
export type LibraryAccess = 'allowed' | 'signed-out' | 'unlinked' | 'no-program';

/**
 * LEARNING A5: Enrollment is a separate entitlement from paying or signing in. This helper
 * currently trusts is_admin/client_id token snapshots. Check current admin/client membership
 * before its enrollment lookup, then apply the defined access duration and revocation rules.
 *
 * Verify: Ending enrollment, unlinking a client, or removing an admin denies access with their
 * existing token.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function getLibraryAccess(claims: SessionClaims | null): Promise<LibraryAccess> {
  if (!claims) return 'signed-out';
  if (claims.is_admin) return 'allowed';
  if (!claims.client_id) return 'unlinked';

  const { data, error } = await getDb()
    .from('clients')
    .select('current_offering_id')
    .eq('id', claims.client_id)
    .maybeSingle<{ current_offering_id: string | null }>();
  if (error) throw error;

  return data?.current_offering_id ? 'allowed' : 'no-program';
}
