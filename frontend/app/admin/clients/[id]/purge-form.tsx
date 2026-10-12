'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CONFIRM_PHRASE = 'PERMANENTLY DELETE';

/**
 * The API also hard-gates this (see
 * app/api/admin/clients/[id]/purge/route.ts) — this client-side check is
 * about making the destructive action hard to trigger by accident, not
 * the actual security boundary.
 */
export default function PurgeForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handlePurge() {
    if (confirmText !== CONFIRM_PHRASE) return;

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/purge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: confirmText }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        router.push('/admin');
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
    <div className="mt-0 p-8 [border:1px_solid_rgba(248,_113,_113,_0.3)] max-w-[480px] flex flex-col gap-3 [&_h3]:font-condensed [&_h3]:tracking-[0.1em] [&_h3]:uppercase [&_h3]:text-error [&_h3]:text-[1rem] [&_p]:text-muted [&_p]:text-[0.85rem] [&_p]:leading-[1.6]">
      <h3>Permanently Erase</h3>
      <p>
        Deletes this client&apos;s record and all history (payments, health metrics, offerings,
        nutrition plans) and their login. This cannot be undone.
      </p>
      <p className="text-muted text-[0.85rem] [&_strong]:text-error">
        Type <strong>{CONFIRM_PHRASE}</strong> to confirm.
      </p>
      <Input
        unstyled
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-5 font-condensed text-[0.9rem] min-w-[240px] placeholder:text-muted focus:[outline:none] focus:border-gold compact-down:min-w-0 compact-down:w-full"
        placeholder={CONFIRM_PHRASE}
        aria-label="Type PERMANENTLY DELETE to confirm"
      />
      <Button
        variant="unstyled"
        type="button"
        className="inline-block [background:transparent] [border:1px_solid_var(--color-error)] text-error py-[0.85rem] px-8 font-condensed text-[0.85rem] tracking-[0.1em] uppercase cursor-pointer [transition:background-color_0.2s,_color_0.2s] [&:hover:not(:disabled)]:bg-error [&:hover:not(:disabled)]:text-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
        disabled={confirmText !== CONFIRM_PHRASE || status === 'submitting'}
        onClick={handlePurge}
      >
        {status === 'submitting' ? 'Erasing…' : 'Permanently Erase Client'}
      </Button>
      {message && <span className="text-error text-[0.85rem]">{message}</span>}
    </div>
  );
}
