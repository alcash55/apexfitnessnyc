import { pageMetadata, HOME_TITLE, HOME_DESCRIPTION } from '@/lib/metadata';
import HomePage from './home';

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
});

/**
 * LEARNING P1: Home. Intended access: Public.
 *
 * Marketing remains public. Its CTA should lead to Login and then Payments for invited clients,
 * or to a clear inquiry path for prospects. Never create a Checkout Session or expose a
 * Stripe/Supabase secret while rendering this page.
 *
 * Verify: Follow Start Now as a signed-out visitor; you must not reach a working anonymous
 * purchase endpoint.
 *
 * @see docs/learning/02-payments.md
 * @see docs/learning/03-route-map.md
 */
export default HomePage;
