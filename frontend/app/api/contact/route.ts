import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/supabaseAdmin';
import { notifyDiscord } from '@/lib/discord';

export const runtime = 'nodejs';
// Never cache a form submission endpoint.
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

/**
 * LEARNING A1: server entry point. Implement the hardening exercise below.
 *
 * Public inquiries intentionally remain outside member auth. Keep server validation, minimize
 * data sent to notifications, enforce any relied-on consent at the server, and bound abuse. Do
 * not connect an inquiry email to an existing client's billing authority.
 *
 * Verify: A synthetic lead cannot read records, become an admin, create a linked account, or
 * change payment state.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: real users never fill a hidden field. Bots usually do.
  // Return 200 so the bot believes it succeeded and does not retry.
  if (clean(body.company, 100)) {
    return NextResponse.json({ success: true });
  }

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const email = clean(body.email, 255).toLowerCase();
  const phone = clean(body.phone, 40);

  const fieldErrors: Record<string, string> = {};
  if (!firstName) fieldErrors.firstName = 'First name is required.';
  if (!lastName) fieldErrors.lastName = 'Last name is required.';
  if (!email) fieldErrors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email address.';

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: 'Please check the highlighted fields.', fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { error } = await getDb()
      .from('contacts')
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        email,
      });

    if (error) throw error;

    // Best-effort: the lead is already safely in Supabase above, so a
    // notification failure must never fail the request or the user sees an
    // error despite their submission having actually succeeded.
    try {
      await notifyDiscord({ firstName, lastName, email, phone });
    } catch (notifyErr) {
      console.error('[contact] Discord notification failed:', notifyErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // Log server-side for debugging, but never leak internals to the client.
    console.error('[contact] insert failed:', err);
    return NextResponse.json(
      {
        success: false,
        error:
          'Something went wrong on our end. Please email us directly and we will get right back to you.',
      },
      { status: 500 },
    );
  }
}
