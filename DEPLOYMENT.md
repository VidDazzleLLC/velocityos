# VelocityOS Deployment Guide

This guide walks you through deploying VelocityOS to production.

## ⚠️ Important: GitHub Actions Deployment Requirements

**If you see CI/CD workflow failures**, this is likely because the `FIREBASE_TOKEN` secret is not configured.

### Quick Fix for Workflow Failures

1. **Generate a Firebase token:**
   ```bash
   firebase login:ci
   ```
   Copy the token that's generated.

2. **Add the token to GitHub:**
   - Go to your repository on GitHub
   - Navigate to: **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **Add secret**

3. **Re-run the failed workflow:**
   - Go to **Actions** tab
   - Click on the failed workflow run
   - Click **Re-run all jobs**

Without this token, the deployment workflows will skip deployment but won't fail the build.

## Prerequisites

Before deploying, ensure you have:

1. ✅ Node.js 18+ installed
2. ✅ Firebase CLI installed (`npm install -g firebase-tools`)
3. ✅ GitHub account with repository access
4. ⬜ Firebase account with projects created
5. ⬜ API keys for AI services (optional but recommended)
6. ⬜ `FIREBASE_TOKEN` configured in GitHub Secrets (for CI/CD)

## Quick Start Deployment

### 1. Environment Setup

Create and configure your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your actual values:
- Generate `JWT_SECRET` and `SESSION_SECRET` using a secure random generator
- Add your AI API keys if you have them
- Configure other services as needed

### 2. Firebase Project Setup

#### Create Firebase Projects

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create two projects:
   - **velocityos-staging** (for testing)
   - **velocityos-production** (for live app)

#### Enable Required Services

For each project, enable:
- ✅ Firebase Hosting
- ✅ Cloud Functions
- ✅ Firestore Database
- ✅ Authentication (Email/Password and Google)

#### Update `.firebaserc`

Edit `.firebaserc` with your actual project IDs:

```json
{
  "projects": {
    "default": "velocityos-staging",
    "prod": "velocityos-production"
  }
}
```

### 3. Local Testing

Before deploying, test everything locally:

```bash
# Install all dependencies
npm install
cd velocity-os-rebuilt && npm install && cd ..
cd functions && npm install && cd ..

# Build frontend
cd velocity-os-rebuilt
npm run build
cd ..

# Build backend
cd functions
npm run build
cd ..

# Test locally with Express server
npm start
# Visit http://localhost:3000

# Test with Firebase emulators (optional)
firebase emulators:start
```

### 4. Deploy to Staging

```bash
# Login to Firebase
firebase login

# Deploy to staging (default project)
firebase deploy --project default

# Your app will be live at:
# https://velocityos-staging.web.app
```

### 5. Configure GitHub Secrets for CI/CD

To enable automatic deployments via GitHub Actions:

#### Generate Firebase Token

```bash
firebase login:ci
# Copy the token that's generated
```

#### Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to: Settings → Secrets and variables → Actions
3. Add these secrets:
   - `FIREBASE_TOKEN`: The token from `firebase login:ci`

#### Create GitHub Environment

1. Go to: Settings → Environments
2. Create environment: `staging`
3. Add environment secret: `FIREBASE_TOKEN`
4. (Optional) Create `production` environment with protection rules

### 6. Deploy to Production

When ready for production:

```bash
# Deploy to production project
firebase deploy --project prod

# Your app will be live at:
# https://velocityos-production.web.app
```

Or trigger via GitHub Actions:
- Push to `main` branch → auto-deploys to staging
- Manually trigger production deployment from GitHub Actions

## Configuration Details

### Firebase Functions Configuration

Set up secrets for Cloud Functions:

```bash
# AI API Key (for Gemini/OpenAI)
firebase functions:secrets:set GEMINI_API_KEY --project default
firebase functions:secrets:set OPENAI_API_KEY --project default

# Authentication secrets
firebase functions:secrets:set JWT_SECRET --project default
firebase functions:secrets:set SESSION_SECRET --project default

# Repeat for production
firebase functions:secrets:set GEMINI_API_KEY --project prod
firebase functions:secrets:set OPENAI_API_KEY --project prod
firebase functions:secrets:set JWT_SECRET --project prod
firebase functions:secrets:set SESSION_SECRET --project prod
```

### Firestore Database Setup

1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose production mode (or test mode for staging)
4. Select a location close to your users

Recommended collections:
- `users` - User accounts and profiles
- `customers` - Customer data
- `tasks` - Automated tasks and workflows
- `analytics` - Business metrics and insights
- `communications` - Messages and interactions

### Firebase Authentication Setup

