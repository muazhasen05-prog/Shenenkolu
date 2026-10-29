import { test, expect } from '@playwright/test';

test.describe('Administrative Dashboard Protection & RBAC', () => {
  test('redirects unauthenticated visitor from /admin to login page', async ({ page }) => {
    await page.goto('/admin');
    // Middleware redirects unauthenticated requests
    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.getByText(/Sign In/i).first()).toBeVisible();
  });
});
