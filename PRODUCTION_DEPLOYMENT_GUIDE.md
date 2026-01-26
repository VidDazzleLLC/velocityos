# VelocityOS Production Deployment Guide

**Date**: January 26, 2026  
**Status**: Ready for Production Deployment  
**Firebase Billing**: $1000 GenAI Credits Configured

---

## 🎯 Overview

This guide will walk you through deploying VelocityOS to production Firebase. PR #21 has been merged with all deployment automation, and CI tests are running. You're ready to deploy!

### What's Already Done ✅

From PR #21 (merged):
- ✅ Deployment automation scripts (`scripts/deploy.sh`, `scripts/setup.sh`)
- ✅ GitHub Actions CI/CD workflows configured
- ✅ Firebase configuration files ready
- ✅ Complete documentation (DEPLOYMENT.md, LAUNCH_CHECKLIST.md)
- ✅ Frontend and backend builds verified
- ✅ E2E tests passing

### What You'll Do Today 🚀

1. Verify Firebase project configuration
2. Set up production secrets
3. Deploy to production using deployment scripts
4. Verify deployment
5. Monitor usage with your $1000 GenAI credits

**Estimated Time**: 30-45 minutes

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Firebase account with access to `velocityos-production` project
- [ ] Firebase billing enabled with $1000 GenAI credits configured
- [ ] Node.js 18+ installed locally
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Git repository cloned locally
- [ ] GitHub access for repository secrets

---

## 🔥 Step 1: Verify Firebase Project Setup (5 minutes)

### 1.1 Confirm Production Project Exists

```bash
# Login to Firebase (if not already logged in)
firebase login

# List your Firebase projects
firebase projects:list
```

**Expected Output**: You should see `velocityos-production` in the list.

### 1.2 Verify Billing is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `velocityos-production` project
3. Click the gear icon → **Project settings**
4. Go to **Usage and billing** tab
5. Confirm **Blaze (Pay as you go)** plan is active
6. Verify $1000 GenAI credits are available

### 1.3 Enable Required Firebase Services

In the Firebase Console for `velocityos-production`:

1. **Firebase Hosting**
   - Go to **Hosting** in left menu
   - Click **Get started** if not already enabled
   - No configuration needed yet

2. **Cloud Functions**
   - Go to **Functions** in left menu
   - Click **Get started** if not already enabled
   - Accept permissions prompts

3. **Firestore Database**
   - Go to **Firestore Database** in left menu
   - Click **Create database**
   - Select **Production mode**
   - Choose a location close to your users (e.g., `us-central1`)
   - Click **Enable**

4. **Firebase Authentication**
   - Go to **Authentication** in left menu
   - Click **Get started**
   - Enable **Email/Password** sign-in method
   - (Optional) Enable **Google** sign-in if needed

### 1.4 Update `.firebaserc` with Actual Project ID

Check your current `.firebaserc`:

```bash
cat .firebaserc
```

It should look like:
```json
{
  "projects": {
    "default": "velocityos-staging",
    "prod": "velocityos-production"
  }
}
```

**Important**: Verify these project IDs match your actual Firebase projects:
- The `"default"` alias should point to your staging project
- The `"prod"` alias should point to your production project
- Replace `velocityos-staging` and `velocityos-production` with your actual Firebase project IDs if different
- You can find your project IDs in the Firebase Console or by running `firebase projects:list`

---

## 🔐 Step 2: Configure Production Secrets (10 minutes)

### 2.1 Generate Required Secrets

The repository includes a script to generate secure secrets:

```bash
# Run the secret generation script
./scripts/generate-secrets.sh
```

**Output**: This will generate cryptographically secure values for:
- `JWT_SECRET` (for authentication tokens)
- `SESSION_SECRET` (for session management)

**Important**: Copy these values! You'll need them in the next steps.

### 2.2 Set Firebase Functions Secrets

Configure the secrets in Firebase Cloud Functions for production:

```bash
# Set JWT_SECRET for production
firebase functions:secrets:set JWT_SECRET --project prod

# When prompted, paste the JWT_SECRET value from step 2.1
# Press Enter when done

# Set SESSION_SECRET for production
firebase functions:secrets:set SESSION_SECRET --project prod

# When prompted, paste the SESSION_SECRET value from step 2.1
# Press Enter when done
```

