'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InviteForm({
  clientId,
  initialEmail,
}: {
  clientId: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail ?? '');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch(`/api/admin/clients/${clientId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus('idle');
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
    <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-wrap">
      <Input
        unstyled
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="client@email.com"
        className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-5 font-condensed text-[0.9rem] min-w-[240px] placeholder:text-muted focus:[outline:none] focus:border-gold compact-down:min-w-0 compact-down:w-full"
        required
      />
      <Button
        variant="unstyled"
        type="submit"
        className="btn-gold"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Invite'}
      </Button>
      {message && <span className="text-error text-[0.85rem]">{message}</span>}
    </form>
  );
}
