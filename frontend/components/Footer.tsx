import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="bg-black [border-top:1px_solid_var(--border)] p-[5rem_5vw_2rem]">
      <div className="max-w-content my-0 mx-auto grid grid-cols-[repeat(4,_1fr)] gap-16 mb-16 tablet-down:grid-cols-[1fr_1fr] tablet-down:gap-10 mobile-down:grid-cols-[1fr] mobile-down:gap-8">
        {/* Brand */}
        <div>
          <Link
            className="nav-logo"
            style={{ marginBottom: '1rem', display: 'inline-flex' }}
            href="/"
          >
            APE<span style={{ color: 'var(--cream)' }}>X</span>
          </Link>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              marginTop: '1rem',
            }}
          >
            In-person coaching in New York City, online coaching nationwide. Built for men 40 and
            up.
          </p>
        </div>

        {/* Site map */}
        <div>
          <h4 className="font-condensed tracking-button uppercase text-gold mb-6 text-[0.82rem]">
            Site Map
          </h4>
          <ul className="list-none flex flex-col gap-3 text-[0.88rem] [color:rgba(240,_235,_224,_0.55)] [&_a]:[transition:color_0.2s] [&_a]:[background:none] [&_a]:[border:none] [&_a]:[color:inherit] [&_a]:[font-size:inherit] [&_a]:p-0 [&_a]:text-left [&_button]:[transition:color_0.2s] [&_button]:[background:none] [&_button]:[border:none] [&_button]:[color:inherit] [&_button]:[font-size:inherit] [&_button]:p-0 [&_button]:text-left [&_a:hover]:text-cream [&_button:hover]:text-cream">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about-me">About Me</Link>
            </li>
            <li>
              <Link href="/training">Training</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className="font-condensed tracking-button uppercase text-gold mb-6 text-[0.82rem]">
            Programs
          </h4>
          <ul className="list-none flex flex-col gap-3 text-[0.88rem] [color:rgba(240,_235,_224,_0.55)] [&_a]:[transition:color_0.2s] [&_a]:[background:none] [&_a]:[border:none] [&_a]:[color:inherit] [&_a]:[font-size:inherit] [&_a]:p-0 [&_a]:text-left [&_button]:[transition:color_0.2s] [&_button]:[background:none] [&_button]:[border:none] [&_button]:[color:inherit] [&_button]:[font-size:inherit] [&_button]:p-0 [&_button]:text-left [&_a:hover]:text-cream [&_button:hover]:text-cream">
            <li>
              <Link href="/training">1-on-1 Private Training</Link>
            </li>
            <li>
              <Link href="/training">Online Coaching</Link>
            </li>
            <li>
              <Link href="/pricing">View Pricing</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-condensed tracking-button uppercase text-gold mb-6 text-[0.82rem]">
            Contact
          </h4>
          <ul className="list-none flex flex-col gap-3 text-[0.88rem] [color:rgba(240,_235,_224,_0.55)] [&_a]:[transition:color_0.2s] [&_a]:[background:none] [&_a]:[border:none] [&_a]:[color:inherit] [&_a]:[font-size:inherit] [&_a]:p-0 [&_a]:text-left [&_button]:[transition:color_0.2s] [&_button]:[background:none] [&_button]:[border:none] [&_button]:[color:inherit] [&_button]:[font-size:inherit] [&_button]:p-0 [&_button]:text-left [&_a:hover]:text-cream [&_button:hover]:text-cream">
            <li>New York City, NY</li>
            <li>
              <Link href="/contact">Send a Message</Link>
            </li>
            <li>
              <a
                href="https://www.instagram.com/apex.fitnessnyc"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-content my-0 mx-auto flex justify-between items-center pt-8 [border-top:1px_solid_rgba(255,_255,_255,_0.05)] text-[0.75rem] text-muted font-condensed tracking-[0.05em] mobile-down:flex-col mobile-down:gap-3 mobile-down:text-center">
        <p>© 2026 APEX Human Performance. All rights reserved. New York City.</p>
        <div className="flex gap-6 [&_a:hover]:text-cream">
          <Link href="/contact">Contact</Link>
          <Link href="/pricing">Get Started</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
