# VelocityOS Firebase Setup Guide

This guide provides step-by-step instructions to complete the Firebase integration for VelocityOS.

## Overview

VelocityOS has been configured with:
- ✅ `firebase.json` - Firebase configuration with API rewrites
- ✅ `.firebaserc` - Project aliases for staging and production
- ✅ GitHub Actions workflows for CI/CD
- ✅ Next.js export script in `velocity-os-rebuilt/package.json`

## What Still Needs to Be Done

### 1. Update Firebase Project IDs

Edit `.firebaserc` and replace placeholder project IDs with your actual Firebase project IDs:

```json
{
  "projects": {
    "default": "your-staging-project-id",
    "prod": "your-production-project-id"
  }
}
```

To find your project IDs:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on Project Settings
3. Copy your Project ID

### 2. Create Firebase Projects

If you haven't created Firebase projects yet:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create two projects:
   - **velocityos-staging** (for development/staging)
   - **velocityos-production** (for production)
3. Enable Firebase Hosting and Cloud Functions for both projects

### 3. Configure GitHub Secrets

> **⚠️ ONE-TIME SETUP**: GitHub secrets only need to be configured once.

#### FIREBASE_TOKEN Secret (Repository-wide)

The `FIREBASE_TOKEN` is required for automated deployments via GitHub Actions. This is a **repository-level secret** (not environment-specific) and only needs to be set up once.

**For detailed setup instructions**, see [MANUAL_TASKS.md](./MANUAL_TASKS.md#firebase_token-secret-configuration).

**Quick check**: Go to Settings → Secrets and variables → Actions. If `FIREBASE_TOKEN` is listed, you're all set!

### 4. Configure Environment Variables for Cloud Functions

Once you create the `functions` folder with your Cloud Functions code, you'll need to set:

#### AI Integration:
```bash
firebase functions:secrets:set GEMINI_API_KEY --project default
```

#### Twilio Integration (for OutboundCallerAgent):
```bash
firebase functions:secrets:set TWILIO_ACCOUNT_SID --project default
firebase functions:secrets:set TWILIO_AUTH_TOKEN --project default
firebase functions:secrets:set TWILIO_FROM_NUMBER --project default
```

#### CRM/Salesforce:
```bash
firebase functions:config:set crm.client_id="your_client_id" --project default
firebase functions:config:set crm.client_secret="your_client_secret" --project default
```

Repeat for production using `--project prod`

### 5. Create Production Environment in GitHub

1. Go to: Settings → Environments → New environment
2. Name it: `production`
3. Add protection rules (optional but recommended):
   - Required reviewers
   - Wait timer
   - Deployment branches: only `main`

### 6. Create Cloud Functions Folder

The `functions` folder doesn't exist yet. Create it:

```bash
cd velocityos
mkdir functions
cd functions
npm init -y
npm install firebase-functions firebase-admin express
```

Create `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Your API routes here
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

exports.api = functions.https.onRequest(app);
```

### 7. Test Deployment

#### Local Testing:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Test functions locally
firebase emulators:start

# Build frontend
cd velocity-os-rebuilt
npm run build
npm run export
```

#### Deploy to Staging:
```bash
firebase deploy --project default
```

#### Deploy to Production:
```bash
firebase deploy --project prod
```

## CI/CD Workflow

The GitHub Actions workflows will:
1. **On push to main**: Deploy to staging automatically
2. **Manual trigger**: Deploy to production

Workflows are located in `.github/workflows/`:
- `ci.yml` - Runs tests and linting
- `deploy-functions.yml` - Deploys Cloud Functions
- `deploy-hosting.yml` - Builds frontend and deploys to Firebase Hosting

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     Firebase Hosting                    │
│  (Next.js Static Export - /out)         │
│                                         │
│  Routes:                                │
│  • /**  → /index.html (SPA)             │
│  • /api/** → Cloud Function "api"       │
└─────────────────────────────────────────┘
                  |
                  ↓
┌─────────────────────────────────────────┐
│     Cloud Functions                     │
│                                         │
│  Function: api                          │
│  • /api/agent/restart                   │
│  • /api/gateway/dispatch                │
│  • /api/analytics/dashboard             │
│  • /api/customer/create                 │
│  • /api/voc/feedback                    │
│  • /api/payment/charge                  │
│  • /api/campaign/start                  │
│  • /api/outboundcall                    │
└─────────────────────────────────────────┘
                  |
                  ↓
┌─────────────────────────────────────────┐
│     External Services                   │
│  • Gemini AI (Google Generative AI)     │
│  • Twilio (Voice/SMS)                   │
│  • Salesforce CRM                       │
│  • Firebase Firestore                   │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Workflow Fails with "FIREBASE_TOKEN not found"
- Add the secret to GitHub Environments (not Repository secrets)
- Get token: `firebase login:ci`

### "Functions not found" Error
- Ensure `functions` folder exists with `index.js`
- Deploy functions: `firebase deploy --only functions`

### Frontend Shows 404
- Check that `velocity-os-rebuilt/out` exists after build
- Verify `firebase.json` points to correct public directory
- Run `npm run export` in `velocity-os-rebuilt`

### API Routes Return 404
- Verify `firebase.json` has correct rewrites
- Ensure Cloud Function "api" is deployed
- Check function logs: `firebase functions:log`

## Next Steps

1. ✅ Complete steps 1-6 above
2. ⬜ Implement actual Cloud Functions logic
3. ⬜ Set up Firestore database structure
4. ⬜ Configure Firebase Authentication
5. ⬜ Test end-to-end integration
6. ⬜ Set up monitoring and alerts

## Support

For issues or questions:
- Check Firebase Console logs
- Review GitHub Actions workflow logs
- Check function logs: `firebase functions:log --project default`
