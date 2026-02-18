# VelocityOS Launch - Quick Reference

**For Full Details:** See [NEXT_STEPS_TO_LAUNCH.md](NEXT_STEPS_TO_LAUNCH.md)

---

## 🚨 Critical Blockers (Must Fix Before Launch)

| # | Issue | Time | Status |
|---|-------|------|--------|
| 1 | **Backend API Implementation** | 3-5 days | 🔴 BLOCKER |
| 2 | **Create Firebase Projects** | 10 min | ⚠️ NOT STARTED |
| 3 | **Configure GitHub Secrets** | 5 min | ⚠️ NOT STARTED |
| 4 | **Generate Environment Secrets** | 10 min | ⚠️ NOT STARTED |

---

## ⚡ Quick Start (30 Minutes Setup)

### Step 1: Create Firebase Projects (10 min)
```bash
# Go to: https://console.firebase.google.com/
# Click "Create Project"
# Project 1: velocityos-staging
# Project 2: velocityos-production
# Enable Blaze (pay-as-you-go) plan on both
```

### Step 2: Update Configuration (2 min)
```bash
# Edit .firebaserc with your actual project IDs
vim .firebaserc
```

### Step 3: Generate Secrets (5 min)
```bash
# Generate JWT and SESSION secrets
./scripts/generate-secrets.sh

# Create .env file
cp .env.example .env

# Update .env with generated secrets (from script output)
vim .env
```

### Step 4: Login to Firebase (2 min)
```bash
# Authenticate with Firebase
firebase login

# Verify you're logged in
firebase projects:list
```

### Step 5: Configure Firebase Secrets (5 min)
```bash
# Set secrets for staging
firebase functions:secrets:set JWT_SECRET --project default
# Paste JWT_SECRET from step 3

firebase functions:secrets:set SESSION_SECRET --project default
# Paste SESSION_SECRET from step 3

# Repeat for production
firebase functions:secrets:set JWT_SECRET --project production
firebase functions:secrets:set SESSION_SECRET --project production
```

### Step 6: Configure GitHub CI/CD (5 min)
```bash
# Generate Firebase token for GitHub Actions
firebase login:ci

# Copy the token, then:
# 1. Go to: https://github.com/VidDazzleLLC/velocityos/settings/secrets/actions
# 2. Click "New repository secret"
# 3. Name: FIREBASE_TOKEN
# 4. Value: (paste token from above)
# 5. Click "Add secret"
```

### Step 7: Deploy to Staging (5 min)
```bash
# Install all dependencies
npm install
cd velocity-os-rebuilt && npm install && cd ..
cd functions && npm install && cd ..

# Deploy to staging
./scripts/deploy.sh
# Select: 1 (staging)
# Select: 1 (deploy everything)

# Wait for deployment to complete...
```

### Step 8: Verify Deployment (1 min)
```bash
# Run verification script
./scripts/verify-deployment.sh

# Or manually visit:
# https://[your-project-id].web.app
```

---

## 🎯 Two Launch Paths

### Path 1: Minimal Viable Launch (2 Days)
**What you get:**
- ✅ Working frontend
- ✅ Mock backend (static data)
- ✅ Demo-ready
- ⚠️ No real data persistence
- ⚠️ Limited functionality

**Timeline:**
- Day 1: Setup + Mock APIs (8 hours)
- Day 2: Testing + Deploy (4 hours)

**Best for:** Demos, proof of concept, investor pitches

---

### Path 2: Full Production Launch (2-3 Weeks)
**What you get:**
- ✅ Working frontend
- ✅ Full backend APIs
- ✅ Real data in Firestore
- ✅ Complete testing
- ✅ Production-ready

**Timeline:**
- Week 1: Setup + API development
- Week 2: Testing + security
- Week 3: Production deployment

**Best for:** Real users, production use, sustainable growth

---

## 📋 Critical Tasks Checklist

### Infrastructure Setup (30 min - DO FIRST)
- [ ] Create Firebase staging project
- [ ] Create Firebase production project
- [ ] Enable Hosting, Functions, Firestore, Auth on both
- [ ] Update `.firebaserc` with project IDs
- [ ] Generate JWT_SECRET and SESSION_SECRET
- [ ] Create `.env` file
- [ ] Configure Firebase Functions secrets
- [ ] Set FIREBASE_TOKEN in GitHub

### Backend Development (3-5 days - REQUIRED)
- [ ] Implement customer CRUD endpoints
- [ ] Implement campaign CRUD endpoints
- [ ] Implement metrics/insights endpoints
- [ ] Add input validation
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Test with Firestore

