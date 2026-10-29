import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { getDb } from '@/lib/supabaseAdmin';
import { getSupabaseAuthConfig } from '@/lib/supabase/config';

export type SessionClaims = {
  sub: string;
  email?: string;
  is_admin: boolean;
  client_id: string | null;
};

/**
 * LEARNING A5: Read verified token identity and distinguish it from current authorization. This
 * function checks signature/expiry but returns role/client snapshots from the token. Parse
 * custom claim shapes rather than asserting them. Add separate server helpers that resolve
 * current membership before privileged data access; do not mistake getClaims() for immediate
 * revocation.
 *
 * Verify: Remove a client's link while retaining its existing token; protected data and checkout
 * must then be denied.
 *
 * @returns Verified token claims or null. This is not a current client/admin access grant.
 * @see docs/learning/01-supabase-auth.md
 */
export async function getSessionClaims(): Promise<SessionClaims | null> {
  // Auth not configured for this deployment: nobody can be signed in.
  if (!getSupabaseAuthConfig()) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) return null;

  const claims = data.claims;
  return {
    sub: claims.sub as string,
    email: claims.email as string | undefined,
    is_admin: claims.is_admin === true,
    client_id: (claims.client_id as string | undefined) ?? null,
  };
}

/**
 * LEARNING A5: This is an optimistic UI/routing hint only. A signed is_admin flag can outlive
 * removal from public.admins. Sensitive page reads need the current database check too, not
 * merely destructive writes.
 *
 * Verify: A removed admin cannot read the roster, client health details, or expenses using an
 * old token.
 *
 * @param claims - The verified token snapshot, or null.
 * @returns Whether the token says admin, not whether the current allowlist still does.
 * @see docs/learning/01-supabase-auth.md
 */
export function isAdminClaims(claims: SessionClaims | null): boolean {
  return claims?.is_admin === true;
}

/**
 * LEARNING A5: Use the current allowlist at the data boundary. Extend callers to cover sensitive
 * reads as well as writes, combine with verified identity, and define a fail-closed
 * infrastructure-error outcome. Never accept a caller-supplied identity as the authenticated
 * subject.
 *
 * Verify: Both ordinary and removed admins fail before any sensitive query.
 *
 * @param authUserId - Subject obtained from server-verified identity, never form input.
 * @returns True only when the query finds current membership without error.
 * @see docs/learning/01-supabase-auth.md
 */
export async function verifyIsAdmin(authUserId: string): Promise<boolean> {
  const { data, error } = await getDb()
    .from('admins')
    .select('auth_user_id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  return !error && data !== null;
}

/**
 * LEARNING A5: Deleting an Auth user deactivates login but does not by itself revoke every
 * already-issued JWT or erase business history. Make private callers verify the live
 * identity/client relationship so old claims no longer authorize data or checkout.
 *
 * Verify: An old token cannot read or create Checkout after deactivation.
 *
 * @param authUserId - Verified identity being deactivated.
 * @returns The provider operation result; callers must still enforce current authorization.
 * @see docs/learning/01-supabase-auth.md
 */
export async function deactivateClientAccount(
  authUserId: string,
): Promise<{ error: string | null }> {
  const { error } = await getDb().auth.admin.deleteUser(authUserId);
  return { error: error?.message ?? null };
}

/**
 * LEARNING A5: Erasure spans the database and Auth and is not one transaction. The existing
 * order can delete the client before Auth deletion fails. Define recoverable partial failure and
 * legal retention separately from login revocation; test only synthetic records.
 *
 * Verify: Partial failure is detectable and retryable without erasing an unrelated identity.
 *
 * @param clientId - Target selected by an independently authorized admin.
 * @param authUserId - Auth identity confirmed to belong to that client, if any.
 * @returns The combined operation result, not proof that all external copies were deleted.
 * @see docs/learning/01-supabase-auth.md
 */
export async function purgeClientAccount(
  clientId: string,
  authUserId: string | null,
): Promise<{ error: string | null }> {
  const { error: dbError } = await getDb().from('clients').delete().eq('id', clientId);
  if (dbError) return { error: dbError.message };

  if (authUserId) {
    const { error: authError } = await getDb().auth.admin.deleteUser(authUserId);
    if (authError) return { error: authError.message };
  }

  return { error: null };
}
