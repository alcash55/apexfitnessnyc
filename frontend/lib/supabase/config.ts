/**
 * LEARNING A1: Missing local config currently produces a signed-out application. Add clear
 * environment validation for auth/payment operations and ensure the public and privileged URLs
 * identify the same chosen project. A public key is not a user credential.
 *
 * Verify: Missing/mismatched configuration cannot accidentally authorize or write to another
 * environment.
 *
 * @returns Public auth configuration, or null when currently unset.
 * @see docs/learning/01-supabase-auth.md
 */
export function getSupabaseAuthConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
