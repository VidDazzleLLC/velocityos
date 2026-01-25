# VelocityOS

VelocityOS is a next-gen AI business OS that automates routine work.

## Features

- **AI-Powered Automation**: Automate routine business tasks
- **Unified Data**: Centralize your business data in one place
- **Analytics Dashboard**: Track key business metrics
- **Customer Management**: Manage customer relationships
- **Campaign Tools**: Run marketing campaigns

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Quick Questions?

See the [FAQ.md](FAQ.md) for common questions including:
- **Where do I put the Firebase Token?**
- How do I run VelocityOS locally?
- How do I deploy to Firebase?
- Troubleshooting common issues

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing

### End-to-End Tests

VelocityOS includes comprehensive E2E tests using Playwright. See [e2e/README.md](e2e/README.md) for detailed documentation.

**Quick Start:**

```bash
# Install dependencies
npm install

# Run E2E tests (starts server automatically)
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui
```

**Test Coverage:**
- Authentication flow (login/logout)
- Dashboard analytics
- Customer management
- Campaign management
- Complete end-to-end user flows

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:debug` - Debug E2E tests

## Project Structure

```
velocityos/
├── public/                 # Static HTML files
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── e2e/                   # End-to-end tests
│   ├── fixtures/          # Test helpers and utilities
│   ├── tests/             # Test specifications
│   └── README.md          # E2E testing documentation
├── server.js              # Express server
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Firebase Configuration

VelocityOS uses Firebase for hosting and cloud functions. To enable deployments, you need to configure a Firebase Token.

### Where to Put the Firebase Token

The Firebase Token must be configured as a **GitHub Secret** to enable automated deployments via GitHub Actions.

#### Step-by-Step Instructions:

1. **Generate the Firebase Token** (requires [Firebase CLI](https://firebase.google.com/docs/cli)):
   ```bash
   firebase login:ci
   ```
   Copy the token that appears in your terminal.

2. **Add the Token to GitHub**:
   - Go to your GitHub repository
   - Navigate to: **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **"Add secret"**

3. **Verify Setup**:
   - Push to the `main` branch
   - Check the **Actions** tab to see deployment workflows run successfully

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

For deployment documentation, see [DEPLOYMENT.md](DEPLOYMENT.md).

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Build & Test**: Runs on PRs and pushes to main/develop
- **E2E Tests**: Automated end-to-end testing
- **Deployment**: Automated deployment to production (requires `FIREBASE_TOKEN` secret)

## License

Apache-2.0

