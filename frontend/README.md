# [Dev](https://derekw0803.github.io/apexfitnessnyc/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can edit the homepage UI in `app/home.tsx`; `app/page.tsx` is its server wrapper. The page auto-updates as you edit the file.

This project uses `next/font` to load Bebas Neue for display text, Barlow Condensed for labels and buttons, and Inter for body text.

## Frontend theme and icons

The reusable Tailwind v4 configuration is in [`styles/apex-theme.css`](styles/apex-theme.css). It defines the existing APEX palette, font families, section spacing, content widths, typography, breakpoints, shadows, and animations. Tailwind v4 uses CSS theme configuration instead of a `tailwind.config.js` file.

[`app/globals.css`](app/globals.css) imports the theme and Tailwind utilities. The PostCSS plugin is configured in `postcss.config.mjs`. The existing reset is retained to preserve form and heading styles.

Use the tokens in new components:

```tsx
import { ArrowRight } from 'lucide-react';

<section className="bg-charcoal px-gutter py-section">
  <div className="mx-auto max-w-content">
    <h2 className="font-display text-section text-cream">Personal training</h2>
    <a className="btn-gold" href="/programs">
      View programs <ArrowRight size={16} aria-hidden="true" />
    </a>
  </div>
</section>;
```

Other utilities include `font-body`, `font-condensed`, `text-muted`, `bg-gold-dim`, `border-border`, `tracking-label`, `shadow-gold`, `max-w-copy`, `pt-nav`, `mobile:*`, and `tablet:*`. The custom breakpoints start at 600px and 900px. `tablet-down:*`, `compact-down:*`, and `mobile-down:*` preserve the previous inclusive max-width boundaries at 900px, 700px, and 600px. Existing CSS variables such as `--gold` and `--cream` reference the same theme tokens, so inline styles stay in sync. The font utilities use the variables supplied by `next/font`, with named font fallbacks for reuse elsewhere.

Component styles use Tailwind classes directly in TSX. There are no CSS modules. Shared base styles and legacy section/button classes remain in `app/globals.css`.

To reuse the theme in another Tailwind v4 app, import `styles/apex-theme.css` after Tailwind's default theme. Import individual icons from `lucide-react`. Decorative icons use `aria-hidden="true"`; icon-only buttons need an accessible label.

## shadcn/ui components

The [shadcn/ui configuration](components.json) uses Radix primitives and Lucide icons. Component sources live in `components/ui` and belong to this repo. The APEX theme supplies their semantic color tokens. `Button` defaults to the existing gold button style; `variant="outline"` uses the existing outline style.

Existing forms, tables, cards, tabs, FAQ, and navigation use these components with Tailwind classes that preserve their previous appearance. `unstyled` opts out of a component's default styling and layout wrappers. Buttons use `variant="unstyled"`. This keeps existing layouts intact. Consent checkboxes retain their native rendering.

Preserve the existing appearance when replacing components. If a visual change is required, show a side-by-side comparison and get approval before applying it or updating the reference screenshots.

Add another component with `npm run ui:add -- <component>`. Review the generated source and connect it to the APEX theme before using it. The CLI may import `cn` from its package; this repo uses `cn` from `@/lib/utils`. Do not run `shadcn init` or overwrite existing components without reviewing the changes, because that can replace the theme and local styling options. See the [shadcn installation guide](https://ui.shadcn.com/docs/installation/manual).

## Browser tests

Playwright checks the public pages, FAQ, training tabs, mobile navigation, contact form, password-recovery navigation, footer, and mobile form layout.

```bash
npm run test:e2e:install
npm run test:e2e
```

The tests start a fresh signed-out Webpack dev server on port 3100 with a separate `.next-playwright` build directory. Webpack avoids incomplete Turbopack cache chunks observed on the mounted Windows filesystem. They do not need Supabase credentials or the normal dev server. `npm run test:e2e:ui` opens Playwright's test UI, and `npm run test:e2e:report` opens the latest HTML report.

Reference screenshots in `e2e/__screenshots__` are versioned. Review visual differences before running `npm run test:e2e:update`; updating screenshots accepts the new appearance. Use the same Chromium version and operating system when comparing or updating screenshots, because font rendering can differ across platforms. Reports, traces, temporary screenshots, caches, and `.playwright-cli` logs are ignored by Git.

If Chromium is already installed outside Playwright's default cache, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable. Otherwise the install script downloads the browser version paired with this project's Playwright dependency. See the [Playwright visual-comparison guide](https://playwright.dev/docs/test-snapshots).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Page metadata

Each `app/**/page.tsx` exports route-specific Next.js metadata using `pageMetadata` from `lib/metadata.ts`. Keep titles, descriptions, canonical URLs, and social previews together in the page export. The root layout supplies the metadata base URL from `NEXT_PUBLIC_SITE_URL`, with `https://apexfitness.fit` as the default. Account, admin, and checkout pages are marked `noindex, nofollow`. Client details use a generic title to keep personal information out of metadata.

Interactive homepage and Apex Way content lives in `app/home.tsx` and `app/apexway/apexway.tsx`, leaving the page wrappers as server components that can export metadata. `e2e/metadata.spec.ts` checks public route tags and updates during client navigation.

The dev server uses Webpack. On WSL Windows-mounted workspaces, Next.js polls for source changes every second because filesystem notifications can be missed. This keeps route metadata, styles, and icons current during development.

To check metadata on an already-running server at localhost:3000 instead of starting the isolated test server, use this command on Windows, macOS, or Linux:

```bash
npm run test:e2e:metadata:live
```

Production builds use `tsconfig.build.json`, which excludes development and Playwright caches. The isolated Playwright server uses `tsconfig.playwright.json` and checks only its own generated route types. Both extend the shared application compiler settings in `tsconfig.json`. This prevents stale types for renamed routes from breaking an unrelated build.
