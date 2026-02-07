# 🚀 VelocityOS Quick Launch Guide

**Last Updated**: 2026-01-26  
**Time to Production**: ~20 minutes

This guide walks you through launching VelocityOS to production in the fastest way possible.

---

## 📋 Pre-Launch Status

✅ **Application Code**: Complete and tested  
✅ **Documentation**: Comprehensive guides available  
✅ **Automation Scripts**: Ready to use  
✅ **CI/CD Pipeline**: Configured and ready  
⚠️ **Firebase Projects**: Need to be created  
⚠️ **GitHub Secrets**: Need to be configured  

---

## 🎯 Quick Start (3 Steps)

### Step 1: Create Firebase Projects (5 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/

2. **Create Staging Project**:
   - Click "Add project" or "Create a project"
   - Project name: `velocityos-staging`
   - Click "Continue"
   - Disable Google Analytics (or configure if desired)
   - Click "Create project"
   - Wait for project creation to complete

3. **Create Production Project**:
   - Click "Add project" again
   - Project name: `velocityos-production`
   - Click "Continue"
   - Disable Google Analytics (or configure if desired)
   - Click "Create project"
   - Wait for project creation to complete

4. **Enable Firebase Services** (for both projects):
   - Click on your project
   - Go to **Build** → **Authentication** → Click "Get started"
   - Enable **Email/Password** authentication
   - Go to **Build** → **Firestore Database** → Click "Create database"
   - Select "Production mode" → Choose your region (e.g., us-central1) → Enable
   - Go to **Build** → **Hosting** → Click "Get started" → Complete setup
   - Go to **Build** → **Functions** → Click "Get started" → Complete setup
   - Enable billing (required for Cloud Functions)

5. **Get Project IDs**:
   - In Firebase Console, click the gear icon → Project settings
   - Copy the **Project ID** (e.g., `velocityos-staging-abc123`)
   - Repeat for production project

---

### Step 2: Update Configuration (2 minutes)

1. **Update `.firebaserc`**:
   ```bash
   cd /path/to/velocityos
   # Edit .firebaserc and replace placeholder IDs with your actual project IDs
   ```

   Edit the file to look like:
   ```json
   {
     "projects": {
       "default": "velocityos-staging-abc123",
       "prod": "velocityos-production-xyz789"
     }
   }
   ```

2. **Create `.env` file** (optional, for local development):
   ```bash
   cp .env.example .env
   # Edit .env and add your Firebase configuration from Firebase Console
   ```

---

### Step 3: Configure GitHub Secrets (3 minutes)

1. **Generate Firebase CI Token**:
   ```bash
   # Login to Firebase CLI
   firebase login:ci
   
   # Copy the token that appears (format: 1//0abcd...)
   ```

2. **Add Token to GitHub**:
   - Go to: https://github.com/VidDazzleLLC/velocityos
   - Click **Settings** tab
   - Click **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **Add secret**

3. **Verify Secret**:
   - You should see `FIREBASE_TOKEN` listed under "Repository secrets"
   - ✅ Configuration complete!

---

## 🎉 Deploy to Staging

### Option A: Automated Deployment (Recommended)

**Push to main branch** to trigger automatic deployment:

```bash
git add .
git commit -m "Configure Firebase projects for staging and production"
git push origin main
```

GitHub Actions will automatically:
- Build the frontend
- Build the backend
- Deploy to Firebase Hosting
- Deploy to Firebase Functions

**Monitor deployment**:
- Go to: https://github.com/VidDazzleLLC/velocityos/actions
- Watch the "Deploy to Firebase" workflow

---

### Option B: Manual Deployment

```bash
# Make sure you're in the project root
cd /path/to/velocityos

# Install dependencies (if not already done)
npm install
cd velocity-os-rebuilt && npm install && cd ..
cd functions && npm install && cd ..

# Build the application
cd velocity-os-rebuilt
npm run build
cd ..

# Deploy to staging
firebase use default  # Select staging project
firebase deploy

# Or use the deployment script
./scripts/deploy.sh
```

---

## ✅ Verify Staging Deployment

1. **Get your staging URL**:
   - After deployment completes, you'll see: `Hosting URL: https://velocityos-staging-abc123.web.app`

2. **Test your application**:
   - Open the URL in a browser
   - Verify the homepage loads
   - Navigate to `/login` page
   - Check browser console for errors
   - Test API endpoints: `https://your-url.web.app/api/health`

3. **Check Firebase Console**:
   - Go to **Hosting** → Verify deployment is live
   - Go to **Functions** → Verify functions are deployed
   - Check logs for any errors

---

## 🚀 Deploy to Production

**When staging is verified and ready**:

### Option A: Via GitHub Actions (Recommended)

1. Create a release in GitHub
2. Tag it with a version (e.g., `v1.0.0`)
3. This will trigger automatic production deployment

