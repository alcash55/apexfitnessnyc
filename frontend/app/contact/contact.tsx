'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import Link from 'next/link';
import useContact from './useContact';

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

export default function ContactPage() {
  const { form, setForm, submit, status, message, fieldErrors } = useContact();
  const [consent, setConsent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    submit();
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="max-w-[600px] mb-16">
          <div className="section-label">Contact</div>
          <h2 id="contact" className="section-h2">
            Get In Touch
          </h2>
          <p className="section-sub">
            Ready to start your transformation? Fill out your details and a coach will reach out
            within 24 hours.
          </p>
        </div>

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
                placeholder="FIRST NAME"
                value={form.firstName}
                onChange={handleChange}
                className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
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
                placeholder="LAST NAME"
                value={form.lastName}
                onChange={handleChange}
                className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
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
                placeholder="PHONE NUMBER"
                value={form.phone}
                onChange={handleChange}
                className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
              />
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
                placeholder="EMAIL ADDRESS"
                value={form.email}
                onChange={handleChange}
                className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-4 px-5 font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
                aria-invalid={!!fieldErrors.email}
                required
              />
              {fieldErrors.email && <FieldError text={fieldErrors.email} />}
            </div>
          </div>

          <Label
            unstyled
            className="flex items-start gap-3 text-[0.85rem] text-muted leading-[1.5] [&_input]:mt-[0.2rem] [&_input]:accent-gold [&_a]:text-gold"
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              I agree to the <Link href="/privacy">Privacy Policy</Link> and consent to APEX storing
              my information to respond to this inquiry. See how we handle{' '}
              <Link href="/privacy#consent-for-health-information">health information</Link>.
            </span>
          </Label>

          {/* Honeypot: hidden from humans and screen readers, tempting to bots. */}
          <Input
            unstyled
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
            }}
          />

          <Button
            variant="unstyled"
            type="submit"
            className="btn-gold"
            disabled={!consent || status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Submit'}
          </Button>

          {message && (
            <p
              role="status"
              aria-live="polite"
              style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: status === 'success' ? 'var(--color-success)' : 'var(--color-error)',
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
