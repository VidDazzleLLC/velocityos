# VelocityOS - Frequently Asked Questions (FAQ)

This document answers common questions about setting up, deploying, and managing VelocityOS.

## Table of Contents

- [Deployment & Firebase](#deployment--firebase)
- [GitHub Actions & CI/CD](#github-actions--cicd)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Deployment & Firebase

### How do I generate a Firebase CI token for GitHub Actions deployment?

**Answer:** To enable GitHub Actions to deploy to Firebase, you need to generate a Firebase CI token. Here's how:

#### Step 1: Run the Command

**On your local machine** (not on GitHub or in the cloud), open your terminal and run:

```bash
firebase login:ci
```

**Where to run it:**
- ✅ On your local development machine (macOS, Linux, Windows)
- ✅ In your terminal/command prompt/PowerShell
- ❌ Not in GitHub Actions (that's what the token is for)
- ❌ Not in a cloud environment

#### Step 2: Complete Authentication

The command will:
1. Open your default web browser
2. Ask you to sign in with your Google account
3. Request permission for Firebase CLI to access your account
4. Click **"Allow"** to grant access

#### Step 3: Copy the Token

After authentication, the terminal will display a message like:

```
✔  Success! Use this token to login on a CI server:

1//0gABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz
```

**Copy the entire token** (it's usually a long string starting with `1//0`)

#### Step 4: Add to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/VidDazzleLLC/velocityos`
2. Click **Settings** tab (top navigation)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click the **New repository secret** button
5. Fill in:
   - **Name**: `FIREBASE_TOKEN`
   - **Secret**: Paste the token you copied in Step 3
6. Click **Add secret**

#### Step 5: Verify

Your GitHub Actions workflows will now be able to deploy to Firebase. Push a change to the `main` branch to test.

**Related Documentation:**
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md#critical-configure-firebase_token-secret-required-for-deployment) - Detailed Firebase setup
- [GITHUB_SETUP.md](GITHUB_SETUP.md#step-1-generate-firebase-ci-token) - GitHub configuration guide

---

### Do I need the Firebase CLI installed to generate the token?

**Yes.** You must have the Firebase CLI installed on your local machine to run `firebase login:ci`.

**To install Firebase CLI:**

```bash
npm install -g firebase-tools
```

**Verify installation:**

```bash
firebase --version
```

You should see version 13.x.x or higher.

**Need more help?** See our [Firebase Setup Guide](FIREBASE_DEPLOYMENT_COMPLETE.md#step-1-install-firebase-cli)

---

### Where exactly should I run `firebase login:ci`?

**Run it in your local terminal/command prompt on your development machine.**

**Examples:**

**macOS/Linux:**
```bash
# Open Terminal app
cd ~/projects/velocityos  # or wherever you cloned the repo
firebase login:ci
```

**Windows (PowerShell):**
```powershell
# Open PowerShell
cd C:\Users\YourName\projects\velocityos
firebase login:ci
```

**Windows (Command Prompt):**
```cmd
# Open Command Prompt
cd C:\Users\YourName\projects\velocityos
firebase login:ci
```

**Important:** You do NOT need to run this from within the VelocityOS repository directory. You can run it from anywhere on your local machine, as long as:
1. Firebase CLI is installed
2. You have a Google account with access to your Firebase projects

---

### Can I use the same token for both staging and production?

**Yes, absolutely!** The Firebase CI token authenticates you with Firebase, and you can use the same token to deploy to multiple projects (staging and production).

However, for **enhanced security**, you can:
1. Generate separate tokens for staging and production
2. Use GitHub Environments to store environment-specific tokens
3. Limit permissions on each token

**For most users, one token is sufficient.**

---

### How long does the Firebase CI token last?

Firebase CI tokens are **long-lived refresh tokens** that do not expire automatically. However, they can be invalidated if:

- You revoke access in your Google Account settings
- You run `firebase logout` followed by `firebase login` (generates a new token)
- Google security systems detect suspicious activity

**Best Practice:** Rotate (regenerate) tokens every 90 days for security.

---

### How do I rotate/regenerate the Firebase token?

To generate a new token:

1. Run `firebase login:ci` again on your local machine
2. Copy the new token
3. Update the `FIREBASE_TOKEN` secret in GitHub:
   - Settings → Secrets and variables → Actions
   - Click on `FIREBASE_TOKEN`
   - Click **Update secret**
   - Paste the new token
   - Click **Update secret**

The old token will be invalidated after you update GitHub.

---

## GitHub Actions & CI/CD

### Why does my deployment fail with "Failed to authenticate"?

**Most Common Cause:** The `FIREBASE_TOKEN` secret is not set in GitHub.

**Solution:** Follow the steps in ["How do I generate a Firebase CI token?"](#how-do-i-generate-a-firebase-ci-token-for-github-actions-deployment) above.

**Other Possible Causes:**
- Token was revoked or expired
- Secret name is misspelled (must be exactly `FIREBASE_TOKEN`)
- Secret is set in an environment instead of repository-level

---

### Do I need to configure anything else for GitHub Actions to work?

For basic deployments, you only need:
1. ✅ `FIREBASE_TOKEN` secret (see above)
2. ✅ Firebase project IDs in `.firebaserc`

**Optional but recommended:**
- GitHub Environments for staging and production
- Branch protection rules
- Required reviewers for production

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for complete GitHub configuration.

---

### How do I trigger a deployment to staging?

**Automatic:** Deployments to staging happen automatically when you push to the `main` branch.

```bash
git push origin main
```

**Manual:** You can also deploy manually from your local machine:

```bash
./scripts/deploy.sh
# Select option 1 (staging)
```

---

### How do I trigger a deployment to production?

**From GitHub:**
1. Go to **Actions** tab
2. Click **Deploy to Production** workflow
3. Click **Run workflow** button
4. Type `DEPLOY` in the confirmation field
5. Click **Run workflow**

**From your local machine:**

```bash
./scripts/deploy.sh
# Select option 2 (production)
# Confirm with "yes"
```

---

## Development

### How do I run VelocityOS locally?

**Quick Start:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

**For detailed development instructions**, see [README.md](README.md#local-development)

---

### How do I run the tests?

**End-to-End Tests (Playwright):**

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (watch mode)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

**Unit Tests:**

```bash
# Frontend tests
cd velocity-os-rebuilt
npm test

# Backend tests
cd functions
npm test
```

See [e2e/README.md](e2e/README.md) for comprehensive testing documentation.

---

### What are the different package.json files for?

VelocityOS has a **multi-package structure**:

1. **Root `package.json`**: 
   - Express server for local development
   - E2E tests (Playwright)
   - Top-level scripts

2. **`velocity-os-rebuilt/package.json`**:
   - Next.js 14 frontend
   - React components
   - Static site generation

3. **`functions/package.json`**:
   - Firebase Cloud Functions
   - Express API backend
   - Requires Node.js 18+

**To install all dependencies:**

```bash
# Root
npm install

# Frontend
cd velocity-os-rebuilt && npm install

# Backend
cd ../functions && npm install
```

---

## Troubleshooting

### I see "FIREBASE_TOKEN not found" in my workflow logs

**Cause:** The secret is not set in GitHub.

**Solution:** See ["How do I generate a Firebase CI token?"](#how-do-i-generate-a-firebase-ci-token-for-github-actions-deployment)

**Important:** The secret must be:
- Named exactly `FIREBASE_TOKEN` (case-sensitive)
- Set at the **repository level** (not environment level)
- Contains a valid token from `firebase login:ci`

---

### My local deployment works, but GitHub Actions deployment fails

**Common Causes:**

1. **Missing `FIREBASE_TOKEN` secret**: See above
2. **Project IDs don't match**: Verify `.firebaserc` has correct project IDs
3. **Build artifacts not committed**: Make sure builds run in the workflow
4. **Firebase project permissions**: Ensure your Google account has Owner/Editor role

**Debug Steps:**

1. Check workflow logs in GitHub Actions tab
2. Verify `FIREBASE_TOKEN` is set
3. Check `.firebaserc` project IDs
4. Try deploying manually: `./scripts/deploy.sh`

---

### How do I get more detailed deployment logs?

**In GitHub Actions:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Click on the job name
4. Expand each step to see detailed logs

**Locally:**

```bash
# Enable debug mode
firebase --debug deploy

# Or use deploy script with verbose logging
DEBUG=* ./scripts/deploy.sh
```

---

### Firebase CLI not found / command not recognized

**Cause:** Firebase CLI is not installed or not in your PATH.

**Solution:**

```bash
# Install globally
npm install -g firebase-tools

# Verify
firebase --version
```

**Still not working?**
- Restart your terminal
- Check if npm global bin is in your PATH
- On Windows, run terminal as Administrator

---

### Browser doesn't open when I run `firebase login:ci`

**Solution 1:** Copy and paste the URL from your terminal into a browser manually.

**Solution 2:** Use the `--no-localhost` flag:

```bash
firebase login:ci --no-localhost
```

This is useful if you're on a remote server or headless environment.

---

## Need More Help?

### Documentation

- [README.md](README.md) - Quick start and overview
- [FIREBASE_DEPLOYMENT_COMPLETE.md](FIREBASE_DEPLOYMENT_COMPLETE.md) - Complete Firebase deployment guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment overview
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - GitHub Actions setup
- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) - Pre-launch checklist
- [scripts/README.md](scripts/README.md) - Available scripts and utilities

### Interactive Setup

Run the setup wizard for guided configuration:

```bash
./scripts/firebase-setup-wizard.sh
```

### Support

If you're still stuck:
1. Check [GitHub Issues](https://github.com/VidDazzleLLC/velocityos/issues) for similar problems
2. Create a new issue with:
   - Clear description of the problem
   - Steps you've already tried
   - Relevant error messages or logs
   - Your environment (OS, Node version, etc.)

---

**Last Updated:** January 2026