### 2.3 (Optional) Configure AI API Keys

If you want to use AI features with your $1000 GenAI credits:

```bash
# For Google Gemini API (recommended for GenAI credits)
firebase functions:secrets:set GEMINI_API_KEY --project prod

# For OpenAI API (optional)
firebase functions:secrets:set OPENAI_API_KEY --project prod

# For Anthropic Claude API (optional)
firebase functions:secrets:set ANTHROPIC_API_KEY --project prod
```

**Where to get API keys**:
- **Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Anthropic**: [Anthropic Console](https://console.anthropic.com/)

### 2.4 Verify Secrets Are Set

```bash
# List all secrets for production project
firebase functions:secrets:access --project prod
```

You should see: `JWT_SECRET`, `SESSION_SECRET`, and any AI API keys you configured.

---

## 🏗️ Step 3: Pre-Deployment Build Verification (5 minutes)

Before deploying, verify that everything builds correctly:

### 3.1 Build Frontend

```bash
cd velocity-os-rebuilt
npm install
npm run build
```

**Expected Output**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (X/X)
✓ Finalizing page optimization
```

Verify the output directory exists:
```bash
ls -la out/
```

### 3.2 Build Backend

```bash
cd ../functions
npm install
npm run build
```

**Expected Output**:
```
Successfully compiled X files with TypeScript
```

Verify the compiled output:
```bash
ls -la lib/
```

You should see `index.js` and other compiled files.

```bash
# Return to repository root
cd ..
```

---

## 🚀 Step 4: Deploy to Production (10 minutes)

### Option A: Using the Deployment Script (Recommended)

The repository includes an interactive deployment script that handles everything:

```bash
# Run the deployment script
./scripts/deploy.sh
```

**Follow the prompts**:

1. **Select deployment target**: Enter `2` for Production
2. **Confirmation**: Type `yes` to confirm production deployment
3. **What to deploy**: Enter `1` for Everything (hosting + functions)
4. **Final confirmation**: Enter `y` to proceed

The script will:
- ✅ Verify Firebase CLI is installed and authenticated
- ✅ Check that builds are up to date
- ✅ Validate Firebase configuration files
- ✅ Deploy hosting and functions to production
- ✅ Display the production URL

**Expected Output**:
```
🚀 Starting deployment...

=== Deploying to 'velocityos-production'...

i  deploying hosting, functions
✔  hosting: Deploy complete
✔  functions: Deploy complete

✅ Deployment successful!

🌐 Your app is live at:
   https://velocityos-production.web.app
   https://velocityos-production.firebaseapp.com
```

### Option B: Using Firebase CLI Directly

If you prefer to use Firebase CLI commands directly:

```bash
# Select the production project
firebase use prod

# Deploy everything
firebase deploy --project prod

# OR deploy separately:
# Deploy hosting only
firebase deploy --only hosting --project prod

# Deploy functions only
firebase deploy --only functions --project prod
```

---

## ✅ Step 5: Post-Deployment Verification (5 minutes)

### 5.1 Verify Hosting Deployment

1. **Open your production URL** in a browser:
   - `https://velocityos-production.web.app`
   - OR `https://velocityos-production.firebaseapp.com`

2. **Check that the app loads**:
   - [ ] Homepage loads without errors
   - [ ] Login page is accessible (`/login`)
   - [ ] Dashboard loads after login (`/dashboard`)
   - [ ] No console errors (open browser DevTools → Console)

### 5.2 Verify Functions Deployment

```bash
# List deployed functions
firebase functions:list --project prod
```

**Expected Output**: You should see your `api` function listed.

Test the API endpoint:
```bash
# Test health endpoint
# Note: Replace 'us-central1' with your region and 'velocityos-production' with your actual project ID
# You can find the full URL in Firebase Console → Functions after deployment
curl https://us-central1-velocityos-production.cloudfunctions.net/api/health

# Expected: {"status":"ok"}

# Or check Firebase Console → Functions → api → Trigger URL for your actual endpoint
```

### 5.3 Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `velocityos-production` project
3. **Hosting** tab: Verify deployment is listed and shows "Success"
4. **Functions** tab: Verify functions are deployed and active
5. **Functions** → **Logs**: Check for any errors (should be clean)

### 5.4 Test Core Functionality

Manually test these critical flows:

1. **Authentication**:
   - [ ] Visit `/login` page
   - [ ] Try creating a test account
   - [ ] Verify login works
   - [ ] Check that session persists

2. **Dashboard**:
   - [ ] Navigate to `/dashboard`
   - [ ] Verify all navigation links work
   - [ ] Check that data loads (even if placeholder data)

3. **API Endpoints**:
   - [ ] Open browser DevTools → Network tab
   - [ ] Navigate through the app
   - [ ] Verify API calls return 200 status codes

---

## 📊 Step 6: Monitor Usage & Manage Costs (Ongoing)

With $1000 GenAI credits configured, you'll want to monitor usage:

### 6.1 Set Up Billing Alerts

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `velocityos-production` project
3. Click gear icon → **Project settings**
4. Go to **Usage and billing** tab
5. Click **Manage billing** → **Budgets & alerts**
6. Create alerts at:
   - **$250** (25% of budget) - Warning
   - **$500** (50% of budget) - Review usage
   - **$750** (75% of budget) - Optimize immediately
   - **$900** (90% of budget) - Critical alert

### 6.2 Monitor Daily Usage

Check your usage regularly:

1. **Firebase Console** → **Usage and billing**:
   - Cloud Functions invocations
   - Hosting bandwidth
   - Firestore reads/writes
   - GenAI API calls

2. **Functions Logs**:
   ```bash
   firebase functions:log --project prod --limit 100
   ```

3. **Google Cloud Console** (for detailed AI usage):
   - [Cloud Console](https://console.cloud.google.com/)
   - Go to **Billing** → **Reports**
   - Filter by service to see GenAI API usage

### 6.3 Cost Optimization Tips

To maximize your $1000 GenAI credits:

1. **Cache AI Responses**: Implement caching for frequently requested AI queries
2. **Rate Limiting**: Add rate limits to prevent abuse
3. **Optimize Prompts**: Use efficient prompts to reduce token usage
4. **Monitor Heavy Users**: Track which users/features consume most credits
5. **Set Usage Quotas**: Implement per-user quotas in your application

### 6.4 Set Up Monitoring Dashboard

For real-time monitoring:

1. **Firebase Performance Monitoring**:
   ```bash
   # Add Firebase Performance SDK (optional)
   npm install firebase
   ```

2. **Error Tracking**:
   - Consider adding Sentry or Firebase Crashlytics
   - Set up alerts for critical errors

3. **Uptime Monitoring**:
   - Use external service like UptimeRobot or Pingdom
   - Monitor `https://velocityos-production.web.app`

---

## 🔄 Step 7: Configure GitHub Actions for Production CI/CD (Optional)

Enable automatic production deployments via GitHub Actions:

### 7.1 Generate Firebase Token for CI

```bash
firebase login:ci
```

**Output**: Copy the token that's displayed.

### 7.2 Add GitHub Secret

1. Go to your GitHub repository: `https://github.com/VidDazzleLLC/velocityos`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token from step 7.1
6. Click **Add secret**

### 7.3 Create Production Environment (Recommended)

For extra protection:

1. In GitHub repository: **Settings** → **Environments**
2. Click **New environment**
3. Name: `production`
4. Configure protection rules:
   - [ ] **Required reviewers**: Add team members who must approve
   - [ ] **Wait timer**: Optional delay before deployment
   - [ ] **Deployment branches**: Only allow `main` branch
5. Click **Save protection rules**

### 7.4 Update Workflows for Production

The current workflows deploy to staging on every push to `main`. To add production deployment:

**Manual Production Deployment** (recommended approach):
- Keep auto-deploy to staging on push to `main`
- Manually trigger production deployments from GitHub Actions UI when ready

**To manually deploy**:
1. Go to **Actions** tab in GitHub
2. Select **Deploy Hosting** or **Deploy Functions**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

---

## 📝 Step 8: Post-Launch Checklist

After successful production deployment:

### Immediate (First Hour)
- [ ] Verify app is accessible at production URL
- [ ] Test authentication flow end-to-end
- [ ] Check all pages load without errors
- [ ] Monitor Firebase Console for any errors
- [ ] Verify API endpoints are responding correctly
- [ ] Check Functions logs for any issues

### Day 1
- [ ] Monitor error rates in Firebase Console
- [ ] Check performance metrics
- [ ] Verify GenAI credits usage is within expectations
- [ ] Test from different devices/browsers
- [ ] Verify SSL certificate is active (HTTPS)

### Week 1
- [ ] Review usage patterns and costs
- [ ] Set up custom domain (optional)
- [ ] Implement additional monitoring/alerts
- [ ] Configure Firebase security rules
- [ ] Plan any needed optimizations

### Month 1
- [ ] Review $1000 GenAI credit burn rate
- [ ] Analyze user behavior and feature usage
- [ ] Optimize high-cost operations
- [ ] Plan for scaling if needed
- [ ] Security audit

---

## 🔧 Troubleshooting

### Common Issues

#### Deployment fails with "Permission denied"
```bash
# Solution: Re-authenticate with Firebase
firebase logout
firebase login
```

#### Functions show 404 errors
```bash
# Check function logs
firebase functions:log --project prod

# Verify function is deployed
firebase functions:list --project prod
```

#### Build fails with "MODULE_NOT_FOUND"
```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For frontend
cd velocity-os-rebuilt
rm -rf node_modules package-lock.json
npm install
npm run build

# For backend
cd ../functions
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### App shows blank page
1. Open browser DevTools → Console
2. Check for JavaScript errors
3. Verify in Firebase Console → Hosting that deployment succeeded
4. Clear browser cache and try again
5. Check Network tab for failed requests

#### High costs / Credits burning too fast
1. Check Firebase Console → Usage and billing
2. Identify which service is consuming most credits
3. Review Functions logs for excessive calls
4. Implement rate limiting
5. Add caching for AI responses
6. Contact Firebase support if needed

---

## 📞 Support & Resources

### Documentation
- **This Guide**: PRODUCTION_DEPLOYMENT_GUIDE.md
- **Deployment Details**: DEPLOYMENT.md
- **Launch Checklist**: LAUNCH_CHECKLIST.md
- **Firebase Setup**: FIREBASE_SETUP.md

### Tools
- **Deployment Script**: `./scripts/deploy.sh`
- **Setup Script**: `./scripts/setup.sh`
- **Secret Generator**: `./scripts/generate-secrets.sh`

### External Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Getting Help
- **GitHub Issues**: https://github.com/VidDazzleLLC/velocityos/issues
- **Firebase Community**: https://firebase.google.com/community
- **Email**: support@viddazzle.com

---

## 🎯 Success Criteria

Your production deployment is successful when:

- ✅ App loads at `https://velocityos-production.web.app`
- ✅ Login page works and users can authenticate
- ✅ Dashboard displays correctly with all navigation
- ✅ API endpoints return data (check Network tab)
- ✅ No errors in browser console
- ✅ No errors in Firebase Functions logs
- ✅ SSL certificate is active (HTTPS with padlock icon)
- ✅ Usage monitoring is configured
- ✅ Billing alerts are set up

---

## 📊 Deployment Summary

| Item | Status |
|------|--------|
| PR #21 Merged | ✅ Complete |
| CI Tests | ✅ Running |
| Deployment Scripts | ✅ Ready |
| Firebase Configuration | ⚠️ Needs verification |
| Production Secrets | ⚠️ Needs setup |
| Deployment | ⏳ Ready to execute |

**Next Action**: Follow Step 1 to begin your production deployment!

---

**Last Updated**: January 26, 2026  
**Prepared by**: GitHub Copilot Coding Agent  
**Repository**: VidDazzleLLC/velocityos

---

## 🚀 Quick Reference Commands

```bash
# Login to Firebase
firebase login

# Check current project
firebase projects:list

# Deploy to production (interactive)
./scripts/deploy.sh

# Deploy to production (direct)
firebase deploy --project prod

# View production logs
firebase functions:log --project prod

# Check deployment status
firebase hosting:sites:list --project prod

# Test production API
curl https://us-central1-velocityos-production.cloudfunctions.net/api/health
```

**Ready to deploy? Start with Step 1!** 🎉
