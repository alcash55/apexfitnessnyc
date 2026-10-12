import type { MetadataRoute } from 'next';

// Only /robots.txt is static so it can be included in STATIC_EXPORT builds.
// This setting does not affect page titles, descriptions, or route metadata.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Members-only and post-checkout pages stay out of search results.
      disallow: ['/library', '/checkout/', '/api/'],
    },
    sitemap: 'https://apexfitnessnyc.vercel.app/sitemap.xml',
  };
}
