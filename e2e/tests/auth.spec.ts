import { test, expect } from '@playwright/test';
import { loginTestUser, signupTestUser, logout } from '../fixtures/auth';
import { testUser } from '../fixtures/testUser';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage before each test
    await page.context().clearCookies();
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    
    // Check for login form elements
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginTestUser(page);
    
    // Verify successful login by checking dashboard URL
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify user is authenticated (check for common authenticated elements)
    // This might be a user menu, logout button, or dashboard content
    const authenticatedElements = [
      page.locator('text=Dashboard'),
      page.locator('text=Logout'),
      page.locator('text=Sign out'),
    ];
    
    // At least one authenticated element should be visible
    let foundAuthenticated = false;
    for (const element of authenticatedElements) {
      if (await element.count() > 0 && await element.first().isVisible()) {
        foundAuthenticated = true;
        break;
      }
    }
    
    expect(foundAuthenticated).toBe(true);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Try to login with invalid credentials
    await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait a bit for error to appear
    await page.waitForTimeout(2000);
    
    // Should still be on login page or show error
    const currentUrl = page.url();
    const isStillOnLogin = currentUrl.includes('/login');
    const hasErrorMessage = await page.locator('text=/error|invalid|wrong/i').count() > 0;
    
    // Either still on login page OR showing an error message
    expect(isStillOnLogin || hasErrorMessage).toBe(true);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await loginTestUser(page);
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Logout
    await logout(page);
    
    // Wait for logout to complete
    await page.waitForTimeout(1000);
    
    // Should be redirected to login or home page
    const currentUrl = page.url();
    const isLoggedOut = currentUrl.includes('/login') || 
                       currentUrl.endsWith('/') || 
                       currentUrl.includes('/home');
    
    expect(isLoggedOut).toBe(true);
  });

  // TODO: Add test for signup flow when signup page is implemented
  // test('should signup with new user', async ({ page }) => {
  //   await signupTestUser(page, `newuser${Date.now()}@test.com`, 'NewPassword123!');
  //   await expect(page).toHaveURL(/.*dashboard/);
  // });

  // TODO: Add test for Google sign-in
  // test('should login with Google', async ({ page }) => {
  //   // This requires mocking Google OAuth flow
  // });
});
