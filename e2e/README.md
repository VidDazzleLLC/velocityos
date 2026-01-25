# VelocityOS End-to-End (E2E) Tests

This directory contains end-to-end tests for VelocityOS that verify the complete user flow from authentication through key features.

## Overview

The E2E tests validate that the entire VelocityOS stack works together:
- **Frontend**: Next.js app or Express server with static HTML
- **Backend**: Firebase Cloud Functions with Express API
- **Authentication**: Firebase Authentication

### Test Coverage

1. **Authentication Flow** (`auth.spec.ts`)
   - User login with email/password
   - Login validation
   - User logout

2. **Dashboard Analytics** (`dashboard.spec.ts`)
   - Dashboard page rendering
   - Analytics metrics display

3. **Customer Management** (`customers.spec.ts`)
   - Navigate to customers page
   - Display customers list

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Test User Account** in Firebase Authentication
   - Email: `test@velocityos.test`
   - Password: `TestPassword123!`

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Running Tests

Run all tests:
```bash
npm run test:e2e
```

Run with UI:
```bash
npm run test:e2e:ui
```

Run in debug mode:
```bash
npm run test:e2e:debug
```

## Environment Configuration

Copy the example environment file:
```bash
cp .env.test.example .env.test
```

Edit `.env.test` and configure:
```env
TEST_BASE_URL=http://localhost:3000
TEST_USER_EMAIL=test@velocityos.test
TEST_USER_PASSWORD=TestPassword123!
```

## Writing New Tests

```typescript
import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await loginTestUser(page);
    await page.goto('/some-page');
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

## Troubleshooting

### Tests timeout
- Ensure app is running on port 3000
- Increase timeout in `playwright.config.ts`

### Authentication fails
- Verify test user exists in Firebase Auth
- Check credentials in `.env.test`

## License

Apache-2.0
