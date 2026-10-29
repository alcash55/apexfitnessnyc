import { pageMetadata } from '@/lib/metadata';
import ApexWayPage from './apexway';

export const metadata = pageMetadata({
  title: 'The Apex Way | ApexFitnessNYC',
  description:
    'Discover the biology-first approach, coaching principles, and 90-day transformation system behind APEX.',
  path: '/apexway',
});

/**
 * LEARNING P1: The Apex Way. Intended access: Public.
 *
 * Explain the service publicly, but do not imply that browsing this page grants program access.
 * Its CTA must join the same authenticated purchase path; advertised AI and performance claims
 * do not establish implemented entitlements.
 *
 * Verify: Its CTA cannot bypass the current-client check at payment creation.
 *
 * @see docs/learning/02-payments.md
 * @see docs/learning/03-route-map.md
 */
export default ApexWayPage;
