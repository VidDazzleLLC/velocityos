# VelocityOS End-to-End (E2E) Tests

This directory contains end-to-end tests for VelocityOS that verify the complete "happy path" user flow from authentication through key features.

## Overview

The E2E tests validate that the entire VelocityOS stack works together:

- **Frontend**: Next.js app (`velocity-os-rebuilt`)
- **Backend**: Firebase Cloud Functions with Express API
- **Authentication**: Firebase Authentication with email/password and Google sign-in

### Test Coverage

The E2E test suite covers the following scenarios:

1. **Authentication Flow** (`auth.spec.ts`)
   - User login with email/password
   - Login validation (error handling)
   - User logout
   - (TODO) User signup
   - (TODO) Google sign-in

2. **Dashboard Analytics** (`dashboard.spec.ts`)
   - Dashboard page rendering
   - Analytics metrics display
   - Error-free state verification
   - Navigation elements

3. **Customer Management** (`customers.spec.ts`)
   - Navigate to customers page
   - Display customers list
   - (TODO) Create new customer
   - (TODO) Search customers
   - (TODO) View customer details

4. **Campaign Management** (`campaigns.spec.ts`)
   - Navigate to campaigns/communications page
   - Display campaign interface
   - (TODO) Start new campaign
   - (TODO) Form validation
   - (TODO) Campaign history

5. **Complete Happy Path** (`e2e.spec.ts`)
   - End-to-end flow combining all features
   - Login → Dashboard → Customers → Campaigns → Logout

## Prerequisites

Before running the E2E tests, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Firebase CLI** (for running emulators)
   ```bash
   npm install -g firebase-tools
   ```
4. **Test User Account** in Firebase Authentication
   - Email: `test@velocityos.test`
   - Password: `TestPassword123!`
   - Or configure your own credentials in `.env.test`

## Installation

1. Install dependencies in the root directory:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

   Or install all browsers:
   ```bash
   npx playwright install
   ```

## Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.test.example .env.test
   ```

2. Edit `.env.test` and configure the following:
   ```env
   TEST_BASE_URL=http://localhost:3000
   TEST_API_URL=http://localhost:5001/YOUR_PROJECT_ID/us-central1/api
   TEST_USER_EMAIL=test@velocityos.test
   TEST_USER_PASSWORD=TestPassword123!
   ```

3. Create a test user in Firebase Authentication:
   - Go to Firebase Console → Authentication
   - Add a user with the credentials from `.env.test`
   - Or use Firebase emulators for local testing

## Running Tests Locally

### Option 1: Automatic Server Startup (Recommended for Development)

The Playwright configuration includes a web server that automatically starts the Next.js app:

```bash
npm run test:e2e
```

This will:
1. Start the Next.js dev server on port 3000
2. Wait for it to be ready
3. Run all E2E tests
4. Shut down the server when tests complete

### Option 2: Manual Server Management (Recommended for Full Stack Testing)

For testing with both frontend and backend:

**Terminal 1 - Start Firebase Emulators:**
```bash
cd functions
npm run serve
```

**Terminal 2 - Start Next.js App:**
```bash
cd velocity-os-rebuilt
npm run dev
```

**Terminal 3 - Run E2E Tests:**
```bash
npm run test:e2e
```

### Test Execution Options

Run all tests:
```bash
npm run test:e2e
```

Run tests in UI mode (with browser):
```bash
npm run test:e2e:ui
```

Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

Run tests in debug mode:
```bash
npm run test:e2e:debug
```

Run specific test file:
```bash
npx playwright test e2e/tests/auth.spec.ts
```

Run tests matching a pattern:
```bash
npx playwright test --grep "login"
```

## CI Execution

E2E tests run automatically in CI/CD pipeline:

1. **On Pull Requests** to `main` or `develop` branches
2. **On Pushes** to `main` or `develop` branches

The CI workflow:
1. Builds the frontend
2. Builds the backend functions
3. Starts Firebase emulators
4. Starts Next.js app
5. Runs E2E tests
6. Uploads test results and artifacts

### Viewing CI Results

- Test results are uploaded as GitHub Actions artifacts
- Screenshots and videos from failed tests are available for download
- Check the "E2E Tests" job in the Actions tab

## Debugging Failed Tests

### Local Debugging

1. **Run in UI mode** to see tests execute visually:
   ```bash
   npm run test:e2e:ui
   ```

2. **Run in headed mode** to see the browser:
   ```bash
   npm run test:e2e:headed
   ```

3. **Use debug mode** to step through tests:
   ```bash
   npm run test:e2e:debug
   ```

4. **View trace files** for failed tests:
   ```bash
   npx playwright show-trace e2e/test-results/artifacts/trace.zip
   ```

### CI Debugging

1. Download test artifacts from GitHub Actions
2. Extract screenshots and videos from failed tests
3. View the trace file in Playwright Trace Viewer:
   ```bash
   npx playwright show-trace path/to/trace.zip
   ```

## Test Structure

```
e2e/
├── README.md                   # This file
├── fixtures/                   # Test helpers and utilities
│   ├── testUser.ts            # Test user credentials
│   ├── testData.ts            # Mock customer/campaign data
│   ├── auth.ts                # Authentication helpers
│   └── api.ts                 # API interception utilities
├── tests/                      # Test specifications
│   ├── auth.spec.ts           # Authentication tests
│   ├── dashboard.spec.ts      # Dashboard tests
│   ├── customers.spec.ts      # Customer management tests
│   ├── campaigns.spec.ts      # Campaign tests
│   └── e2e.spec.ts            # Complete end-to-end flow
└── test-results/               # Test output (generated)
    ├── html/                  # HTML test report
    ├── artifacts/             # Screenshots, videos, traces
    └── results.json           # JSON test results
