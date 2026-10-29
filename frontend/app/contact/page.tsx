import { pageMetadata } from '@/lib/metadata';
import contactPage from './contact';

export const metadata = pageMetadata({
  title: 'Contact | ApexFitnessNYC',
  description:
    'Contact APEX to discuss personal training in New York City or online coaching for men 40+.',
  path: '/contact',
});

/**
 * LEARNING A1: Contact. Intended access: Public.
 *
 * An inquiry is not an authenticated client or a paid order. Keep the form usable publicly
 * without taking card or medical details, and keep its consent/notification behavior aligned
 * with the privacy notice. Membership must be created through the trusted invitation/linking
 * process.
 *
 * Verify: Submitting a synthetic inquiry never creates an enrollment or grants payment-history
 * access.
 *
 * @see docs/learning/01-supabase-auth.md
 * @see docs/learning/03-route-map.md
 */
export default contactPage;
