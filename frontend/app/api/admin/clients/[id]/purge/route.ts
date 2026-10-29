import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin, purgeClientAccount } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIRM_PHRASE = 'PERMANENTLY DELETE';

/**
 * LEARNING A5: server entry point. Implement the hardening exercise below.
 *
 * This irreversible erasure path differs from revoking login. Keep admin authorization and
 * explicit confirmation, review retention rules, and account for the database-delete/Auth-delete
 * partial failure. Never test on a real client or assume all external copies are deleted.
 *
 * Verify: Only a current admin can purge a synthetic client; failures are recoverable and
 * retained financial obligations are handled explicitly.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (body.confirm !== CONFIRM_PHRASE) {
    return NextResponse.json(
      { error: `Type "${CONFIRM_PHRASE}" exactly to confirm.` },
      { status: 400 },
    );
  }

  const { id } = await params;

  try {
    const { data, error } = await getDb()
      .from('clients')
      .select('id,auth_user_id')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { error: purgeError } = await purgeClientAccount(data.id, data.auth_user_id ?? null);
    if (purgeError) throw new Error(purgeError);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/clients/purge] failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }
}
