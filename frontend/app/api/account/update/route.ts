import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
// Never cache a write endpoint.
export const dynamic = 'force-dynamic';

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/**
 * LEARNING A5: server entry point. Implement the hardening exercise below.
 *
 * Current ownership comes from the JWT client_id. Verify the current auth-user-to-client link,
 * validate object-shaped JSON and allowed profile fields, and enforce the relationship again in
 * the write query. Never accept auth_user_id, role, or another client ID from the form.
 *
 * Verify: Old/revoked tokens and cross-client fields cannot mutate records; invalid JSON returns
 * a controlled client error.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();

  if (!claims) {
    return NextResponse.json({ success: false, error: 'Not signed in.' }, { status: 401 });
  }

  if (!claims.client_id) {
    return NextResponse.json(
      { success: false, error: "Your login isn't linked to a client profile yet." },
      { status: 409 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const phone = clean(body.phone, 40);
  const address = clean(body.address, 255);

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = 'First name is required.';
  if (!lastName) fieldErrors.lastName = 'Last name is required.';

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: 'Please check the highlighted fields.', fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { error } = await getDb()
      .from('clients')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        address: address || null,
      })
      .eq('id', claims.client_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[account/update] update failed:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong on our end. Please try again shortly.',
      },
      { status: 500 },
    );
  }
}
