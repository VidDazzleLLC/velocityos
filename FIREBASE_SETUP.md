# VelocityOS Firebase Setup Guide

This guide provides step-by-step instructions to complete the Firebase integration for VelocityOS.

## Quick Start: Where to Put the Firebase Token? 

**The Firebase Token goes in GitHub Repository Secrets**, not in your code or `.env` files!

### Instructions:

1. **Generate the token locally:**
   ```bash
   firebase login:ci
   ```

2. **Add it to GitHub:**
   - Go to: **GitHub Repository → Settings → Secrets and variables → Actions**
   - Click **"New repository secret"**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **"Add secret"**

That's it! GitHub Actions will now be able to deploy your app to Firebase.

---

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

The `FIREBASE_TOKEN` secret is required for GitHub Actions to deploy to Firebase.

#### Quick Setup (Recommended):
Add the token as a **Repository Secret** for simplicity:

1. Generate token: `firebase login:ci`
2. Go to: **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token
6. Click **"Add secret"**

#### Advanced Setup (Optional):
For more control, you can use **GitHub Environments** instead:

**For Staging Environment:**
1. Go to: **Settings → Environments → Create "staging"**
2. Add environment secret: `FIREBASE_TOKEN`

**For Production Environment:**
1. Go to: **Settings → Environments → Create "production"**  
2. Add environment secret: `FIREBASE_TOKEN`
3. (Optional) Add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches: only `main`

> **Note:** Repository secrets work for most use cases. Use environment secrets only if you need different tokens for staging vs production, or want deployment protection rules.

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

### 5. Create Cloud Functions Folder

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

### 6. Test Deployment

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
- Make sure you added the secret to GitHub repository settings
- Path: **Settings → Secrets and variables → Actions → Repository secrets**
- Verify the name is exactly `FIREBASE_TOKEN` (case-sensitive)
- Get a new token: `firebase login:ci`

If using GitHub Environments (advanced setup):
- Ensure the secret is added to the correct environment
- Verify your workflow references the right environment name

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
