import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';

export const metadata = pageMetadata({
  title: 'Checkout Cancelled | ApexFitnessNYC',
  description:
    'Your APEX checkout was cancelled. Review programs or contact your coach to continue.',
  path: '/checkout/cancelled',
  privatePage: true,
});

export default function CheckoutCancelledPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner" style={{ maxWidth: 640, textAlign: 'center' }}>
        <div className="section-label" style={{ justifyContent: 'center' }}>
          Cancelled
        </div>
        <h2 className="section-h2" style={{ margin: '0.5rem 0 1.5rem' }}>
          No Charge Was Made
        </h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
          You cancelled before completing payment, so nothing was charged. Your card was never
          billed and no account was created.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/programs" className="btn-gold">
            Back to Programs
          </Link>
          <Link href="/contact" style={{ color: 'var(--gold)', alignSelf: 'center' }}>
            Talk to a coach first
          </Link>
        </div>
      </div>
    </div>
  );
}
