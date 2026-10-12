import { expect, test } from '@playwright/test';

const routes = [
  ['/', 'ApexFitnessNYC | Personal Training for Men 40+ in NYC'],
  ['/apexway', 'The Apex Way | ApexFitnessNYC'],
  ['/training', 'Training | ApexFitnessNYC'],
  ['/programs', 'Programs | ApexFitnessNYC'],
  ['/contact', 'Contact | ApexFitnessNYC'],
  ['/about-me', 'About Your Coach | ApexFitnessNYC'],
  ['/links', 'Links | ApexFitnessNYC'],
  ['/privacy', 'Privacy Policy | ApexFitnessNYC'],
  ['/terms', 'Terms of Service | ApexFitnessNYC'],
  ['/login', 'Login | ApexFitnessNYC'],
  ['/checkout/success', 'Payment Confirmed | ApexFitnessNYC'],
  ['/checkout/cancelled', 'Checkout Cancelled | ApexFitnessNYC'],
] as const;

for (const [path, title] of routes) {
  test(`metadata matches ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('title')).toHaveCount(1);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
    await expect(description).toHaveAttribute('content', /\S+/);
    const content = await description.getAttribute('content');
    if (path !== '/') {
      expect(content).not.toContain('Precision personal training, hormone-optimized nutrition');
    }
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      content ?? '',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      content ?? '',
    );
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /^https?:\/\//);
    const href = await canonical.getAttribute('href');
    expect(new URL(href ?? '').pathname).toBe(path);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', href ?? '');
    if (path === '/login' || path.startsWith('/checkout/')) {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
    }
  });
}

test('navigation replaces metadata without a full reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.dataset.navigationMarker = 'retained';
  });
  await page.locator('nav').getByRole('link', { name: 'Programs', exact: true }).click();
  await expect(page).toHaveURL(/\/programs$/);
  await expect(page).toHaveTitle('Programs | ApexFitnessNYC');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Programs | ApexFitnessNYC',
  );
  await expect(page.locator('title')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-navigation-marker', 'retained');
});
