# Production Firebase Project Setup

## Issue
The production deployment workflow was failing with error:
```
Error: Invalid project selection, please verify project production exists and you have access.
```

## Root Cause
The `.firebaserc` file references a `velocityos-production` Firebase project that doesn't exist yet.

## Current Fix (Temporary)
The `deploy-production.yml` workflow has been updated to use the `default` project (velocityos-staging) until a separate production project is created. This allows deployments to work immediately.

## Setting Up a Separate Production Environment (Recommended)

To create a proper production environment separate from staging:

### 1. Create Production Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** or **Create a project**
3. Name it `velocityos-production` (or your preferred name)
4. Enable Google Analytics (optional)
5. Accept terms and create the project

### 2. Enable Required Services

In the Firebase Console for your new production project:

1. **Firebase Hosting**
   - Navigate to **Hosting** → Click **Get started**

2. **Cloud Functions**
   - Navigate to **Functions** → Click **Get started**
   - Upgrade to Blaze (Pay as you go) plan if prompted

3. **Firestore Database**
   - Navigate to **Firestore Database** → Click **Create database**
   - Select **Production mode**
   - Choose location (e.g., `us-central1`)

4. **Firebase Authentication**
   - Navigate to **Authentication** → Click **Get started**
   - Enable **Email/Password** provider

### 3. Update .firebaserc

Verify the `.firebaserc` file has the correct project ID:

```json
{
  "projects": {
    "default": "velocityos-staging",
    "production": "velocityos-production"
  }
}
```

If your production project has a different ID, update it accordingly.

### 4. Generate New Firebase Token with Access

The existing `FIREBASE_TOKEN` secret may only have access to the staging project. To grant access to production:

```bash
# Login and generate token with access to both projects
firebase login:ci
```

Copy the generated token and update the `FIREBASE_TOKEN` secret in GitHub:
- Go to repository **Settings** → **Secrets and variables** → **Actions**
- Update `FIREBASE_TOKEN` with the new token

### 5. Update Deploy Workflow

Once the production project is created and the token has access, update `.github/workflows/deploy-production.yml`:

Change:
```yaml
firebase use default
```

Back to:
```yaml
firebase use production
```

### 6. Test Production Deployment

Trigger the production deployment workflow:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Enter "DEPLOY" to confirm
5. Monitor the deployment

### 7. Verify Production Deployment

After successful deployment:
- Check Firebase Console for deployed functions and hosting
- Visit your production URL: `https://velocityos-production.web.app`
- Test critical functionality

## Alternative: Keep Single Environment

If you prefer to keep a single environment instead of separate staging/production:
- No changes needed - the current fix deploys to the default (staging) project
- Simply use the "Deploy to Production" workflow when you want to deploy
- Consider renaming the workflow to avoid confusion

## Additional Resources

For more information about deployment and Firebase setup:
- [`PRODUCTION_DEPLOYMENT_GUIDE.md`](./PRODUCTION_DEPLOYMENT_GUIDE.md) - Full production deployment guide
- [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) - Firebase configuration details
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - General deployment documentation
- [`DEPLOY_TO_PRODUCTION.md`](./DEPLOY_TO_PRODUCTION.md) - Production deployment overview
