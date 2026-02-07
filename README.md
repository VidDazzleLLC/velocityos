# VelocityOS 🚀

VelocityOS is a next-gen AI business OS that automates routine work.

## ✨ Features

- **AI-Powered Automation**: Automate routine business tasks
- **Unified Data**: Centralize your business data in one place
- **Analytics Dashboard**: Track key business metrics
- **Customer Management**: Manage customer relationships
- **Campaign Tools**: Run marketing campaigns
- **Firebase Integration**: Scalable cloud infrastructure

## 🚀 Quick Start - Deploy to Firebase

The fastest way to get VelocityOS up and running:

```bash
# 1. Run the setup wizard (installs dependencies, builds app, configures Firebase)
./scripts/firebase-setup-wizard.sh

# 2. Deploy to staging
./scripts/deploy.sh

# That's it! Your app is live! 🎉
```

**For detailed deployment instructions**, see [FIREBASE_DEPLOYMENT_COMPLETE.md](FIREBASE_DEPLOYMENT_COMPLETE.md)

## 💻 Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase CLI (optional, for deployment)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

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

## 🛠️ Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:debug` - Debug E2E tests

### Deployment Scripts

- `./scripts/firebase-setup-wizard.sh` - Interactive Firebase setup
- `./scripts/deploy.sh` - Deploy to staging or production
- `./scripts/configure-firebase-secrets.sh` - Configure Firebase secrets
- `./scripts/verify-deployment.sh` - Verify deployment health
- `./scripts/generate-secrets.sh` - Generate secure secrets

## 📁 Project Structure

```
velocityos/
├── velocity-os-rebuilt/   # Frontend (Next.js 14)
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   └── out/               # Built static export (for Firebase Hosting)
├── functions/             # Backend (Firebase Cloud Functions)
│   ├── src/               # TypeScript source
│   └── lib/               # Compiled JavaScript
├── public/                # Static HTML files
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── e2e/                   # End-to-end tests
│   ├── fixtures/          # Test helpers and utilities
│   ├── tests/             # Test specifications
│   └── README.md          # E2E testing documentation
├── scripts/               # Deployment and setup scripts
├── .github/workflows/     # CI/CD pipelines
├── firebase.json          # Firebase configuration
├── .firebaserc            # Firebase project aliases
├── server.js              # Express server (local dev)
└── README.md              # This file
```

## 🚀 Deployment

### Firebase Deployment

VelocityOS uses Firebase for hosting and cloud functions:

1. **Quick Deploy**: Run `./scripts/firebase-setup-wizard.sh` for guided setup
2. **Manual Deploy**: See [FIREBASE_DEPLOYMENT_COMPLETE.md](FIREBASE_DEPLOYMENT_COMPLETE.md)

### CI/CD with GitHub Actions

- **Staging**: Auto-deploys on push to `main` branch
- **Production**: Manual deployment via workflow dispatch

### Deployment Verification

After deploying, verify everything works:

```bash
./scripts/verify-deployment.sh
```

## 📚 Documentation

### Launch Guides
- ⭐ [NEXT_STEPS_TO_LAUNCH.md](NEXT_STEPS_TO_LAUNCH.md) - **Complete launch roadmap** (START HERE)
- ⚡ [LAUNCH_QUICK_REFERENCE.md](LAUNCH_QUICK_REFERENCE.md) - Quick reference for launch steps
- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) - Pre-launch checklist
- [LAUNCH_STATUS.md](LAUNCH_STATUS.md) - Current status report

### Deployment
- [FIREBASE_DEPLOYMENT_COMPLETE.md](FIREBASE_DEPLOYMENT_COMPLETE.md) - Complete Firebase setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment overview
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase configuration details
- [e2e/README.md](e2e/README.md) - E2E testing documentation

## License

Apache-2.0

