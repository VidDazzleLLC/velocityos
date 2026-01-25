/**
 * Test data for E2E tests
 * Mock customer and campaign data
 */

export const testCustomer = {
  name: `Test Customer ${Date.now()}`,
  email: `customer${Date.now()}@test.com`,
  phone: '555-0123',
  company: 'Test Company Inc.',
};

export const testCampaign = {
  name: `Test Campaign ${Date.now()}`,
  subject: 'Test Email Subject',
  message: 'This is a test campaign message for E2E testing.',
  targetAudience: 'All Customers',
};

/**
 * Generate unique test data to avoid conflicts between test runs
 */
export function generateTestCustomer() {
  const timestamp = Date.now();
  return {
    name: `E2E Test Customer ${timestamp}`,
    email: `customer-${timestamp}@velocityos.test`,
    phone: '555-' + String(timestamp).slice(-4),
    company: `Test Co ${timestamp}`,
  };
}

export function generateTestCampaign() {
  const timestamp = Date.now();
  return {
    name: `E2E Test Campaign ${timestamp}`,
    subject: `Test Subject ${timestamp}`,
    message: `Test campaign message created at ${timestamp}`,
    targetAudience: 'All Customers',
  };
}
