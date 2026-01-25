# Firebase Token Setup - Quick Start Guide

## 🎯 The Short Version

**The `FIREBASE_TOKEN` only needs to be set up ONCE per repository.**

### Already Set Up?

Check if you've already configured it:
1. Go to your GitHub repository
2. Click: **Settings → Secrets and variables → Actions**
3. Look for `FIREBASE_TOKEN` in the list

✅ **If you see it listed**: You're done! No need to do anything else.  
❌ **If it's not there**: Follow the setup instructions below.

---

## 📖 First-Time Setup

If you've never set up the Firebase token before, follow these steps:

### Step 1: Generate the Token

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login and generate CI token
firebase login:ci
```

This will:
- Open your browser for Firebase authentication
- Generate a token
- Display it in your terminal (looks like: `1//0abc...xyz`)

**Important**: Copy this token immediately - you can't retrieve it again!

### Step 2: Add to GitHub

1. Go to your GitHub repository: https://github.com/VidDazzleLLC/velocityos
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token you just copied
6. Click **"Add secret"**

### Step 3: Verify

✅ You should see `FIREBASE_TOKEN` listed under "Repository secrets"

---

## 🔄 When to Update the Token

You only need to regenerate/update the token if:

- ❗ The token expires (rare)
- 🔒 The token is compromised (security incident)
- 🚨 You see authentication errors in deployments

For security incidents or token rotation, see: [SECURITY_REMEDIATION.md](./SECURITY_REMEDIATION.md)

---

## ❓ Common Questions

### Q: Do I need to add this token multiple times?
**A**: No! It's a one-time setup per repository.

### Q: Why do multiple documentation files mention the Firebase token?
**A**: Different docs reference the token for different purposes (deployment, security, troubleshooting), but the actual setup only needs to be done once. All docs now point to [MANUAL_TASKS.md](./MANUAL_TASKS.md#firebase_token-secret-configuration) for setup instructions.

### Q: Is this token the same for staging and production?
**A**: Yes! The `FIREBASE_TOKEN` is a repository-level secret that works for all Firebase projects configured in your `.firebaserc` file.

### Q: What if I see deployment errors?
**A**: First, verify the token exists in GitHub Secrets (Settings → Secrets → Actions). If it exists but deployments fail, you may need to regenerate it - see [SECURITY_REMEDIATION.md](./SECURITY_REMEDIATION.md).

---

## 📚 For More Details

- **Setup Instructions**: [MANUAL_TASKS.md](./MANUAL_TASKS.md#firebase_token-secret-configuration)
- **Security & Rotation**: [SECURITY_REMEDIATION.md](./SECURITY_REMEDIATION.md)
- **Deployment Guide**: [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)
- **Quick Commands**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

**Last Updated**: 2026-01-25
