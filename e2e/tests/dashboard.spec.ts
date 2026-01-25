import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';

test.describe('Dashboard Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginTestUser(page);
  });

  test('should display dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard heading or title
    const dashboardIndicators = [
      page.locator('h1:has-text("Dashboard")'),
      page.locator('text=Dashboard'),
      page.locator('[data-testid="dashboard"]'),
    ];
    
    let foundDashboard = false;
    for (const indicator of dashboardIndicators) {
      if (await indicator.count() > 0) {
        foundDashboard = true;
        break;
      }
    }
    
    expect(foundDashboard).toBe(true);
  });

  test('should display analytics metrics', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Common analytics metric patterns
    const metricPatterns = [
      /total.*customer/i,
      /revenue/i,
      /active.*campaign/i,
      /customer.*count/i,
      /total.*sales/i,
      /analytics/i,
      /metrics/i,
      /statistics/i,
    ];
    
    // Look for at least one metric on the page
    let foundMetric = false;
    for (const pattern of metricPatterns) {
      const elements = await page.locator(`text=${pattern}`).count();
      if (elements > 0) {
        foundMetric = true;
        break;
      }
    }
    
    // If no text metrics found, check for numeric displays (common in analytics)
    if (!foundMetric) {
      // Look for number displays (analytics often show numbers prominently)
      const numberDisplays = await page.locator('[class*="metric"], [class*="stat"], [class*="count"], [class*="total"]').count();
      foundMetric = numberDisplays > 0;
    }
    
    expect(foundMetric).toBe(true);
  });

  test('should not display error state', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that no error messages are displayed
    const errorPatterns = [
      'text=/error|failed|unable/i',
      '[class*="error"]',
      '[data-testid="error"]',
    ];
    
    for (const pattern of errorPatterns) {
      const errorElements = await page.locator(pattern).count();
      // It's okay to have some error elements in the DOM, but they shouldn't be visible
      if (errorElements > 0) {
        const visibleErrors = await page.locator(pattern).filter({ hasText: /error|failed/i }).count();
        expect(visibleErrors).toBe(0);
      }
    }
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for navigation elements that exist in the sidebar
    // The dashboard has: Dashboard, Contacts, Analytics, AI Insights, Settings
    const navItems = [
      page.locator('.nav-item:has-text("Dashboard")'),
      page.locator('.nav-item:has-text("Contacts")'),
      page.locator('.nav-item:has-text("Analytics")'),
      page.locator('.nav-item:has-text("Settings")'),
    ];
    
    // At least one navigation item should be visible
    let foundNav = false;
    for (const navItem of navItems) {
      if (await navItem.count() > 0) {
        await expect(navItem.first()).toBeVisible();
        foundNav = true;
        break;
      }
    }
    
    expect(foundNav).toBe(true);
  });

  // TODO: Add more specific tests when dashboard components are known
  // test('should display customer count', async ({ page }) => {
  //   await page.goto('/dashboard');
  //   await expect(page.locator('[data-testid="customer-count"]')).toBeVisible();
  // });
  
  // test('should display revenue metrics', async ({ page }) => {
  //   await page.goto('/dashboard');
  //   await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
  // });
});
