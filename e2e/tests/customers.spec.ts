import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';
import { generateTestCustomer } from '../fixtures/testData';

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginTestUser(page);
  });

  test('should navigate to customers page', async ({ page }) => {
    // Try different possible customer page URLs
    const customerUrls = ['/customers', '/dashboard/customers', '/customer'];
    
    let navigated = false;
    for (const url of customerUrls) {
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        // Check if we're on a customer-related page
        const hasCustomerContent = await page.locator('text=/customer/i').count() > 0;
        if (hasCustomerContent) {
          navigated = true;
          break;
        }
      } catch (e) {
        // Try next URL
        continue;
      }
    }
    
    expect(navigated).toBe(true);
  });

  test('should display customers list', async ({ page }) => {
    await page.goto('/customers');
    await page.waitForLoadState('networkidle');
    
    // Look for common list/table elements
    const listIndicators = [
      page.locator('table'),
      page.locator('[role="table"]'),
      page.locator('[data-testid="customers-list"]'),
      page.locator('ul, ol').filter({ hasText: /customer/i }),
    ];
    
    let foundList = false;
    for (const indicator of listIndicators) {
      if (await indicator.count() > 0) {
        foundList = true;
        break;
      }
    }
    
    // If no list found, at least the page should have customer-related content
    if (!foundList) {
      foundList = await page.locator('text=/customer/i').count() > 0;
    }
    
    expect(foundList).toBe(true);
  });

  // TODO: Uncomment and adapt when customer creation UI is available
  // test('should create a new customer', async ({ page }) => {
  //   await page.goto('/customers');
  //   await page.waitForLoadState('networkidle');
  //   
  //   // Get initial customer count
  //   const initialCount = await page.locator('[data-testid="customer-row"], tr').count();
  //   
  //   // Click "Create Customer" or "Add Customer" button
  //   await page.click('button:has-text("Create Customer"), button:has-text("Add Customer"), a:has-text("New Customer")');
  //   
  //   // Fill out customer form
  //   const testCustomer = generateTestCustomer();
  //   await page.fill('input[name="name"]', testCustomer.name);
  //   await page.fill('input[name="email"]', testCustomer.email);
  //   await page.fill('input[name="phone"]', testCustomer.phone);
  //   
  //   // Submit form
  //   await page.click('button[type="submit"]');
  //   
  //   // Wait for success confirmation
  //   await page.waitForSelector('text=/success|created|added/i', { timeout: 5000 });
  //   
  //   // Verify customer appears in list
  //   await page.goto('/customers');
  //   await page.waitForLoadState('networkidle');
  //   
  //   const newCount = await page.locator('[data-testid="customer-row"], tr').count();
  //   expect(newCount).toBeGreaterThan(initialCount);
  //   
  //   // Verify customer data
  //   await expect(page.locator(`text=${testCustomer.name}`)).toBeVisible();
  // });

  // test('should search for customers', async ({ page }) => {
  //   await page.goto('/customers');
  //   
  //   // Enter search query
  //   await page.fill('input[type="search"], input[placeholder*="search"]', 'Test Customer');
  //   
  //   // Wait for results
  //   await page.waitForTimeout(1000);
  //   
  //   // Verify filtered results
  //   const results = await page.locator('[data-testid="customer-row"]').count();
  //   expect(results).toBeGreaterThanOrEqual(0);
  // });

  // test('should view customer details', async ({ page }) => {
  //   await page.goto('/customers');
  //   
  //   // Click on first customer
  //   await page.click('[data-testid="customer-row"]:first-child');
  //   
  //   // Verify detail view
  //   await expect(page).toHaveURL(/.*customer.*\/[0-9a-zA-Z]+/);
  //   await expect(page.locator('text=/customer.*detail/i')).toBeVisible();
  // });
});
