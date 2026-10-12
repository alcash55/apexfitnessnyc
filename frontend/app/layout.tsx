import type { Metadata } from 'next';
import { SITE_URL, HOME_TITLE, HOME_DESCRIPTION } from '@/lib/metadata';
import { Bebas_Neue, Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getSessionClaims } from '@/lib/auth';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  // Several weights and italics are only used later or on other pages.
  preload: false,
  subsets: ['latin'],
  variable: '--font-barlow',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ApexFitnessNYC',
  url: SITE_URL,
  description:
    'Personal training and online coaching for men 40+. In-person training in New York City; online coaching available nationwide.',
  areaServed: [
    { '@type': 'City', name: 'New York, NY' },
    { '@type': 'Country', name: 'United States' },
  ],
  sameAs: ['https://www.instagram.com/apex.fitnessnyc'],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nav can't call getSessionClaims() itself — that's a server-only function
  // (it reads next/headers cookies()) and Nav is a 'use client' component
  // for its drawer/hamburger state. So the layout reads the session once,
  // here, and passes the resulting auth state down as plain props.
  const claims = await getSessionClaims();
  const isAuthenticated = claims !== null;
  const isAdmin = claims?.is_admin === true;

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="noise" />

        <Nav isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <main style={{ flex: 1, paddingTop: '72px' }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
