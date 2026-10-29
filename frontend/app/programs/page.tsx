import { pageMetadata } from '@/lib/metadata';
import ProgramsPage from './programs';

export const metadata = pageMetadata({
  title: 'Programs | ApexFitnessNYC',
  description:
    'Compare APEX personal training and online coaching programs, see what each plan includes.',
  path: '/programs',
});

/**
 * LEARNING P1: Programs. Intended access: Public.
 *
 * The rendered component is informational and has no checkout button today. Keep product
 * descriptions and pricing consistent with the server catalog, then send invited clients to
 * Login/Payments. Hiding the old anonymous API does not secure it; disable or guard that handler
 * separately.
 *
 * Verify: Request both checkout APIs directly while signed out; neither may create a session.
 *
 * @see docs/learning/02-payments.md
 * @see docs/learning/03-route-map.md
 */
export default ProgramsPage;
