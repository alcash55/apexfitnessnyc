import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DrawerProps {
  setOpen: (open: boolean) => void;
}

const drawer = ({ setOpen }: DrawerProps) => (
  <Sheet open onOpenChange={setOpen} modal={false}>
    <SheetContent
      unstyled
      showCloseButton={false}
      aria-describedby={undefined}
      onOpenAutoFocus={(event) => event.preventDefault()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'var(--charcoal)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SheetTitle unstyled className="sr-only">
        Navigation
      </SheetTitle>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <Button variant="unstyled" onClick={() => setOpen(false)} aria-label="Close navigation">
          <X size={28} aria-hidden="true" />
        </Button>
      </div>
      <ul>
        <li>
          <a href="/" onClick={() => setOpen(false)}>
            Home
          </a>
        </li>
        <li>
          <a href="/about-me" onClick={() => setOpen(false)}>
            About Me
          </a>
        </li>
        <li>
          <a href="/training" onClick={() => setOpen(false)}>
            Training
          </a>
        </li>
        <li>
          <a href="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </a>
        </li>
        <li>
          <a href="/contact" onClick={() => setOpen(false)}>
            Contact
          </a>
        </li>
      </ul>
    </SheetContent>
  </Sheet>
);

export default drawer;
