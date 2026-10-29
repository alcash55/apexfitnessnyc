import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * LEARNING A4: server entry point. Implement the hardening exercise below.
 *
 * The server route currently signs out and redirects. Choose local/global session scope, handle
 * errors, use an appropriate post-POST redirect, and verify private routes deny access
 * afterward. Supabase SSR cookies are not necessarily HttpOnly; do not teach that as the reason
 * to use this handler.
 *
 * Verify: A logout completes with correct cookies and navigation; old sessions follow the
 * explicitly tested revocation policy.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', request.url));
}