```

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { loginTestUser } from '../fixtures/auth';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup - e.g., login
    await loginTestUser(page);
  });

  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/some-page');
    
    // Interact
    await page.click('button:has-text("Click Me")');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Using Test Helpers

```typescript
import { loginTestUser, logout } from '../fixtures/auth';
import { generateTestCustomer } from '../fixtures/testData';
import { waitForApiCall } from '../fixtures/api';

// Login helper
await loginTestUser(page);

// Generate test data
const customer = generateTestCustomer();

// Wait for API call
const response = await waitForApiCall(page, 'customers');
```

## Troubleshooting

### Common Issues

#### Issue: Tests timeout or fail to start

**Solution:**
- Ensure Next.js app is running on port 3000
- Check if port 3000 is available
- Increase timeout in `playwright.config.ts`

#### Issue: Authentication tests fail

**Solution:**
- Verify test user exists in Firebase Auth
- Check credentials in `.env.test`
- Ensure Firebase emulators are running (if using emulators)

#### Issue: "Browser not found" error

**Solution:**
```bash
npx playwright install chromium
```

#### Issue: Tests pass locally but fail in CI

**Solution:**
- Check CI environment variables
- Ensure all services start correctly in CI
- Review CI logs for startup errors
- Increase timeouts for CI environment

#### Issue: Flaky tests (intermittent failures)

**Solution:**
- Use proper waits instead of `waitForTimeout`
- Wait for network idle: `await page.waitForLoadState('networkidle')`
- Wait for specific elements: `await page.waitForSelector('...')`
- Increase retries in CI

### Getting Help

- Check [Playwright Documentation](https://playwright.dev)
- Review test logs in `e2e/test-results/`
- Check GitHub Actions logs for CI failures
- Open an issue in the repository

## Test Data Management

### Test User Setup

**Manual Setup:**
1. Go to Firebase Console → Authentication
2. Add user with email: `test@velocityos.test`
3. Set password: `TestPassword123!`

**Using Firebase Emulators:**
1. Start emulators: `firebase emulators:start`
2. Users are created automatically in emulators
3. Data is cleared when emulators restart

### Test Data Cleanup

Currently, test data is not automatically cleaned up. Future improvements:

- [ ] Add cleanup hooks to delete test customers after tests
- [ ] Use a separate Firebase project for testing
- [ ] Implement test data reset between runs
- [ ] Add utility to clear test data

## Future Enhancements

### Planned Test Scenarios

- [ ] User signup flow
- [ ] Google OAuth sign-in
- [ ] Customer creation with API verification
- [ ] Customer search and filtering
- [ ] Customer detail view and editing
- [ ] Campaign creation with full form validation
- [ ] Campaign status tracking
- [ ] Error handling and edge cases
- [ ] Mobile responsive testing
- [ ] Performance testing
- [ ] Accessibility testing

### Infrastructure Improvements

- [ ] Parallel test execution
- [ ] Visual regression testing
- [ ] API mocking for isolated frontend tests
- [ ] Test data factories
- [ ] Custom Playwright fixtures
- [ ] Test report integration with GitHub

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use test helpers from `fixtures/`
3. Add proper waits (no arbitrary sleeps)
4. Include descriptive test names
5. Add comments for complex logic
6. Run tests locally before committing
7. Update this README if adding new test categories

## License

Apache-2.0
