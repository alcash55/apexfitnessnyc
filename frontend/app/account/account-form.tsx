'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

type Form = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

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

export default function AccountForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState<Form>({
    firstName: profile.first_name ?? '',
    lastName: profile.last_name ?? '',
    phone: profile.phone ?? '',
    address: profile.address ?? '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Your info has been updated.');
        return;
      }

      if (data.fieldErrors) setFieldErrors(data.fieldErrors);
      setStatus('error');
      setMessage(data.error || 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  return (
    <form className="max-w-[860px] flex flex-col gap-8" noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-[1fr_1fr] gap-8 mobile-down:grid-cols-[1fr] mobile-down:gap-6">
        <div className="flex flex-col gap-2">
          <Label
            unstyled
            className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
            htmlFor="firstName"
          >
            First Name
          </Label>
          <Input
            unstyled
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
            aria-invalid={!!fieldErrors.firstName}
            required
          />
          {fieldErrors.firstName && <FieldError text={fieldErrors.firstName} />}
        </div>
        <div className="flex flex-col gap-2">
          <Label
            unstyled
            className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
            htmlFor="lastName"
          >
            Last Name
          </Label>
          <Input
            unstyled
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
            aria-invalid={!!fieldErrors.lastName}
            required
          />
          {fieldErrors.lastName && <FieldError text={fieldErrors.lastName} />}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-8 mobile-down:grid-cols-[1fr] mobile-down:gap-6">
        <div className="flex flex-col gap-2">
          <Label
            unstyled
            className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
            htmlFor="phone"
          >
            Phone Number
          </Label>
          <Input
            unstyled
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone && <FieldError text={fieldErrors.phone} />}
        </div>
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
            value={profile.email}
            className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
            disabled
            readOnly
          />
          <span className="text-muted text-[0.8rem]">
            Contact us to change the email on your login.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          unstyled
          className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
          htmlFor="address"
        >
          Address
        </Label>
        <Input
          unstyled
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold disabled:text-muted disabled:cursor-not-allowed"
          aria-invalid={!!fieldErrors.address}
        />
        {fieldErrors.address && <FieldError text={fieldErrors.address} />}
      </div>

      <div className="flex items-center gap-6">
        <Button
          variant="unstyled"
          type="submit"
          className="btn-gold"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Saving…' : 'Save Changes'}
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
