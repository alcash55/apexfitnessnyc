'use client';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExpenseRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return;

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        router.refresh();
        return;
      }

      setError(data.error || 'Could not delete this expense.');
      setDeleting(false);
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
      setDeleting(false);
    }
  }

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        className="[background:transparent] [border:1px_solid_rgba(248,_113,_113,_0.4)] text-error py-2 px-4 font-condensed text-[0.75rem] tracking-[0.1em] uppercase cursor-pointer [transition:background-color_0.2s,_color_0.2s] [&:hover:not(:disabled)]:bg-error [&:hover:not(:disabled)]:text-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </Button>
      {error && (
        <span
          role="alert"
          style={{
            color: 'var(--color-error)',
            fontSize: '0.75rem',
            display: 'block',
            marginTop: '0.35rem',
          }}
        >
          {error}
        </span>
      )}
    </>
  );
}
