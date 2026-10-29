import { pageMetadata } from '@/lib/metadata';
import TrainingPage from './training';

export const metadata = pageMetadata({
  title: 'Training | ApexFitnessNYC',
  description:
    'Explore the three phases of APEX training for men 40+: foundation, acceleration, and peak performance.',
  path: '/training',
});

/**
 * LEARNING P1: Training. Intended access: Public.
 *
 * Curriculum previews can be public. Actual member materials require the library's current
 * enrollment check. Buying one product should not silently authorize every training or nutrition
 * resource.
 *
 * Verify: A signed-out visitor can read the preview but cannot retrieve private member content.
 *
 * @see docs/learning/02-payments.md
 * @see docs/learning/03-route-map.md
 */
export default TrainingPage;
