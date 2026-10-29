import { pageMetadata } from '@/lib/metadata';
import AboutMePage from './about';

export const metadata = pageMetadata({
  title: 'About Your Coach | ApexFitnessNYC',
  description:
    'Meet your APEX coach and learn about the experience and approach behind your training program.',
  path: '/about-me',
});

/**
 * LEARNING P1: About Me. Intended access: Public.
 *
 * This is a public trust page, not a payment processor. Keep credential and AI claims consistent
 * with delivered services and lead purchase intent to the authenticated flow. Client photos or
 * payment examples need permission and must not expose customer records.
 *
 * Verify: The page loads signed out and contains no private data or direct anonymous Checkout
 * action.
 *
 * @see docs/learning/02-payments.md
 * @see docs/learning/03-route-map.md
 */
export default AboutMePage;
