import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims, verifyIsAdmin } from '@/lib/auth';
import { getDb } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
// Never cache an admin data endpoint.
export const dynamic = 'force-dynamic';

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

/**
 * LEARNING A5: server entry point. Implement the hardening exercise below.
 *
 * Expense creation/listing is private administrative work, not proof of a customer payment.
 * Preserve current admin checks, validate amount/date/category at the boundary, and keep manual
 * expenses separate from Stripe-derived records.
 *
 * Verify: Direct unauthorized requests fail and malformed amounts cannot create financial
 * records.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export async function GET() {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { data, error } = await getDb()
      .from('expenses')
      .select('id,expense_date,amount_cents,category,description,created_at')
      .order('expense_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, expenses: data ?? [] });
  } catch (err) {
    console.error('[admin/expenses] list failed:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }
}

/**
 * Creates a business expense. The API accepts amount_cents directly (the
 * DB column is already in cents) — the admin page's form is responsible
 * for converting a dollar input into cents before POSTing here.
 */
export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();

  if (!claims || !(await verifyIsAdmin(claims.sub))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const expenseDate = clean(body.expense_date, 10);
  const category = clean(body.category, 100);
  const description = clean(body.description, 500);
  const amountCents = body.amount_cents;

  const fieldErrors: Record<string, string> = {};

  if (!expenseDate) fieldErrors.expense_date = 'Date is required.';
  else if (!isValidDateString(expenseDate)) fieldErrors.expense_date = 'Enter a valid date.';

  if (typeof amountCents !== 'number' || !Number.isInteger(amountCents) || amountCents <= 0) {
    fieldErrors.amount_cents = 'Amount must be a positive number.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: 'Please check the highlighted fields.', fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await getDb()
      .from('expenses')
      .insert({
        expense_date: expenseDate,
        amount_cents: amountCents,
        category: category || null,
        description: description || null,
      })
      .select('id,expense_date,amount_cents,category,description,created_at')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, expense: data }, { status: 201 });
  } catch (err) {
    console.error('[admin/expenses] insert failed:', err);
    return NextResponse.json(
      { success: false, error: 'Something went wrong on our end. Please try again shortly.' },
      { status: 500 },
    );
  }
}
