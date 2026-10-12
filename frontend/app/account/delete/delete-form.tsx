'use client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'submitting' | 'error';

export default function DeleteAccountForm() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleDelete() {
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/account/delete', { method: 'POST' });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        router.push(data.redirectTo || '/');
        router.refresh();
        return;
      }

      setStatus('error');
      setMessage(data.error || 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <div>
      <Label
        unstyled
        className="flex flex-col gap-2"
        style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem', maxWidth: 600 }}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ marginTop: '0.2rem', accentColor: 'var(--gold)' }}
        />
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          I understand this will permanently remove my ability to log in, and that a coach will need
          to re-invite me if I want access again.
        </span>
      </Label>

      <div className="flex items-center gap-6" style={{ marginTop: '2rem' }}>
        <Button
          variant="unstyled"
          type="button"
          className="inline-block [background:transparent] [border:1px_solid_var(--color-error)] text-error py-[0.9rem] px-8 font-condensed text-[0.85rem] tracking-[0.1em] uppercase cursor-pointer [transition:background-color_0.2s,_color_0.2s] [&:hover:not(:disabled)]:bg-error [&:hover:not(:disabled)]:text-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
          disabled={!confirmed || status === 'submitting'}
          onClick={handleDelete}
        >
          {status === 'submitting' ? 'Deleting…' : 'Permanently Delete My Login'}
        </Button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-error)' }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
