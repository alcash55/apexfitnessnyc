'use client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import useContact from './useContact';

export default function ContactPage() {
  const { form, setForm, submit } = useContact();

  // Generic handler to update any field in the form state dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Handles form submission safely
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit(); // Executes the submission logic from your custom hook
  }

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="section-inner">
        <div className="max-w-[600px] mb-16">
          <div className="section-label">Contact</div>
          <h2 className="section-h2">Get In Touch</h2>
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
                required
              />
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
                required
              />
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
                required
              />
            </div>
          </div>

          <Button variant="unstyled" type="submit" className="btn-gold">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
