# Firebase Deployment Workflow Fix Summary

## Problem

The `deploy-functions.yml` workflow (and related deployment workflows) were failing with the following error:

```
Error: Invalid project selection, please verify project default exists and you have access.
```

Additionally, Firebase CLI was showing a deprecation warning:

```
⚠  Authenticating with `--token` is deprecated and will be removed in a future major version of `firebase-tools`.
Instead, use a service account key with `GOOGLE_APPLICATION_CREDENTIALS`.
```

## Root Causes

1. **Deprecated Authentication Method**: The workflows were using the `--token` flag for authentication, which Firebase has deprecated.
2. **Missing/Invalid Credentials**: The FIREBASE_TOKEN secret may have been missing or invalid, or the token may not have had access to the configured Firebase project.
3. **No Service Account Support**: The workflows didn't support the modern, recommended service account authentication method.

## Solution

### Changes Made

1. **Updated All Deployment Workflows**:
   - `.github/workflows/deploy-functions.yml`
   - `.github/workflows/deploy-hosting.yml`
   - `.github/workflows/deploy-production.yml`

2. **Added Service Account Authentication Support**:
   - Workflows now check for `FIREBASE_SERVICE_ACCOUNT` secret first (recommended method)
   - If found, creates a service account key file and sets `GOOGLE_APPLICATION_CREDENTIALS`
   - Uses modern authentication without the deprecated `--token` flag

3. **Maintained Backward Compatibility**:
   - Falls back to legacy `FIREBASE_TOKEN` authentication if service account is not configured
   - Shows clear deprecation warning when using token authentication
   - Both methods continue to work to ensure no disruption

4. **Improved Error Messages**:
   - Clear, actionable error messages when no credentials are found
   - Step-by-step instructions for both authentication methods
   - Links to detailed setup documentation

5. **Updated Documentation**:
   - Updated `FIREBASE_SETUP.md` with instructions for both authentication methods
   - Clearly marked service account method as recommended
   - Explained the deprecation of token-based authentication

### Authentication Flow

```
┌─────────────────────────────────────┐
│ Check for FIREBASE_SERVICE_ACCOUNT  │
└────────────┬────────────────────────┘
             │
             ├─── Found ───────────────────┐
             │                             │
             │                             ▼
             │                  ┌──────────────────────────┐
             │                  │ ✅ Use Service Account   │
             │                  │ (Recommended)            │
             │                  │ - Create key file        │
             │                  │ - Set GOOGLE_APP_CREDS   │
             │                  │ - Deploy without --token │
             │                  └──────────────────────────┘
             │
             └─── Not Found ───┐
                               │
                               ▼
                    ┌─────────────────────────┐
                    │ Check for FIREBASE_TOKEN │
                    └───────────┬─────────────┘
                                │
                                ├─── Found ───────────────┐
                                │                         │
                                │                         ▼
                                │              ┌─────────────────────────┐
                                │              │ ⚠️  Use Legacy Token   │
                                │              │ (Deprecated)            │
                                │              │ - Show warning          │
                                │              │ - Deploy with --token   │
                                │              └─────────────────────────┘
                                │
                                └─── Not Found ───┐
                                                  │
                                                  ▼
                                       ┌────────────────────┐
                                       │ ❌ Show Error      │
                                       │ Exit with code 1   │
                                       └────────────────────┘
```

## How to Fix the Deployment

### Option 1: Service Account (Recommended) ✅

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (e.g., `velocityos-staging`)
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file
6. In GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
7. Click **New repository secret**
8. Name: `FIREBASE_SERVICE_ACCOUNT`
9. Value: Paste the entire contents of the JSON file
10. Click **Add secret**

### Option 2: CI Token (Legacy, Still Supported) ⚠️

1. On your local machine, run: `firebase login:ci`
2. Authenticate with your Google account
3. Copy the generated token
4. In GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**
5. Click **New repository secret**
6. Name: `FIREBASE_TOKEN`
7. Value: Paste the token
8. Click **Add secret**

**Note**: Consider migrating to Option 1 as token authentication will be removed in future Firebase CLI versions.

## Testing the Fix

Once you've added the appropriate secret:

1. Push to the `main` branch or manually trigger the workflow
2. Check the workflow logs for:
   - Service Account: `✅ Using service account authentication (recommended)`
   - Token: `⚠️ Using legacy token authentication (deprecated)`
3. Verify the deployment completes successfully

## Benefits of This Fix

✅ **Future-Proof**: Uses modern authentication method recommended by Firebase  
✅ **Secure**: Service accounts provide better security and access control  
✅ **Backward Compatible**: Existing token-based setups continue to work  
✅ **Clear Errors**: Helpful error messages guide users to fix configuration issues  
✅ **Documented**: Complete documentation in FIREBASE_SETUP.md  

## Related Files

- `.github/workflows/deploy-functions.yml` - Cloud Functions deployment
- `.github/workflows/deploy-hosting.yml` - Hosting deployment  
- `.github/workflows/deploy-production.yml` - Production deployment
- `FIREBASE_SETUP.md` - Complete setup documentation
- `.firebaserc` - Firebase project configuration

## Additional Notes

- The service account needs appropriate permissions for deploying to Firebase (Hosting, Functions, etc.)
- For production deployments, ensure the service account has access to the production project
- The `default` alias in `.firebaserc` points to `velocityos-staging`
- The `production` alias in `.firebaserc` points to `velocityos-production`
