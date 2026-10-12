'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Form = {
  expenseDate: string;
  amount: string;
  category: string;
  description: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY: Form = {
  expenseDate: '',
  amount: '',
  category: '',
  description: '',
};

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

/**
 * Adds a new business expense. The API's DB column is amount_cents, so the
 * dollar amount typed here is converted to cents client-side before POSTing
 * — the API itself expects amount_cents directly and does not accept a raw
 * dollar figure.
 */
export default function ExpenseForm() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    const dollars = Number(form.amount);
    const amountCents = Number.isFinite(dollars) ? Math.round(dollars * 100) : NaN;

    try {
      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_date: form.expenseDate,
          amount_cents: amountCents,
          category: form.category,
          description: form.description,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setForm(EMPTY);
        setStatus('success');
        setMessage('Expense added.');
        router.refresh();
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
    <div className="bg-card [border:1px_solid_var(--border)] p-8 mb-12 max-w-[860px]">
      <div className="font-condensed text-[0.9rem] tracking-button uppercase text-gold mb-6">
        Add Expense
      </div>
      <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-[1fr_1fr] gap-6 mobile-down:grid-cols-[1fr] mobile-down:gap-4">
          <div className="flex flex-col gap-2">
            <Label
              unstyled
              className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
              htmlFor="expenseDate"
            >
              Date
            </Label>
            <Input
              unstyled
              id="expenseDate"
              name="expenseDate"
              type="date"
              value={form.expenseDate}
              onChange={handleChange}
              className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-[1.1rem] font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
              aria-invalid={!!fieldErrors.expense_date}
              required
            />
            {fieldErrors.expense_date && <FieldError text={fieldErrors.expense_date} />}
          </div>
          <div className="flex flex-col gap-2">
            <Label
              unstyled
              className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
              htmlFor="amount"
            >
              Amount (USD)
            </Label>
            <Input
              unstyled
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-[1.1rem] font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
              aria-invalid={!!fieldErrors.amount_cents}
              required
            />
            {fieldErrors.amount_cents && <FieldError text={fieldErrors.amount_cents} />}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-6 mobile-down:grid-cols-[1fr] mobile-down:gap-4">
          <div className="flex flex-col gap-2">
            <Label
              unstyled
              className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
              htmlFor="category"
            >
              Category
            </Label>
            <Input
              unstyled
              id="category"
              name="category"
              type="text"
              placeholder="e.g. Rent, Equipment"
              value={form.category}
              onChange={handleChange}
              className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-[1.1rem] font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              unstyled
              className="font-condensed text-[0.75rem] tracking-label uppercase text-gold"
              htmlFor="description"
            >
              Description
            </Label>
            <Input
              unstyled
              id="description"
              name="description"
              type="text"
              placeholder="Optional notes"
              value={form.description}
              onChange={handleChange}
              className="bg-charcoal [border:1px_solid_var(--border)] text-cream py-[0.85rem] px-[1.1rem] font-condensed text-[0.95rem] tracking-[0.05em] w-full [transition:border-color_0.2s] placeholder:text-muted focus:[outline:none] focus:border-gold"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Button
            variant="unstyled"
            type="submit"
            className="btn-gold"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Saving…' : 'Add Expense'}
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
    </div>
  );
}
