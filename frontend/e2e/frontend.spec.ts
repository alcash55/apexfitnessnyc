import { expect, test } from '@playwright/test';

test('public pages keep their appearance', async ({ page }) => {
  for (const route of ['contact', 'login', 'pricing', 'training', 'about-me', 'apexway']) {
    const response = await page.goto(`/${route}`);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main')).toHaveScreenshot(`${route}.png`);
  }
});

test('FAQ expands and collapses with the existing appearance', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section').filter({ has: page.locator('#faq') });
  const first = section.getByRole('button').first();
  await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await expect(section).toHaveScreenshot('faq-closed.png');
  await first.click();
  await expect(section.locator('p')).toHaveCount(1);
  await expect(section).toHaveScreenshot('faq-open.png');
  await first.click();
  await expect(section.locator('p')).toHaveCount(0);
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(section.getByRole('button').nth(1)).toBeFocused();
});

test('month tabs switch the training plan without changing the layout', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section').filter({ has: page.getByText(/Month 1/) });
  await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await expect(section).toHaveScreenshot('month-one.png');
  await section.getByText(/Month 2/).click();
  await expect(section.getByText('Strength + MetCon')).toBeVisible();
  await expect(section).toHaveScreenshot('month-two.png');
  await section.getByRole('tab', { name: /Month 2/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(section.getByRole('tab', { name: /Month 3/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('mobile navigation opens, closes, and follows a link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot('mobile-navigation.png');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('button', { name: 'Toggle navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Toggle navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('contact validates consent and submits the existing form payload', async ({ page }) => {
  let submitted: unknown;
  await page.route('**/api/contact', async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ json: { success: true } });
  });
  await page.goto('/contact');
  const submit = page.getByRole('button', { name: 'Submit', exact: true });
  await expect(submit).toBeDisabled();
  await page.getByLabel('First Name', { exact: true }).fill('Alex');
  await page.getByLabel('Last Name', { exact: true }).fill('Example');
  await page.getByLabel('Email Address', { exact: true }).fill('alex@example.com');
  await page.getByRole('checkbox').check();
  await submit.click();
  await expect(page.getByRole('status')).toBeVisible();
  expect(submitted).toMatchObject({
    firstName: 'Alex',
    lastName: 'Example',
    email: 'alex@example.com',
  });
});

test('login can switch to password recovery and back', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/login');
  await page.getByRole('button', { name: 'Forgot password?' }).click();
  await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible();
  await expect(page.getByLabel('Password', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Back to login' }).click();
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('footer and mobile contact form keep their layout', async ({ page }) => {
  await page.goto('/contact');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('footer')).toHaveScreenshot('footer-desktop.png');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main')).toHaveScreenshot('contact-mobile.png');
  await expect(page.locator('footer')).toHaveScreenshot('footer-mobile.png');
});
