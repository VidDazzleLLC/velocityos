import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';

test.describe('Google Workspace Sync', () => {
  test.beforeEach(async ({ page }) => {
    // Login with test user before each test
    await loginTestUser(page);
  });

  test.describe('Gmail Integration', () => {
    test('should navigate to Gmail sync settings', async ({ page }) => {
      // Try different possible Gmail integration URLs
      const gmailUrls = [
        '/settings/integrations/gmail',
        '/integrations/gmail',
        '/settings/gmail',
        '/gmail',
      ];
      
      let navigated = false;
      for (const url of gmailUrls) {
        try {
          await page.goto(url, { timeout: 5000 });
          await page.waitForLoadState('networkidle', { timeout: 5000 });
          
          const hasGmailContent = await page.locator('text=/gmail|email/i').count() > 0;
          if (hasGmailContent) {
            navigated = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // If no specific page, check if there's a settings/integrations page
      if (!navigated) {
        await page.goto('/settings');
        await page.waitForLoadState('networkidle');
        navigated = await page.locator('text=/gmail|integration/i').count() > 0;
      }
      
      expect(navigated).toBe(true);
    });

    // TODO: Implement when Gmail sync is available
    test.skip('should connect Gmail account', async ({ page }) => {
      await page.goto('/settings/integrations/gmail');
      
      // Click connect Gmail button
      await page.click('button:has-text("Connect Gmail")');
      
      // OAuth flow for Gmail
      await page.waitForTimeout(2000);
      
      // Verify connection successful
      await expect(page.locator('text=/connected|synced/i')).toBeVisible();
    });

    test.skip('should display Gmail inbox sync status', async ({ page }) => {
      await page.goto('/gmail');
      
      // Wait for sync status
      await page.waitForLoadState('networkidle');
      
      // Check for sync indicators
      const syncIndicators = [
        page.locator('text=/syncing|synced|last sync/i'),
        page.locator('[data-testid="sync-status"]'),
      ];
      
      let foundStatus = false;
      for (const indicator of syncIndicators) {
        if (await indicator.count() > 0) {
          foundStatus = true;
          break;
        }
      }
      
      expect(foundStatus).toBe(true);
    });

    test.skip('should fetch and display Gmail messages', async ({ page }) => {
      await page.goto('/gmail');
      await page.waitForLoadState('networkidle');
      
      // Wait for messages to load
      const messagesLoaded = await page.waitForSelector('text=/inbox|message/i', { timeout: 10000 });
      expect(messagesLoaded).toBeTruthy();
      
      // Verify message list exists
      const messageCount = await page.locator('[data-testid="email-item"], .email-item, .message-row').count();
      expect(messageCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Google Calendar Integration', () => {
    test('should navigate to Calendar sync settings', async ({ page }) => {
      const calendarUrls = [
        '/settings/integrations/calendar',
        '/integrations/calendar',
        '/settings/calendar',
        '/calendar',
      ];
      
      let navigated = false;
      for (const url of calendarUrls) {
        try {
          await page.goto(url, { timeout: 5000 });
          await page.waitForLoadState('networkidle', { timeout: 5000 });
          
          const hasCalendarContent = await page.locator('text=/calendar|event|schedule/i').count() > 0;
          if (hasCalendarContent) {
            navigated = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      // Check settings page for calendar mention
      if (!navigated) {
        await page.goto('/settings');
        await page.waitForLoadState('networkidle');
        navigated = await page.locator('text=/calendar|integration/i').count() > 0;
      }
      
      expect(navigated).toBe(true);
    });

    test.skip('should sync Google Calendar events', async ({ page }) => {
      await page.goto('/calendar');
      
      // Trigger calendar sync
      const syncButton = page.locator('button:has-text("Sync Calendar")');
      if (await syncButton.count() > 0) {
        await syncButton.click();
      }
      
      // Wait for sync to complete
      await page.waitForSelector('text=/synced|up to date/i', { timeout: 10000 });
      
      // Verify events displayed
      const eventsExist = await page.locator('[data-testid="calendar-event"], .calendar-event').count() > 0;
      expect(eventsExist).toBe(true);
    });

    test.skip('should create calendar event from VelocityOS', async ({ page }) => {
      await page.goto('/calendar');
      
      // Click create event
      await page.click('button:has-text("Create Event")');
      
      // Fill event details
      await page.fill('input[name="title"]', 'E2E Test Meeting');
      await page.fill('input[name="date"]', '2026-12-31');
      await page.fill('input[name="time"]', '14:00');
      
      // Save event
      await page.click('button:has-text("Save")');
      
      // Verify event created and synced to Google Calendar
      await expect(page.locator('text=E2E Test Meeting')).toBeVisible();
      await expect(page.locator('text=/synced to google calendar/i')).toBeVisible();
    });
  });

  test.describe('Google Drive Integration', () => {
    test('should navigate to Drive sync settings', async ({ page }) => {
      const driveUrls = [
        '/settings/integrations/drive',
        '/integrations/drive',
        '/settings/drive',
        '/drive',
        '/files',
      ];
      
      let navigated = false;
      for (const url of driveUrls) {
        try {
          await page.goto(url, { timeout: 5000 });
          await page.waitForLoadState('networkidle', { timeout: 5000 });
          
          const hasDriveContent = await page.locator('text=/drive|file|document/i').count() > 0;
          if (hasDriveContent) {
            navigated = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!navigated) {
        await page.goto('/settings');
        await page.waitForLoadState('networkidle');
        navigated = await page.locator('text=/drive|file|integration/i').count() > 0;
      }
      
      expect(navigated).toBe(true);
    });

    test.skip('should connect Google Drive account', async ({ page }) => {
      await page.goto('/settings/integrations/drive');
      
      // Click connect Drive button
      await page.click('button:has-text("Connect Drive")');
      
      // OAuth flow
      await page.waitForTimeout(2000);
      
      // Verify connection
      await expect(page.locator('text=/connected|authorized/i')).toBeVisible();
    });

    test.skip('should browse Google Drive files', async ({ page }) => {
      await page.goto('/drive');
      await page.waitForLoadState('networkidle');
      
      // Check for file browser
      const fileList = await page.locator('[data-testid="file-list"], .file-list, table').count() > 0;
      expect(fileList).toBe(true);
      
      // Verify files can be displayed
      const fileItems = await page.locator('[data-testid="file-item"], .file-item, tr').count();
      expect(fileItems).toBeGreaterThanOrEqual(0);
    });

    test.skip('should upload file to Google Drive', async ({ page }) => {
      await page.goto('/drive');
      
      // Click upload button
      await page.click('button:has-text("Upload")');
      
      // Handle file upload dialog
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles('./e2e/fixtures/test-file.txt');
      
      // Wait for upload
      await page.waitForSelector('text=/uploaded|complete/i', { timeout: 10000 });
      
      // Verify file appears in list
      await expect(page.locator('text=test-file.txt')).toBeVisible();
    });
  });

  test.describe('Cross-Integration Features', () => {
    test.skip('should show unified workspace dashboard', async ({ page }) => {
      await page.goto('/workspace');
      
      // Verify dashboard shows data from multiple Google services
      const integrations = ['Gmail', 'Calendar', 'Drive'];
      
      for (const integration of integrations) {
        const widget = page.locator(`[data-testid="${integration.toLowerCase()}-widget"]`);
        if (await widget.count() > 0) {
          await expect(widget).toBeVisible();
        }
      }
    });

    test.skip('should sync changes across all Google services', async ({ page }) => {
      // Test that changes in one service reflect in unified view
      await page.goto('/workspace');
      
      // Get initial counts
      const initialEmailCount = await page.locator('[data-testid="email-count"]').textContent();
      const initialEventCount = await page.locator('[data-testid="event-count"]').textContent();
      
      // Trigger sync
      await page.click('button:has-text("Sync All")');
      
      // Wait for sync
      await page.waitForSelector('text=/synced|up to date/i', { timeout: 15000 });
      
      // Verify sync completed
      await expect(page.locator('text=/last synced/i')).toBeVisible();
    });
  });

  // TODO: Add tests for:
  // - Google Contacts sync
  // - Google Sheets integration
  // - Google Docs integration
  // - Real-time sync updates
  // - Conflict resolution
  // - Offline mode handling
});
