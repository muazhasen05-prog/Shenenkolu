import { test, expect } from '@playwright/test';

test.describe('Public Website & Multilingual Navigation', () => {
  test('homepage opens and displays institutional branding in English', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Shenen Kolu Woreda/i);

    // Verify header branding
    const brandElement = page.getByText(/Shenen Kolu Woreda Prosperity Party/i).first();
    await expect(brandElement).toBeVisible();

    // Verify hero CTA buttons
    const readNewsBtn = page.getByRole('link', { name: /Read Latest News/i }).first();
    await expect(readNewsBtn).toBeVisible();

    // Verify footer
    await expect(page.getByText(/All rights reserved/i)).toBeVisible();
  });

  test('switches language between English, Afaan Oromoo, and Amharic', async ({ page }) => {
    // 1. English
    await page.goto('/en');
    await expect(page.getByRole('link', { name: /Home/i }).first()).toBeVisible();

    // 2. Afaan Oromoo
    await page.goto('/om');
    await expect(page.getByRole('link', { name: /Fuula Duraa/i }).first()).toBeVisible();
    await expect(page.getByText(/Paartii Badhaadhinaa Aanaa Shenen Koolu/i).first()).toBeVisible();

    // 3. Amharic
    await page.goto('/am');
    await expect(page.getByRole('link', { name: /ዋና ገጽ/i }).first()).toBeVisible();
    await expect(page.getByText(/የሸነን ኮሉ ወረዳ ብልጽግና ፓርቲ/i).first()).toBeVisible();
  });

  test('navigates to news archive and opens single news article', async ({ page }) => {
    await page.goto('/en/news');
    await expect(page.getByRole('heading', { name: /Official News & Updates/i })).toBeVisible();

    // Click first article
    const firstArticleLink = page.getByRole('link', { name: /Woreda Agricultural Bureau/i }).first();
    if (await firstArticleLink.isVisible()) {
      await firstArticleLink.click();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('displays localized 404 page for nonexistent routes', async ({ page }) => {
    await page.goto('/en/non-existent-page-path-12345');
    await expect(page.getByText(/Page Not Found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
  });
});