1. Go to Firebase Console → Authentication
2. Click "Get started"
3. Enable sign-in methods:
   - ✅ Email/Password
   - ✅ Google (add OAuth client ID/secret)
   - ⬜ Microsoft (optional)
   - ⬜ GitHub (optional)

## CI/CD Pipeline

The repository includes automated CI/CD workflows:

### Workflows

1. **CI** (`.github/workflows/ci.yml`)
   - Runs on all PRs and pushes to main/develop
   - Builds and tests all components
   - Validates configuration files

2. **Deploy Hosting** (`.github/workflows/deploy-hosting.yml`)
   - Deploys frontend to Firebase Hosting
   - Triggers on push to main

3. **Deploy Functions** (`.github/workflows/deploy-functions.yml`)
   - Deploys backend Cloud Functions
   - Triggers on push to main

### Manual Deployment

You can manually trigger deployments from GitHub Actions:
1. Go to: Actions → Deploy Hosting (or Deploy Functions)
2. Click "Run workflow"
3. Select branch and environment

## Post-Deployment Checklist

After deploying:

- [ ] Verify app loads at your Firebase Hosting URL
- [ ] Test user authentication flow
- [ ] Verify API endpoints return data
- [ ] Check Firebase Console logs for errors
- [ ] Test on mobile devices
- [ ] Run security audit: `npm audit`
- [ ] Check Lighthouse scores for performance
- [ ] Set up error monitoring (Firebase Crashlytics or Sentry)
- [ ] Configure custom domain (optional)

## Custom Domain Setup (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `app.yourcompany.com`)
4. Follow verification steps
5. Add DNS records as instructed
6. Wait for SSL certificate provisioning (can take 24 hours)

## Monitoring and Maintenance

### View Logs

```bash
# View function logs
firebase functions:log --project default

# View recent logs
firebase functions:log --only api --project default --limit 100
```

### Monitor Performance

1. Firebase Console → Performance
2. Set up performance monitoring
3. Add custom traces for key workflows

### Error Tracking

Consider integrating:
- Firebase Crashlytics
- Sentry
- LogRocket

### Backup Strategy

1. Enable Firestore automated backups
2. Export user data regularly
3. Keep configuration files in version control

## Scaling Considerations

As your app grows:

1. **Cloud Functions**: Increase memory/timeout in `functions/package.json`:
   ```json
   "engines": {
     "node": "18"
   }
   ```

2. **Firestore**: Create indexes for common queries

3. **Hosting**: Enable CDN caching with proper headers

4. **Monitoring**: Set up alerts for errors and performance issues

## Troubleshooting

### Common Issues

**Build fails with "MODULE_NOT_FOUND"**
- Run `npm install` in the correct directory
- Delete `node_modules` and `package-lock.json`, then reinstall

**Firebase deploy fails with "Permission denied"**
- Re-run `firebase login`
- Check you have owner/editor role in Firebase project
- Verify `.firebaserc` has correct project IDs

**Functions show 404 errors**
- Ensure `firebase.json` has correct rewrites
- Check function logs: `firebase functions:log`
- Verify function deployed: `firebase functions:list`

**Frontend shows blank page**
- Check browser console for errors
- Verify `velocity-os-rebuilt/out` directory exists
- Rebuild frontend: `cd velocity-os-rebuilt && npm run build`

**API returns CORS errors**
- Check Cloud Functions CORS configuration
- Ensure your domain is allowed in function code

### Getting Help

1. Check Firebase Console logs
2. Review GitHub Actions workflow logs
3. Run `firebase --debug deploy` for verbose output
4. Check [Firebase Documentation](https://firebase.google.com/docs)
5. Visit [Firebase Support](https://firebase.google.com/support)

## Production Best Practices

1. **Security**
   - Use environment variables for secrets
   - Enable Firebase App Check
   - Set up Firestore security rules
   - Implement rate limiting on functions

2. **Performance**
   - Enable caching headers
   - Optimize images and assets
   - Use CDN for static assets
   - Monitor function cold starts

3. **Reliability**
   - Set up health check endpoints
   - Implement retry logic for API calls
   - Use error boundaries in React
   - Monitor uptime with external service

4. **Cost Management**
   - Monitor Firebase usage dashboard
   - Set up billing alerts
   - Optimize function execution time
   - Use Firestore queries efficiently

## Next Steps

After successful deployment:

1. ✅ Test all features in staging
2. ✅ Run security audit
3. ✅ Set up monitoring and alerts
4. ✅ Configure custom domain
5. ✅ Train team on deployment process
6. ✅ Create runbook for common issues
7. ✅ Set up backup and disaster recovery
8. ✅ Deploy to production

## Support

For issues or questions:
- GitHub Issues: https://github.com/VidDazzleLLC/velocityos/issues
- Email: support@viddazzle.com
