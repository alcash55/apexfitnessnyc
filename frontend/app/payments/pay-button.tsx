'use client';
import { Button } from '@/components/ui/button';

import { useState } from 'react';

/**
 * LEARNING P3: The button sends a plan ID and redirects to hosted Checkout. Add a retry-stable
 * checkout-attempt ID and validate the server response. Loading/disabled state prevents
 * accidental clicks but is not authorization, price enforcement, or payment idempotency.
 *
 * Verify: Network retry reuses the intended attempt while a deliberate new purchase creates a
 * new attempt.
 *
 * @see docs/learning/02-payments.md
 */
export default function PayButton({
  planId,
  label = 'Pay Now',
  highlight = false,
}: {
  planId: string;
  label?: string;
  highlight?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        setError(data.error || 'We could not start checkout. Please try again.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('We could not reach the payment server. Check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="unstyled"
        onClick={startCheckout}
        disabled={loading}
        aria-busy={loading}
        style={{
          width: '100%',
          padding: '1.1rem',
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading ? 0.6 : 1,
          background: highlight ? 'var(--gold)' : 'rgba(200,168,75,0.1)',
          color: highlight ? 'var(--black)' : 'var(--gold)',
          fontFamily: 'var(--font-condensed)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontSize: '0.95rem',
          transition: 'all 0.3s',
        }}
      >
        {loading ? 'Redirecting…' : label}
      </Button>

      {error && (
        <p
          role="alert"
          style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.6rem' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
