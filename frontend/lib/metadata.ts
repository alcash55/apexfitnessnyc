import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexfitness.fit';
export const SITE_NAME = 'ApexFitnessNYC';
export const HOME_TITLE = 'ApexFitnessNYC | Personal Training for Men 40+ in NYC';
export const HOME_DESCRIPTION =
  'Precision personal training, hormone-optimized nutrition, and a 90-day transformation system for men 40+, in-person in New York City or online coaching nationwide.';

/** Keep document and social metadata consistent for each route. */
export function pageMetadata({
  title,
  description,
  path,
  privatePage = false,
}: {
  title: string;
  description: string;
  path?: string;
  privatePage?: boolean;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    ...(privatePage ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      ...(path ? { url: path } : {}),
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}
