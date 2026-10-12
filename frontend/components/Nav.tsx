'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

type NavProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

/** POSTs to the logout route and redirects — see app/api/auth/logout/route.ts
 * for why this goes through a server route instead of the browser client's
 * own signOut(). A plain HTML form works whether or not JS has hydrated. */
function LogoutForm({ className, onSubmit }: { className?: string; onSubmit?: () => void }) {
  return (
    <form action="/api/auth/logout" method="post" onSubmit={onSubmit}>
      <Button variant="unstyled" type="submit" className={className}>
        Logout
      </Button>
    </form>
  );
}

export default function Nav({ isAuthenticated, isAdmin }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <nav
        id="nav"
        className="fixed top-0 left-0 right-0 h-nav flex items-center justify-between py-0 px-gutter [background:rgba(5,_8,_16,_0.92)] [backdrop-filter:blur(12px)] [border-bottom:1px_solid_var(--border)] z-[100]"
      >
        <Link className="nav-logo" href="/">
          APE<span style={{ color: 'var(--cream)' }}>X</span>
        </Link>
        <ul className="flex list-none gap-10 font-condensed text-[0.95rem] tracking-[0.1em] uppercase [&_a]:text-muted [&_a]:[transition:color_0.2s] [&_a:hover]:text-cream tablet-down:hidden">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/apexway">The Apex Way</Link>
          </li>
          <li>
            <Link href="/training">Training</Link>
          </li>
          <li>
            <Link href="/programs">Programs</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link href="/admin">Admin</Link>
                </li>
              )}
              <li>
                <LogoutForm className="[font-family:inherit] [font-size:inherit] [font-weight:inherit] [font-style:inherit] [font-variant:inherit] [font-stretch:inherit] [line-height:inherit] text-muted [background:none] [border:none] p-0 cursor-pointer [transition:color_0.2s] [&:hover]:text-cream" />
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
        <div className="flex items-center gap-4">
          <Button asChild variant="unstyled">
            <Link
              className={`font-condensed font-bold tracking-[0.1em] uppercase text-[0.85rem] py-[0.6rem] px-[1.4rem] rounded-[3px] [transition:all_0.2s] [border:none] bg-gold text-black [&:hover]:opacity-[0.88]`}
              href="/programs"
            >
              Start Now
            </Link>
          </Button>
          <Button
            variant="unstyled"
            className="text-cream hidden flex-col gap-[5px] cursor-pointer p-[4px] [background:none] [border:none] tablet-down:text-cream tablet-down:flex"
            id="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {/* ── Full-screen drawer ── */}
      {open && (
        <SheetContent
          unstyled
          className="fixed inset-0 bg-black z-[99] flex flex-col items-center justify-center gap-0"
          showCloseButton={false}
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <SheetTitle unstyled className="sr-only">
            Navigation
          </SheetTitle>
          <Button
            variant="unstyled"
            className="absolute top-5 right-gutter [background:none] [border:none] text-cream cursor-pointer p-2 flex items-center justify-center opacity-[0.7] [transition:opacity_0.2s] [&:hover]:opacity-[1]"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X size={28} strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <ul className="list-none flex flex-col items-center gap-1 mb-12 [&_li_a]:block [&_li_a]:font-display [&_li_a]:text-[clamp(2.5rem,_10vw,_4rem)] [&_li_a]:tracking-logo [&_li_a]:text-cream [&_li_a]:py-[0.4rem] [&_li_a]:px-8 [&_li_a]:[transition:color_0.2s] [&_li_a:hover]:text-gold">
            <li>
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-me" onClick={() => setOpen(false)}>
                About Me
              </Link>
            </li>
            <li>
              <Link href="/training" onClick={() => setOpen(false)}>
                Training
              </Link>
            </li>
            <li>
              <Link href="/programs" onClick={() => setOpen(false)}>
                Programs
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/admin" onClick={() => setOpen(false)}>
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <LogoutForm
                    className="block font-display text-[clamp(2.5rem,_10vw,_4rem)] [font-weight:inherit] [font-style:inherit] [font-variant:inherit] [font-stretch:inherit] [line-height:inherit] tracking-logo text-cream py-[0.4rem] px-8 [background:none] [border:none] cursor-pointer [transition:color_0.2s] [&:hover]:text-gold"
                    onSubmit={() => setOpen(false)}
                  />
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </li>
            )}
          </ul>
          <Button asChild variant="unstyled">
            <Link
              className="font-condensed font-bold tracking-button uppercase text-[1rem] py-4 px-12 bg-gold text-black [border:none] [transition:opacity_0.2s] [&:hover]:opacity-[0.88]"
              href="/programs"
              onClick={() => setOpen(false)}
            >
              Start Now
            </Link>
          </Button>
        </SheetContent>
      )}
    </Sheet>
  );
}
