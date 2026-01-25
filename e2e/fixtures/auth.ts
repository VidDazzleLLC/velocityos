import { Page } from '@playwright/test';
import { testUser } from './testUser';

export async function loginTestUser(page: Page, email?: string, password?: string) {
  const loginEmail = email || testUser.email;
  const loginPassword = password || testUser.password;
  
  await page.goto('/');
  await page.fill('input[type="email"]', loginEmail);
  await page.fill('input[type="password"]', loginPassword);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}

export async function logout(page: Page) {
  // TODO: Implement when logout functionality is added
  const logoutButton = page.locator('text=Logout, text=Sign out');
  if (await logoutButton.count() > 0) {
    await logoutButton.first().click();
  }
}

export async function signupTestUser(page: Page, email: string, password: string) {
  // TODO: Implement when signup page is created
  await page.goto('/signup');
  // ... signup flow
}
