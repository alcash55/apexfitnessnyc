import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * LEARNING A5: server entry point. Implement the hardening exercise below.
 *
 * Every update/delete must independently verify current admin membership and the target record.
 * Validate allowed fields and record operational failures clearly. UI row controls and noindex
 * tags do not authorize mutations.
 *
 * Verify: A removed admin cannot alter an expense and invalid targets produce controlled
 * outcomes.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { id } = await params;

  try {
    const { data, error } = await getDb()
      .from('expenses')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/expenses/:id] delete failed:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }
}
