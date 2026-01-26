# VelocityOS Production Deployment - Quick Start

**⚡ Fast Track Guide** | Time: ~30 minutes | Difficulty: Easy

---

## ✅ Pre-Flight Check (2 minutes)

Run these commands to verify you're ready:

```bash
# 1. Check Node.js version (need 18+)
node --version

# 2. Check Firebase CLI installed
firebase --version

# 3. If not installed:
npm install -g firebase-tools

# 4. Login to Firebase
firebase login

# 5. Verify your production project exists
firebase projects:list
# Look for your production project ID (e.g., velocityos-production, velocityos-prod, etc.)
# Note: The exact name may vary - use whatever project ID you created in Firebase Console
```

✅ **If all checks pass, continue to deployment!**

---

## 🚀 30-Minute Production Deployment

### Step 1: Setup Secrets (10 min)

```bash
# Generate secure secrets
./scripts/generate-secrets.sh

# Copy the output, then set them in Firebase:
# Note: 'prod' is an alias from .firebaserc that points to your production project
firebase functions:secrets:set JWT_SECRET --project prod
# Paste JWT_SECRET when prompted

firebase functions:secrets:set SESSION_SECRET --project prod
# Paste SESSION_SECRET when prompted

# (Optional) Add your Gemini API key for AI features:
firebase functions:secrets:set GEMINI_API_KEY --project prod
# Paste your API key from https://makersuite.google.com/app/apikey
```

### Step 2: Build Everything (5 min)

```bash
# Build frontend
cd velocity-os-rebuilt
npm install
npm run build
cd ..

# Build backend
cd functions
npm install
npm run build
cd ..
```

**Expected**: Both builds complete with ✓ success messages.

### Step 3: Deploy to Production (10 min)

```bash
# Interactive deployment (recommended)
./scripts/deploy.sh

# Select:
# 1. Type "2" for Production
# 2. Type "yes" to confirm
# 3. Type "1" for Everything
# 4. Type "y" to proceed
```

**Watch for**: ✅ Deployment successful!

**Your app will be live at**: `https://velocityos-production.web.app`

### Step 4: Verify Deployment (5 min)

```bash
# Test the production URL
curl https://velocityos-production.web.app

# Test the API health endpoint
curl https://us-central1-velocityos-production.cloudfunctions.net/api/health
# Expected: {"status":"ok"}

# Check function logs
firebase functions:log --project prod --limit 20
```

**Manual verification**:
1. Open `https://velocityos-production.web.app` in browser
2. Navigate to `/login` - should load without errors
3. Navigate to `/dashboard` - should load
4. Open DevTools Console - should be no errors

✅ **If app loads successfully, you're done!**

---

## 📊 Monitor Your $1000 GenAI Credits

### Set Up Billing Alerts (5 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `velocityos-production`
3. Click ⚙️ → **Project settings** → **Usage and billing**
4. Click **Manage billing** → **Budgets & alerts**
5. Create alerts:
   - $250 (25%) - Warning
   - $500 (50%) - Review
   - $750 (75%) - Optimize
   - $900 (90%) - Critical

### Daily Usage Check

```bash
# Quick usage check
firebase use prod
firebase projects:info

# View recent function calls
firebase functions:log --project prod --limit 50
```

**In Firebase Console**:
- Go to **Usage and billing** tab
- Monitor:
  - Cloud Functions invocations
  - Firestore operations
  - GenAI API calls

---

## 🔄 CI/CD Setup (Optional, 10 min)

Enable automatic deployments from GitHub:

```bash
# 1. Generate CI token
firebase login:ci
# Copy the token that's printed

# 2. Add to GitHub
# Go to: https://github.com/VidDazzleLLC/velocityos/settings/secrets/actions
# Click: New repository secret
# Name: FIREBASE_TOKEN
# Value: Paste the token
# Click: Add secret
```

✅ **Now pushes to `main` will auto-deploy to staging!**

For production, manually trigger deployments:
1. Go to: **Actions** tab in GitHub
2. Select: **Deploy Hosting** or **Deploy Functions**
3. Click: **Run workflow** → Select `main` → **Run workflow**

---

## 🆘 Quick Troubleshooting

### App doesn't load
```bash
# Check hosting deployment
firebase hosting:sites:list --project prod

# Verify build output exists
ls -la velocity-os-rebuilt/out/index.html

# Redeploy
firebase deploy --only hosting --project prod
```

### Functions return 404
```bash
# Check if functions deployed
firebase functions:list --project prod

# Check function logs
firebase functions:log --project prod

# Redeploy functions
firebase deploy --only functions --project prod
```

### Permission denied
```bash
# Re-authenticate
firebase logout
firebase login
firebase projects:list
```

### Build fails
```bash
# Clean and rebuild frontend
cd velocity-os-rebuilt
rm -rf node_modules package-lock.json .next
npm install
npm run build

# Clean and rebuild backend
cd ../functions
rm -rf node_modules package-lock.json lib
npm install
npm run build
```

---

## 📞 Need Help?

- **Full Guide**: See `PRODUCTION_DEPLOYMENT_GUIDE.md`
- **Deployment Details**: See `DEPLOYMENT.md`
- **Scripts Help**: See `scripts/README.md`
- **Firebase Docs**: https://firebase.google.com/docs
- **GitHub Issues**: https://github.com/VidDazzleLLC/velocityos/issues

---

## ✨ Post-Deployment Checklist

After deployment, verify:

- [ ] App loads at production URL
- [ ] Login page works
- [ ] Dashboard accessible
- [ ] No browser console errors
- [ ] API returns data
- [ ] Function logs show no errors
- [ ] Billing alerts configured
- [ ] SSL certificate active (HTTPS)

---

## 🎯 Next Steps After Launch

1. **Set up custom domain** (optional)
   ```bash
   # In Firebase Console: Hosting → Add custom domain
   ```

2. **Monitor usage** (daily for first week)
   - Check Firebase Console → Usage and billing
   - Watch for unusual spikes

3. **Optimize costs**
   - Implement caching for AI responses
   - Add rate limiting
   - Monitor expensive operations

4. **Security**
   - Configure Firestore security rules
   - Enable Firebase App Check
   - Review authentication settings

---

## 📊 Deployment Commands Cheat Sheet

```bash
# Login
firebase login

# Select production
firebase use prod

# Deploy everything
firebase deploy --project prod

# Deploy hosting only
firebase deploy --only hosting --project prod

# Deploy functions only
firebase deploy --only functions --project prod

# View logs
firebase functions:log --project prod

# List functions
firebase functions:list --project prod

# Check hosting
firebase hosting:sites:list --project prod

# Interactive deploy (recommended)
./scripts/deploy.sh
```

---

**🚀 Ready to deploy? Run `./scripts/deploy.sh` and select Production!**

---

**Last Updated**: January 26, 2026  
**Status**: ✅ Ready for Production Deployment
