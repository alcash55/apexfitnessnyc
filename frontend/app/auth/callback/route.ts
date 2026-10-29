import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * LEARNING A4: server entry point. Implement the hardening exercise below.
 *
 * This public entry must establish a verified session before protected navigation. The existing
 * handler accepts only code; inspect actual invite/recovery email templates and support the
 * chosen verified exchange, including token_hash/OTP if configured. Validate internal next
 * destinations and preserve response cookies.
 *
 * Verify: Expired/reused links fail safely, invite and recovery work independently, and no
 * supplied redirect or email grants membership.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account/set-password';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
