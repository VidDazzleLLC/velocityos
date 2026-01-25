import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(login|auth|$)/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginTestUser(page);
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