Or manually trigger:
- Go to **Actions** tab
- Select "Deploy to Production" workflow
- Click "Run workflow"

---

### Option B: Manual Production Deployment

```bash
# Switch to production project
firebase use prod

# Deploy
firebase deploy

# Or use the deployment script and select production
./scripts/deploy.sh
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✅ Store secrets in `.env` files (gitignored)
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use `firebase functions:secrets:set` for Cloud Functions secrets
- ✅ Keep `.gitignore` up to date
- ✅ Review code before committing
- ✅ Use pre-commit hooks (`pre-commit install`)

### ❌ DON'T:
- ❌ Commit `.env` files
- ❌ Hardcode API keys in code
- ❌ Commit Firebase service account JSON files
- ❌ Share Firebase CI tokens publicly
- ❌ Commit `node_modules/` or build artifacts

---

## 🔧 Configure Cloud Functions Secrets

After deployment, set required secrets:

```bash
# Switch to your project
firebase use default  # or prod

# Set JWT secret
firebase functions:secrets:set JWT_SECRET
# Paste a secure random string (generate with: openssl rand -base64 32)

# Set Session secret
firebase functions:secrets:set SESSION_SECRET
# Paste a secure random string (generate with: openssl rand -base64 32)

# Optional: Set AI API keys
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set ANTHROPIC_API_KEY

# Redeploy functions to use the new secrets
firebase deploy --only functions
```

---

## 📊 Post-Deployment Monitoring

### Day 1 Checklist:
- [ ] Verify all pages load correctly
- [ ] Test user authentication flow
- [ ] Check Firebase Console for errors
- [ ] Monitor function execution logs
- [ ] Test API endpoints
- [ ] Verify Firestore data persistence
- [ ] Check performance metrics

### Monitoring Tools:
- **Firebase Console**: https://console.firebase.google.com/
  - Hosting metrics
  - Function logs and usage
  - Firestore usage
  - Authentication activity

- **GitHub Actions**: https://github.com/VidDazzleLLC/velocityos/actions
  - Deployment status
  - Build logs
  - CI/CD pipeline health

---

## 🆘 Troubleshooting

### Deployment Fails

**Error: "Firebase token is invalid"**
```bash
# Generate a new token
firebase login:ci

# Update GitHub Secret with new token
# Go to: Settings → Secrets → Actions → Update FIREBASE_TOKEN
```

**Error: "Billing account required"**
- Firebase Cloud Functions require a billing account
- Go to Firebase Console → Settings → Usage and billing
- Set up a billing account (free tier available)

**Error: "Permission denied"**
```bash
# Make sure you're logged in
firebase login

# Verify you have access to the project
firebase projects:list

# Switch to the correct project
firebase use default  # or prod
```

### Build Fails

**Frontend build errors**:
```bash
cd velocity-os-rebuilt
npm install  # Reinstall dependencies
npm run build  # Try building again
npm run lint  # Check for linting errors
```

**Backend build errors**:
```bash
cd functions
npm install  # Reinstall dependencies
npm run build  # Try building again
npm run lint  # Check for linting errors
```

### Application Not Loading

1. **Check Firebase Hosting**:
   - Go to Firebase Console → Hosting
   - Verify deployment is listed
   - Check deployment status

2. **Check Functions**:
   - Go to Firebase Console → Functions
   - Verify functions are deployed
   - Check function logs for errors

3. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

---

## 📚 Additional Resources

- **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)**: Complete launch checklist
- **[FIREBASE_DEPLOYMENT_COMPLETE.md](./FIREBASE_DEPLOYMENT_COMPLETE.md)**: Detailed Firebase guide
- **[SECURITY_REMEDIATION.md](./SECURITY_REMEDIATION.md)**: Security best practices
- **[MANUAL_TASKS.md](./MANUAL_TASKS.md)**: Manual configuration steps
- **[scripts/README.md](./scripts/README.md)**: Automation scripts documentation

---

## 📞 Support

- **Documentation**: Check the docs above
- **GitHub Issues**: https://github.com/VidDazzleLLC/velocityos/issues
- **Firebase Support**: https://firebase.google.com/support
- **Email**: connect@viddazzle.com

---

## ✅ Success Criteria

You're ready for production when:

- ✅ Both Firebase projects created (staging + production)
- ✅ `.firebaserc` updated with actual project IDs
- ✅ `FIREBASE_TOKEN` GitHub secret configured
- ✅ Staging deployment successful
- ✅ Staging application tested and working
- ✅ Cloud Functions secrets configured
- ✅ Production deployment successful
- ✅ Production application tested and working
- ✅ Monitoring and alerts configured
- ✅ Team trained on deployment process

---

**🎉 Congratulations! VelocityOS is now live!** 🚀
