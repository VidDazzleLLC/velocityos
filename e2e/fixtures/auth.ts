import { Page, expect } from '@playwright/test';
import { testUser } from './testUser';

/**
 * Login helper function for E2E tests
 * Logs in a test user and waits for dashboard redirect
 */
export async function loginTestUser(page: Page, userEmail?: string, userPassword?: string) {
  const email = userEmail || testUser.email;
  const password = userPassword || testUser.password;

  await page.goto('/login');
  
  // Wait for the login form to be visible
  await page.waitForLoadState('networkidle');
  
  // Fill in login credentials
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
  
  // Verify we're on the dashboard
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Signup helper function for E2E tests
 * Creates a new test user account
 */
export async function signupTestUser(page: Page, userEmail?: string, userPassword?: string) {
  const email = userEmail || testUser.email;
  const password = userPassword || testUser.password;

  await page.goto('/signup');
  
  // Wait for the signup form to be visible
  await page.waitForLoadState('networkidle');
  
  // Fill in signup form
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  
  // Check for password confirmation field
  const confirmPasswordField = page.locator('input[name="confirmPassword"], input[name="confirm_password"]');
  if (await confirmPasswordField.count() > 0) {
    await confirmPasswordField.fill(password);
  }
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
  
  // Verify we're on the dashboard
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Logout helper function for E2E tests
 */
export async function logout(page: Page) {
  // Look for logout button/link (common patterns)
  const logoutSelectors = [
    'button:has-text("Logout")',
    'button:has-text("Log out")',
    'button:has-text("Sign out")',
    'a:has-text("Logout")',
    'a:has-text("Log out")',
    'a:has-text("Sign out")',
  ];
  
  for (const selector of logoutSelectors) {
    if (await page.locator(selector).count() > 0) {
      await page.click(selector);
      break;
    }
  }
  
  // Wait for redirect to login or home page
  await page.waitForURL(/\/(login|home|$)/, { timeout: 5000 }).catch(() => {
    // Ignore timeout, page might not redirect
  });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const url = page.url();
  return url.includes('/dashboard') || !url.includes('/login');
}
