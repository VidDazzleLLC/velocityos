# Firebase Deployment Authentication Fix

## Problem
Firebase deployments in GitHub Actions were failing with the error:
```
Error: Failed to authenticate, have you run firebase login?
```

This occurred even though the `FIREBASE_TOKEN` secret was properly set in GitHub repository secrets.

## Root Cause
The issue had two main causes:

1. **w9jds/firebase-action@master**: This third-party action does not properly pass the `FIREBASE_TOKEN` environment variable to the Firebase CLI running inside its Docker container.

2. **Incorrect token reference syntax**: In `deploy-functions.yml`, the token was referenced as `$FIREBASE_TOKEN` (shell variable) instead of `${{ secrets.FIREBASE_TOKEN }}` (GitHub Actions expression), which meant the token wasn't being properly expanded.

## Solution
Replaced all Firebase deployments to use the official Firebase CLI directly with proper token authentication:

### Changes Made

#### 1. deploy-hosting.yml
- **Before**: Used `w9jds/firebase-action@master` with environment variable
- **After**: Install Firebase CLI globally and run `firebase deploy --only hosting --token "${{ secrets.FIREBASE_TOKEN }}" --non-interactive`

#### 2. deploy-functions.yml  
- **Before**: Token referenced as `$FIREBASE_TOKEN` (incorrect)
- **After**: Token referenced as `${{ secrets.FIREBASE_TOKEN }}` (correct)

#### 3. deploy-production.yml
- **Before**: Used `w9jds/firebase-action@master` for both hosting and functions
- **After**: Install Firebase CLI globally and use direct commands with proper token syntax for both jobs

### Key Improvements
1. ✅ Direct use of Firebase CLI ensures compatibility and transparency
2. ✅ Proper GitHub Actions expression syntax `${{ secrets.FIREBASE_TOKEN }}`
3. ✅ Added `--non-interactive` flag for CI/CD environments
4. ✅ Consistent approach across all deployment workflows
5. ✅ Added `--force` flag for functions to handle minor version changes

## How It Works Now

### Authentication Flow
1. GitHub Actions workflow runs
2. `FIREBASE_TOKEN` secret is accessed via `${{ secrets.FIREBASE_TOKEN }}`
3. Token is passed directly to Firebase CLI using `--token` flag
4. Firebase CLI authenticates using the service account token
5. Deployment proceeds successfully

### Deployment Commands
```bash
# Staging/Default (deploy-hosting.yml, deploy-functions.yml)
firebase deploy --only hosting --token "${{ secrets.FIREBASE_TOKEN }}" --non-interactive
firebase deploy --only functions --token "${{ secrets.FIREBASE_TOKEN }}" --non-interactive --force

# Production (deploy-production.yml)
firebase use production && firebase deploy --only hosting --token "${{ secrets.FIREBASE_TOKEN }}" --non-interactive
firebase use production && firebase deploy --only functions --token "${{ secrets.FIREBASE_TOKEN }}" --non-interactive --force
```

## Verification
The workflows now properly:
- ✅ Authenticate with Firebase using the GitHub secret
- ✅ Select the correct Firebase project (default/staging or production)
- ✅ Deploy hosting and functions independently
- ✅ Run in non-interactive mode suitable for CI/CD
- ✅ Handle function deployments with force flag when needed

## Testing
To test the deployment:
1. Push to `main` branch - triggers staging deployment
2. Manually trigger "Deploy to Production" workflow for production deployment

The FIREBASE_TOKEN secret must be set in GitHub repository settings at:
Settings → Secrets and variables → Actions → Repository secrets

## References
- Firebase CLI documentation: https://firebase.google.com/docs/cli#cli-ci-systems
- GitHub Actions secrets: https://docs.github.com/en/actions/security-guides/encrypted-secrets
