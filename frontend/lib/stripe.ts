import Stripe from 'stripe';

/**
 * Server-only Stripe client.
 *
 * SECURITY: STRIPE_SECRET_KEY must never reach the browser. Only import this
 * from route handlers or server components.
 */
let stripe: Stripe | null = null;

/**
 * LEARNING P2: Keep the owner-authorized sandbox secret on the server and verify the pinned API
 * version against the installed SDK. Add a server-only boundary in your implementation.
 * Switching to live mode also requires a separate webhook configuration and deliberate database
 * target.
 *
 * Verify: No secret enters the browser; sandbox and live credentials cannot silently mix.
 *
 * @see docs/learning/02-payments.md
 */
export function getStripe(): Stripe {
  if (stripe) return stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it in Vercel → Settings → Environment Variables.',
    );
  }

  stripe = new Stripe(key, {
    apiVersion: '2026-07-29.dahlia',
    typescript: true,
  });

  return stripe;
}

/**
 * LEARNING P2: Return URLs come from trusted environment configuration. The current
 * Vercel/localhost fallbacks are conveniences, not a production allowlist. Validate the intended
 * origin, require HTTPS in production, and never accept a caller-controlled redirect base.
 *
 * Verify: Changing a request Host/header or payload redirect cannot send a buyer to an untrusted
 * return URL.
 *
 * @returns Configured application origin; implement validation before relying on it.
 * @see docs/learning/02-payments.md
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Vercel provides this automatically on preview deployments.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
