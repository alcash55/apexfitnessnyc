import { NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * LEARNING A5: server entry point. Implement the hardening exercise below.
 *
 * The API already re-checks database admin membership. Preserve that independent guard even if
 * Proxy and admin pages are protected, and handle infrastructure failure without returning
 * customer data. Keep the response minimal for the roster.
 *
 * Verify: A direct GET from an ordinary or removed admin receives no client list.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function GET() {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    let query = getDb()
      .from('clients')
      .select(
        'id,first_name,last_name,email,auth_user_id,offerings:current_offering_id(name),nutrition_plans:current_nutrition_plan_id(name)',
      );

    query = query.order('last_name', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ clients: data ?? [] });
  } catch (err) {
    console.error('[admin/clients] list failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }
}
