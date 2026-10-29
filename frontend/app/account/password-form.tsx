'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * LEARNING A4: This form calls Supabase Auth updateUser, not a profile-table write. Verify a
 * real session at its page boundary, match password requirements to the Auth configuration, and
 * confirm the chosen recent-auth/recovery policy. Do not assume the page URL proves recovery
 * succeeded.
 *
 * Verify: Signed-out/expired-recovery attempts fail, and a valid password update allows
 * reauthentication.
 *
 * @see docs/learning/01-supabase-auth.md
 */
export default function PasswordForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('submitting');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus('error');
        setMessage(error.message || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('Password updated.');
      router.push(redirectTo);
      router.refresh();
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <form className="max-w-[860px] flex flex-col gap-8" noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label
          unstyled
          className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
          htmlFor="password"
        >
          New Password
        </Label>
        <Input
          unstyled
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          unstyled
          className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
          htmlFor="confirmPassword"
        >
          Confirm Password
        </Label>
        <Input
          unstyled
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="flex items-center gap-6">
        <Button
          variant="unstyled"
          type="submit"
          className="btn-gold"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Saving…' : 'Save Password'}
        </Button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: status === 'success' ? 'var(--color-success)' : 'var(--color-error)',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
