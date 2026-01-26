# 🚀 VelocityOS Firebase Deployment - Complete Guide

**Last Updated**: January 26, 2026

This guide provides **complete step-by-step instructions** to deploy VelocityOS to Firebase, from initial setup to production deployment.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Steps)](#quick-start)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Firebase Configuration](#firebase-configuration)
5. [GitHub Actions Setup](#github-actions-setup)
6. [Deployment](#deployment)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **Git** installed
- ✅ **Google/Firebase Account** ([Create Free Account](https://firebase.google.com/))
- ✅ **GitHub Account** with repository access
- ⬜ **Firebase CLI** (we'll install this)

---

## Quick Start

If you're familiar with Firebase and just want to get deployed quickly:

```bash
# 1. Run the automated setup
./scripts/firebase-setup-wizard.sh

# 2. Follow the prompts to:
#    - Install Firebase CLI
#    - Create Firebase projects
#    - Configure environment variables
#    - Set up GitHub secrets

# 3. Deploy to staging
./scripts/deploy.sh

# 4. Verify deployment
# Visit: https://YOUR-PROJECT-ID.web.app

# 5. Deploy to production
./scripts/deploy.sh
# (Select option 2 for production)
```

**That's it!** Your app should now be live.

---

## Detailed Setup Instructions

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

**Verify installation:**
```bash
firebase --version
# Should show: 13.x.x or higher
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will:
1. Open your browser
2. Ask you to authenticate with Google
3. Grant Firebase CLI access to your account

**Troubleshooting:**
- If browser doesn't open, copy the URL from terminal
- Use `firebase login --no-localhost` if on a remote server

### Step 3: Create Firebase Projects

You need **two** Firebase projects:

#### Create Staging Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. **Project name**: `velocityos-staging`
4. Click **Continue**
5. **Google Analytics**: Optional (recommended for production)
6. Click **Create project**
7. Wait for project creation to complete
8. **Copy the Project ID** (shown in project settings)

#### Create Production Project

Repeat the above steps with:
- **Project name**: `velocityos-production`

**Important:** Note down both Project IDs (they might be different from the project names)

### Step 4: Enable Firebase Services

For **BOTH** projects (staging and production), enable these services:

#### 4a. Enable Firebase Hosting

1. In Firebase Console, select your project
2. Click **"Hosting"** in left sidebar
3. Click **"Get started"**
4. Follow the prompts (don't run commands yet)
5. Click **"Finish"**

#### 4b. Enable Cloud Functions

1. Click **"Functions"** in left sidebar
2. Click **"Get started"**
3. **Upgrade to Blaze Plan** (required for Cloud Functions)
   - Don't worry: Blaze plan has a free tier
   - You'll only pay if you exceed free quotas
4. Click **"Continue"**

#### 4c. Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. **Mode**: Select **"Production mode"** (recommended)
   - For staging, you can use "Test mode" for easier development
4. **Location**: Choose closest to your users (e.g., `us-central1`)
5. Click **"Enable"**

#### 4d. Enable Firebase Authentication

1. Click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle to **Enable**
   - Click **"Save"**
5. (Optional) Enable **"Google"** sign-in:
   - Click on "Google"
   - Toggle to **Enable**
   - Select support email
   - Click **"Save"**

### Step 5: Configure Project IDs

Update `.firebaserc` with your actual Firebase Project IDs:

```bash
# Open .firebaserc in your editor
nano .firebaserc  # or: code .firebaserc
```

Replace with your actual Project IDs:

```json
{
  "projects": {
    "default": "your-actual-staging-project-id",
    "prod": "your-actual-production-project-id"
  }
}
```

**Example:**
```json
{
  "projects": {
    "default": "velocityos-staging-a1b2c3",
    "prod": "velocityos-production-x9y8z7"
  }
}
```

**Save the file** and verify:
```bash
firebase projects:list
# You should see your projects listed
```

### Step 6: Generate Environment Secrets

Generate secure secrets for your application:

```bash
./scripts/generate-secrets.sh
```

This will output:
```
JWT_SECRET=<random-64-char-string>
SESSION_SECRET=<random-64-char-string>
```

**Save these values** - you'll need them for the next step.

### Step 7: Configure Firebase Function Secrets

Set up secrets for Cloud Functions (do this for BOTH staging and production):

#### For Staging (default project):

```bash
# Required secrets
firebase functions:secrets:set JWT_SECRET --project default
# Paste the JWT_SECRET value when prompted

firebase functions:secrets:set SESSION_SECRET --project default
# Paste the SESSION_SECRET value when prompted

# Optional: AI API keys (if using Gemini AI features)
firebase functions:secrets:set GEMINI_API_KEY --project default
# Enter your Gemini API key (get from https://ai.google.dev/)

# Optional: OpenAI (if using OpenAI instead)
firebase functions:secrets:set OPENAI_API_KEY --project default
```

#### For Production (prod project):

```bash
# Repeat the same commands with --project prod
firebase functions:secrets:set JWT_SECRET --project prod
firebase functions:secrets:set SESSION_SECRET --project prod
firebase functions:secrets:set GEMINI_API_KEY --project prod
# ... etc
```

**Tip:** Use **different** secrets for staging and production for better security.

### Step 8: Build the Application

Build both frontend and backend:

```bash
# Build frontend (Next.js app)
cd velocity-os-rebuilt
npm install
npm run build
cd ..

# Build backend (Cloud Functions)
cd functions
npm install
npm run build
cd ..
```

**Verify builds:**
```bash
ls -la velocity-os-rebuilt/out    # Should show built files
ls -la functions/lib              # Should show compiled .js files
```

---

## GitHub Actions Setup

To enable automatic deployments via GitHub Actions:

### Step 1: Generate Firebase CI Token

```bash
firebase login:ci
```

**Copy the token** that appears in the terminal. It looks like:
```
1//0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 2: Add GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. **Name**: `FIREBASE_TOKEN`
6. **Secret**: Paste the token from Step 1
7. Click **Add secret**

### Step 3: Create GitHub Environments (Optional but Recommended)

#### Create Staging Environment:

1. In GitHub repo, go to **Settings** → **Environments**
2. Click **New environment**
3. **Name**: `staging`
4. Click **Configure environment**
5. (Optional) Add environment-specific secrets if needed

#### Create Production Environment:

1. Click **New environment**
2. **Name**: `production`
3. Click **Configure environment**
4. **Protection rules** (recommended):
   - ✅ **Required reviewers**: Add yourself or team members
   - ✅ **Wait timer**: 5 minutes (gives time to cancel if needed)
   - ✅ **Deployment branches**: Select "Selected branches" → `main`
5. Click **Save protection rules**

**Why environments?** They provide:
- Environment-specific secrets
- Deployment protection rules
- Deployment history and rollback capability

---

## Deployment

### Deploy to Staging

#### Option 1: Using the Deploy Script (Recommended)

```bash
./scripts/deploy.sh
```

The script will:
1. Check if you're logged into Firebase
2. Ask which environment (select **1** for staging)
3. Verify builds are up to date
4. Ask what to deploy (select **1** for everything)
5. Deploy to Firebase

#### Option 2: Manual Deployment

```bash
firebase use default
firebase deploy
```

**What gets deployed:**
- ✅ Frontend (Next.js static export) to Firebase Hosting
- ✅ Backend (Cloud Functions) to Firebase Functions

**Deployment takes:** 2-5 minutes

**Success message:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/velocityos-staging-xxx
Hosting URL: https://velocityos-staging-xxx.web.app
```

### Deploy to Production

**⚠️ IMPORTANT:** Only deploy to production after thoroughly testing staging!

#### Pre-Production Checklist:

- [ ] Staging deployment successful
- [ ] All features tested in staging
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] No errors in Firebase Console logs
- [ ] Performance is acceptable
- [ ] Security rules configured

#### Deploy to Production:

```bash
./scripts/deploy.sh
# Select option 2 for Production
# Confirm with "yes" when prompted
```

Or manually:
```bash
firebase use prod
firebase deploy
```

---

## Post-Deployment Verification

After deploying, verify everything works:

### 1. Check Hosting URL

Visit your Firebase Hosting URL:
- **Staging**: `https://your-staging-project-id.web.app`
- **Production**: `https://your-production-project-id.web.app`

### 2. Test Authentication

1. Click **"Sign Up"** or **"Login"**
2. Create a test account
3. Verify you can log in
4. Check that dashboard loads

### 3. Test API Endpoints

Open browser console and test API calls:

```javascript
// Test health endpoint
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)

// Should return: { status: 'ok', ... }
```

### 4. Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Check **Functions** tab:
   - Functions should show as "Active"
   - No error messages
4. Check **Hosting** tab:
   - Should show recent deployment
   - Release history visible
5. Check **Firestore** tab:
   - Should show any created data
6. Check **Authentication** tab:
   - Should show any created users

### 5. Check for Errors

```bash
# View function logs
firebase functions:log --project default --limit 50

# Filter for errors only
firebase functions:log --project default --only api --limit 100 | grep -i error
```

---

## Troubleshooting

### Common Issues and Solutions

#### 🚨 "Permission denied" when deploying

**Cause:** Not logged in or insufficient permissions

**Solution:**
```bash
firebase login --reauth
# Or check if you have Owner/Editor role in Firebase project
```

---

#### 🚨 "FIREBASE_TOKEN not found" in GitHub Actions

**Cause:** Secret not configured in GitHub

**Solution:**
1. Run: `firebase login:ci`
2. Copy the token
3. Add to GitHub Secrets (Settings → Secrets → Actions)
4. Name it exactly: `FIREBASE_TOKEN`

---

#### 🚨 Functions not deploying / showing as inactive

**Cause:** Build errors or missing dependencies

**Solution:**
```bash
cd functions
npm install
npm run build
# Check for errors

# Try deploying functions only
cd ..
firebase deploy --only functions --project default
```

---

#### 🚨 Frontend shows blank page / 404

**Cause:** Build not exported correctly

**Solution:**
```bash
cd velocity-os-rebuilt
npm run build  # This includes export
ls out/        # Verify files exist
cd ..
firebase deploy --only hosting --project default
```

---

#### 🚨 API calls return 404

**Cause:** Functions not deployed or rewrites not configured

**Solution:**
1. Verify `firebase.json` has correct rewrites (should already be there)
2. Deploy functions: `firebase deploy --only functions`
3. Check function logs: `firebase functions:log`

---

#### 🚨 "Billing account required" error

**Cause:** Cloud Functions require Blaze (pay-as-you-go) plan

**Solution:**
1. Go to Firebase Console
2. Click **Upgrade** in left sidebar
3. Select **Blaze plan**
4. Add payment method (you still get free tier)
5. Retry deployment

---

#### 🚨 CORS errors when calling API

**Cause:** CORS not configured in functions

**Solution:** Functions should already handle CORS. If still seeing errors:
```bash
# Check functions/src/index.ts has CORS middleware
# Deploy functions again
firebase deploy --only functions
```

---

#### 🚨 "Secret not found" when functions run

**Cause:** Secrets not configured in Firebase

**Solution:**
```bash
# Set the secret
firebase functions:secrets:set JWT_SECRET --project default
# Enter the secret value when prompted

# Redeploy functions
firebase deploy --only functions --project default
```

---

## Getting Help

If you encounter issues not covered here:

1. **Check Firebase Console Logs**
   - Go to Functions → Logs
   - Look for error messages

2. **Check GitHub Actions Logs**
   - Go to Actions tab
   - Click on failed workflow
   - Read error messages

3. **Run Debug Mode**
   ```bash
   firebase --debug deploy
   ```

4. **Firebase Support**
   - [Firebase Documentation](https://firebase.google.com/docs)
   - [Stack Overflow - Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)
   - [Firebase Discord Community](https://discord.gg/firebase)

5. **VelocityOS Support**
   - [GitHub Issues](https://github.com/VidDazzleLLC/velocityos/issues)
   - Create a new issue with deployment logs

---

## Next Steps

After successful deployment:

1. ✅ **Configure Custom Domain** (optional)
   - Firebase Console → Hosting → Add custom domain
   
2. ✅ **Set Up Monitoring**
   - Enable Firebase Performance Monitoring
   - Set up alerts for errors
   
3. ✅ **Configure Security Rules**
   - Review and update `firestore.rules`
   - Deploy rules: `firebase deploy --only firestore:rules`
   
4. ✅ **Enable Analytics** (optional)
   - Firebase Console → Analytics
   
5. ✅ **Set Up Backups**
   - Configure Firestore backups
   - Export important data regularly

---

## Summary

You should now have:

- ✅ VelocityOS deployed to Firebase Hosting
- ✅ Cloud Functions running and accessible via `/api/*`
- ✅ Firestore database configured
- ✅ Authentication enabled
- ✅ CI/CD pipeline configured for automatic deployments
- ✅ Both staging and production environments

**Congratulations!** 🎉 VelocityOS is now **100% OPERATIONAL** and ready for users!

---

## Appendix: Project Structure

```
velocityos/
├── velocity-os-rebuilt/    # Frontend (Next.js)
│   ├── src/
│   ├── public/
│   └── out/                # Built static files (deployed to Hosting)
├── functions/              # Backend (Cloud Functions)
│   ├── src/
│   └── lib/                # Compiled functions (deployed)
├── firebase.json           # Firebase configuration
├── .firebaserc            # Project aliases
├── firestore.rules        # Database security rules
├── firestore.indexes.json # Database indexes
└── scripts/
    ├── deploy.sh          # Deployment helper
    └── generate-secrets.sh # Secret generator
```

---

**Questions?** Check the [Troubleshooting](#troubleshooting) section or create a [GitHub Issue](https://github.com/VidDazzleLLC/velocityos/issues).