### Testing & Security (2-3 days)
- [ ] Complete E2E tests (unskip all)
- [ ] Add unit tests (60%+ coverage)
- [ ] Review Firestore security rules
- [ ] Security audit
- [ ] Performance testing (Lighthouse)
- [ ] Cross-browser testing

### Production Deployment (1 day)
- [ ] Deploy to staging
- [ ] Full staging testing
- [ ] Deploy to production
- [ ] Post-deployment verification
- [ ] Monitor for 24-48 hours

---

## 🔥 Most Common Commands

```bash
# Local development
npm run dev                    # Start dev server (http://localhost:3000)

# Testing
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Run E2E tests with UI

# Building
cd velocity-os-rebuilt && npm run build && cd ..   # Build frontend
cd functions && npm run build && cd ..             # Build backend

# Firebase
firebase login                 # Authenticate
firebase projects:list         # List your projects
firebase use default           # Switch to staging
firebase use production        # Switch to production
firebase deploy               # Deploy everything
firebase deploy --only hosting    # Deploy only frontend
firebase deploy --only functions  # Deploy only backend

# Scripts
./scripts/firebase-setup-wizard.sh   # Interactive setup
./scripts/deploy.sh                  # Interactive deployment
./scripts/verify-deployment.sh       # Health check
./scripts/generate-secrets.sh        # Generate JWT/SESSION secrets
```

---

## ⚠️ Common Issues & Fixes

### Issue: `firebase deploy` fails
```bash
# Check you're logged in
firebase login

# Verify project exists
firebase projects:list

# Check .firebaserc has correct project IDs
cat .firebaserc

# Ensure Blaze plan enabled (required for Functions)
# Go to: https://console.firebase.google.com/project/[project-id]/usage
```

### Issue: Functions won't deploy
```bash
# Ensure functions are built
cd functions && npm run build && cd ..

# Check lib/ directory exists
ls -la functions/lib/

# Verify Node version (needs 18)
node --version

# Check Firebase has Blaze plan enabled
```

### Issue: E2E tests fail
```bash
# Ensure server is running
npm run dev

# Check server is accessible
curl http://localhost:3000

# Run tests in debug mode
npm run test:e2e:debug
```

### Issue: GitHub Actions fail
```bash
# Verify FIREBASE_TOKEN is set
# Go to: https://github.com/VidDazzleLLC/velocityos/settings/secrets/actions

# If not set:
firebase login:ci
# Copy token and add to GitHub Secrets
```

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Ready | Next.js 14, builds successfully |
| Backend | 🔴 Incomplete | Only stub endpoints |
| E2E Tests | 🟡 Partial | Core flows work, integrations skipped |
| CI/CD | 🟡 Ready | Missing FIREBASE_TOKEN |
| Firebase | ⚠️ Not Setup | Projects need to be created |
| Documentation | ✅ Excellent | 8+ comprehensive guides |
| Automation | ✅ Ready | Setup wizard, deploy scripts |

**Overall:** 🟡 **90% Ready - Backend is Critical Blocker**

---

## 📚 Full Documentation

- **[NEXT_STEPS_TO_LAUNCH.md](NEXT_STEPS_TO_LAUNCH.md)** ⭐ Complete launch guide (THIS IS THE MAIN DOCUMENT)
- **[README.md](README.md)** - Project overview
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** - Pre-launch verification
- **[LAUNCH_STATUS.md](LAUNCH_STATUS.md)** - Detailed status report
- **[FIREBASE_DEPLOYMENT_COMPLETE.md](FIREBASE_DEPLOYMENT_COMPLETE.md)** - Firebase setup
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - GitHub configuration
- **[MANUAL_TASKS.md](MANUAL_TASKS.md)** - Required manual steps
- **[e2e/README.md](e2e/README.md)** - E2E testing
- **[scripts/README.md](scripts/README.md)** - Automation scripts

---

## 🎯 Next Actions (In Order)

1. **TODAY:** Complete 30-minute setup (see above)
2. **THIS WEEK:** Decide on launch path (MVP vs Full)
3. **THIS WEEK:** Start backend development (if Full path)
4. **NEXT WEEK:** Testing & security
5. **NEXT WEEK:** Production deployment

---

## 💡 Quick Tips

- ✅ **Use the setup wizard:** `./scripts/firebase-setup-wizard.sh`
- ✅ **Deploy to staging first:** Always test before production
- ✅ **Run verification:** `./scripts/verify-deployment.sh` after every deploy
- ✅ **Monitor Firebase Console:** Check for errors after deployment
- ⚠️ **Never commit `.env`:** It contains secrets
- ⚠️ **Never force push:** GitHub Actions deploys from history
- 💰 **Watch your billing:** Enable alerts in Firebase Console

---

**Last Updated:** January 26, 2026  
**For Questions:** See full documentation or create GitHub issue
