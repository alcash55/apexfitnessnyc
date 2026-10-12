import type { Metadata } from 'next';
import { Bebas_Neue, Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getSessionClaims } from '@/lib/auth';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexfitness.fit';
const SITE_TITLE = 'ApexFitnessNYC | Personal Training for Men 40+ in NYC';
const SITE_DESCRIPTION =
  'Precision personal training, hormone-optimized nutrition, and a 90-day transformation system for men 40+, in-person in New York City or online coaching nationwide.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'ApexFitnessNYC',
    type: 'website',
  },
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
