'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

function FieldError({ text }: { text: string }) {
  return (
    <span
      style={{
        color: 'var(--color-error)',
        fontSize: '0.8rem',
        marginTop: '0.4rem',
        display: 'block',
      }}
    >
      {text}
    </span>
  );
}

type Mode = 'login' | 'forgot';
type Status = 'idle' | 'submitting' | 'error' | 'success';

/**
 * There is no signup form here — account creation is admin-invite-only (see
 * the approved auth plan). This component only ever signs an existing user
 * in, or kicks off Supabase's password-recovery email.
 *
 * Both actions call lib/supabase/browser.ts's Auth-only client directly, no
 * API route: Supabase Auth itself sets the session cookie via @supabase/ssr,
 * and middleware.ts is what actually persists/refreshes it on navigation.
 */
export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setStatus('submitting');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Could not sign in. Check your email and password.');
      return;
    }

    setStatus('success');
    router.push(next);
    router.refresh();
  }

  async function handleForgot(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setStatus('submitting');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/set-password`,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
      return;
    }

    setStatus('success');
    setMessage("If that email has an account, we've sent a password reset link.");
  }

  if (mode === 'forgot') {
    return (
      <form className="max-w-[420px] flex flex-col gap-6" noValidate onSubmit={handleForgot}>
        <div className="flex flex-col gap-2">
          <Label
            unstyled
            className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
            htmlFor="forgot-email"
          >
            Email Address
          </Label>
          <Input
            unstyled
            id="forgot-email"
            name="email"
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
            required
          />
        </div>

        <Button
          variant="unstyled"
          type="submit"
          className="btn-gold"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Send Reset Link'}
        </Button>

        <Button
          variant="unstyled"
          type="button"
          className="[align-self:flex-start] font-condensed text-[0.85rem] tracking-[0.05em] text-muted [background:none] [border:none] p-0 cursor-pointer [transition:color_0.2s] [&:hover]:text-gold"
          onClick={(event) => {
            event.preventDefault();
            setMode('login');
            setStatus('idle');
            setMessage('');
          }}
        >
          Back to login
        </Button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: status === 'error' ? 'var(--color-error)' : 'var(--color-success)',
            }}
          >
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form className="max-w-[420px] flex flex-col gap-6" noValidate onSubmit={handleLogin}>
      <div className="flex flex-col gap-2">
        <Label
          unstyled
          className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
          htmlFor="email"
        >
          Email Address
        </Label>
        <Input
          unstyled
          id="email"
          name="email"
          type="email"
          placeholder="EMAIL ADDRESS"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
          aria-invalid={status === 'error'}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          unstyled
          className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
          htmlFor="password"
        >
          Password
        </Label>
        <Input
          unstyled
          id="password"
          name="password"
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
          aria-invalid={status === 'error'}
          required
        />
      </div>

      <Button
        variant="unstyled"
        type="submit"
        className="btn-gold"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Signing In…' : 'Sign In'}
      </Button>

      <Button
        variant="unstyled"
        type="button"
        className="[align-self:flex-start] font-condensed text-[0.85rem] tracking-[0.05em] text-muted [background:none] [border:none] p-0 cursor-pointer [transition:color_0.2s] [&:hover]:text-gold"
        onClick={(event) => {
          event.preventDefault();
          setMode('forgot');
          setStatus('idle');
          setMessage('');
        }}
      >
        Forgot password?
      </Button>

      {message && status === 'error' && <FieldError text={message} />}
    </form>
  );
}
