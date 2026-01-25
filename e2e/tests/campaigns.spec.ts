import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';
import { generateTestCampaign } from '../fixtures/testData';
import { waitForApiCall } from '../fixtures/api';

test.describe('Campaign Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginTestUser(page);
  });

  test('should navigate to campaigns/communications page', async ({ page }) => {
    // Try different possible campaign page URLs
    const campaignUrls = [
      '/campaigns',
      '/communications',
      '/dashboard/campaigns',
      '/dashboard/communications',
      '/campaign',
    ];
    
    let navigated = false;
    for (const url of campaignUrls) {
      try {
        await page.goto(url);
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        // Check if we're on a campaign-related page
        const hasCampaignContent = 
          await page.locator('text=/campaign|communication/i').count() > 0;
        
        if (hasCampaignContent) {
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

  test('should display campaigns list or interface', async ({ page }) => {
    await page.goto('/communications');
    await page.waitForLoadState('networkidle');
    
    // Look for campaign-related content
    const campaignIndicators = [
      page.locator('text=/campaign/i'),
      page.locator('text=/communication/i'),
      page.locator('[data-testid*="campaign"]'),
      page.locator('button:has-text("Start Campaign")'),
      page.locator('button:has-text("Create Campaign")'),
    ];
    
    let foundCampaignUI = false;
    for (const indicator of campaignIndicators) {
      if (await indicator.count() > 0) {
        foundCampaignUI = true;
        break;
      }
    }
    
    expect(foundCampaignUI).toBe(true);
  });

  // TODO: Uncomment and adapt when campaign UI is fully implemented
  // test('should start a new campaign', async ({ page }) => {
  //   await page.goto('/communications');
  //   await page.waitForLoadState('networkidle');
  //   
  //   // Fill out campaign form
  //   const testCampaign = generateTestCampaign();
  //   
  //   await page.fill('input[name="name"], input[placeholder*="campaign name"]', testCampaign.name);
  //   await page.fill('input[name="subject"], input[placeholder*="subject"]', testCampaign.subject);
  //   await page.fill('textarea[name="message"], textarea[placeholder*="message"]', testCampaign.message);
  //   
  //   // Set up API interception to verify the call
  //   const apiPromise = waitForApiCall(page, 'campaign/start');
  //   
  //   // Click "Start Campaign" button
  //   await page.click('button:has-text("Start Campaign")');
  //   
  //   // Wait for API call and verify response
  //   const response = await apiPromise;
  //   expect(response.status()).toBeLessThan(400);
  //   
  //   const responseData = await response.json();
  //   expect(responseData).toHaveProperty('success', true);
  //   
  //   // Verify success message appears
  //   await expect(page.locator('text=/success|started|sent/i')).toBeVisible({ timeout: 5000 });
  // });

  // test('should validate campaign form', async ({ page }) => {
  //   await page.goto('/communications');
  //   
  //   // Try to submit empty form
  //   await page.click('button:has-text("Start Campaign")');
  //   
  //   // Should show validation errors
  //   await expect(page.locator('text=/required|invalid/i')).toBeVisible();
  // });

  // test('should display campaign history', async ({ page }) => {
  //   await page.goto('/communications');
  //   
  //   // Look for campaign history or list
  //   const historyElements = await page.locator('table, [data-testid="campaign-list"]').count();
  //   expect(historyElements).toBeGreaterThan(0);
  // });
});
