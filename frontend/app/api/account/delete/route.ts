import { NextResponse } from 'next/server';
import { getSessionClaims, deactivateClientAccount } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * LEARNING A5: server entry point. Implement the hardening exercise below.
 *
 * This deletes the authenticated login, not all business records. Verify current identity and
 * the intended recent-auth policy before deletion. Ensure data reads/writes no longer trust an
 * old still-valid client claim after unlinking; preserve the separate privacy-request process.
 *
 * Verify: An old token cannot access the dashboard or create Checkout after successful
 * deactivation.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function POST() {
  const claims = await getSessionClaims();

  if (!claims) {
    return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
  }

  const { error } = await deactivateClientAccount(claims.sub);

  if (error) {
    console.error('[account/delete] deactivation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, redirectTo: '/' });
}
