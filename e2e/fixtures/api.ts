import { Page, Route } from '@playwright/test';

/**
 * Intercept API calls for testing
 */
export async function interceptApiCall(
  page: Page,
  endpoint: string,
  callback?: (route: Route) => void
) {
  await page.route(`**/api/${endpoint}**`, (route) => {
    if (callback) {
      callback(route);
    } else {
      route.continue();
    }
  });
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page, endpoint: string, timeout = 10000) {
  return page.waitForResponse(
    (response) => response.url().includes(`/api/${endpoint}`) && response.status() < 400,
    { timeout }
  );
}

/**
 * Mock successful API response
 */
export async function mockApiSuccess(
  page: Page,
  endpoint: string,
  responseData: any,
  status = 200
) {
  await page.route(`**/api/${endpoint}**`, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

/**
 * Mock API error response
 */
export async function mockApiError(
  page: Page,
  endpoint: string,
  errorMessage: string,
  status = 500
) {
  await page.route(`**/api/${endpoint}**`, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: errorMessage }),
    });
  });
}
