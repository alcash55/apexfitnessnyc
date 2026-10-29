import { NextRequest, NextResponse } from 'next/server';
import { getPlan } from '@/lib/plans';
import { getStripe, getBaseUrl } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * LEARNING P1: server entry point. Implement the hardening exercise below.
 *
 * This is the legacy anonymous route and conflicts with the requested authenticated-only design.
 * Disable it or delegate to the same current-client checkout service as /api/payments/checkout.
 * Do not preserve anonymous access merely because the public Programs UI no longer calls it.
 *
 * Verify: A direct signed-out POST cannot create Stripe Checkout, and both API entry points have
 * explicit ownership tests.
 *
 * @see docs/learning/02-payments.md
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const planId = typeof body.planId === 'string' ? body.planId : '';
  const plan = getPlan(planId);

  if (!plan) {
    return NextResponse.json({ error: 'Unknown plan selected.' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: plan.amount,
            product_data: {
              name: plan.name,
              description: plan.desc,
            },
          },
        },
      ],
      // Stripe collects the email; we use it to fulfil and to contact the client.
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/programs?checkout=cancelled`,
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
        requires_booking: plan.requiresBooking ? 'true' : 'false',
      },
    });

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL.');
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] session creation failed:', err);
    return NextResponse.json(
      { error: 'We could not start checkout. Please try again or contact us.' },
      { status: 500 },
    );
  }
}
