/**
 * Test user credentials for E2E tests
 * These credentials should match the test user created in Firebase Auth
 */
export const testUser = {
  email: process.env.TEST_USER_EMAIL || 'test@velocityos.test',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
  displayName: 'Test User',
};

export const testUser2 = {
  email: process.env.TEST_USER_EMAIL_2 || 'test2@velocityos.test',
  password: process.env.TEST_USER_PASSWORD_2 || 'TestPassword456!',
  displayName: 'Test User 2',
};
