# VelocityOS Firebase Setup Guide

This guide provides step-by-step instructions to complete the Firebase integration for VelocityOS.

## Overview

VelocityOS has been configured with:
- ✅ `firebase.json` - Firebase configuration with API rewrites
- ✅ `.firebaserc` - Project aliases for staging and production
- ✅ GitHub Actions workflows for CI/CD
- ✅ Next.js export script in `velocity-os-rebuilt/package.json`

## What Still Needs to Be Done

### ⚠️ CRITICAL: Configure FIREBASE_TOKEN Secret (Required for Deployment)

**This is the most common issue preventing deployments from working!**

The Firebase deployment workflows require a `FIREBASE_TOKEN` secret to authenticate with Firebase. Without this, deployments will fail with:
```
Error: Failed to authenticate, have you run firebase login?
```

#### How to Set Up FIREBASE_TOKEN:

1. **Generate a Firebase CI token** by running this command on your local machine:
   ```bash
   firebase login:ci
   ```
   This will:
   - Open a browser for you to authenticate with your Google account
   - Generate a CI token and display it in the terminal
   - Copy this token (it looks like: `1//0abcdefghijklmnopqrstuvwxyz...`)

2. **Add the token to GitHub Secrets**:
   - Go to your GitHub repository
   - Click on **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **Add secret**

3. **Verify the secret is set**:
   - The next time you push to `main`, the deployment workflow will validate the token
   - If the token is missing, you'll see a clear error message with setup instructions

⚠️ **Note**: The token allows GitHub Actions to deploy to Firebase on your behalf. Keep it secure and never commit it to your repository.

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

### 3. Configure Additional GitHub Secrets (Optional)

The `FIREBASE_TOKEN` (configured above) is the only required secret for basic deployments.

If you need environment-specific configurations, you can optionally set up GitHub Environments:

#### For Staging Environment (Optional):
Go to: Settings → Environments → staging → Add environment secret

- Additional secrets as needed for your staging environment

#### For Production Environment (Optional):
Create a production environment first, then add:

- Additional secrets as needed for your production environment

**Note**: For most use cases, the repository-level `FIREBASE_TOKEN` secret is sufficient for both staging and production deployments.

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
# or, if you're somewhere below it:
cd "$(git rev-parse --show-toplevel)"

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

### ❌ "Failed to authenticate, have you run firebase login?" Error

**Cause**: The `FIREBASE_TOKEN` secret is not set in GitHub repository settings.

**Solution**:
1. Run `firebase login:ci` on your local machine to generate a token
2. Go to GitHub repository Settings → Secrets and variables → Actions
3. Add a new repository secret named `FIREBASE_TOKEN` with the generated token
4. See the "CRITICAL: Configure FIREBASE_TOKEN Secret" section above for detailed steps

### Workflow Fails with "FIREBASE_TOKEN not found"
- The secret must be added as a **repository secret**, not an environment secret
- Get token: `firebase login:ci`
- Add to: Settings → Secrets and variables → Actions → New repository secret

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
