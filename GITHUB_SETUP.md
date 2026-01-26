# GitHub Configuration Guide for VelocityOS

This guide helps you configure GitHub repository settings for automated deployments.

## Table of Contents

1. [GitHub Secrets Configuration](#github-secrets-configuration)
2. [GitHub Environments Setup](#github-environments-setup)
3. [Branch Protection Rules](#branch-protection-rules)
4. [Workflow Permissions](#workflow-permissions)

---

## GitHub Secrets Configuration

GitHub Secrets are encrypted environment variables used in GitHub Actions workflows.

### Required Repository Secret

You need to add Firebase authentication credentials to enable automated deployments. VelocityOS workflows support two authentication methods:

#### Option 1: Service Account Key (Recommended)

**⭐ This is the modern, recommended approach** that works with all current and future versions of Firebase CLI.

##### Step 1: Create Service Account in Firebase/Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Set a name (e.g., "GitHub Actions Deploy")
6. Click **Create and Continue**
7. Grant these roles:
   - **Firebase Admin** (or more specific roles like Firebase Hosting Admin, Cloud Functions Developer)
8. Click **Continue** and then **Done**

##### Step 2: Generate JSON Key

1. Find your newly created service account in the list
2. Click the three dots (⋮) → **Manage keys**
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. The JSON key file will be downloaded to your computer

##### Step 3: Add to GitHub Repository

1. Go to your GitHub repository: `https://github.com/VidDazzleLLC/velocityos`
2. Click on **Settings** tab (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Configure the secret:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Secret**: Open the downloaded JSON file and copy its entire contents
6. Click **Add secret**

✅ The service account is now configured!

---

#### Option 2: Firebase Token (Legacy)

**⚠️ Note:** This method is deprecated in Firebase CLI v11+ but still supported for backward compatibility. Use Option 1 (Service Account) for new setups.

##### Step 1: Generate Firebase CI Token

On your local machine, run:

```bash
firebase login:ci
```

This will:
1. Open your browser for authentication
2. Generate a CI token
3. Display the token in your terminal

**Example output:**
```
Waiting for authentication...

✔  Success! Use this token to login on a CI server:

1//0gABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnop
```

**Copy this token** - you'll need it for the next step.

##### Step 2: Add Token to GitHub Repository

1. Go to your GitHub repository: `https://github.com/VidDazzleLLC/velocityos`
2. Click on **Settings** tab (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Configure the secret:
   - **Name**: `FIREBASE_TOKEN`
   - **Secret**: Paste the token from Step 1
6. Click **Add secret**

✅ The token is now configured and will be available to all workflows.

---

### Which Method to Use?

- **New deployments**: Use **Option 1 (Service Account)** - it's more secure and future-proof
- **Existing deployments**: Either update to Option 1, or continue using Option 2 (Firebase Token)
- **Both can coexist**: The workflows will prefer Service Account if both are set

---

## GitHub Environments Setup

Environments provide environment-specific configuration and protection rules.

### Why Use Environments?

- **Environment-specific secrets**: Different credentials for staging vs production
- **Deployment protection**: Require approvals before deploying to production
- **Deployment history**: Track what was deployed when
- **Rollback capability**: Quickly revert to previous deployments

### Step 1: Create Staging Environment

1. Go to: `https://github.com/VidDazzleLLC/velocityos/settings/environments`

2. Click **New environment**

3. **Name**: `staging`

4. Click **Configure environment**

5. (Optional) Environment protection rules:
   - **Wait timer**: 0 minutes (no delay for staging)
   - **Required reviewers**: None (optional for staging)
   - **Deployment branches**: All branches

6. Click **Save protection rules**

#### Add Staging-Specific Secrets (if needed)

If you want different Firebase tokens for staging:

1. In the staging environment page, scroll to **Environment secrets**
2. Click **Add secret**
3. Name: `FIREBASE_TOKEN`
4. Value: Your staging Firebase token
5. Click **Add secret**

### Step 2: Create Production Environment

1. Click **New environment** again

2. **Name**: `production`

3. Click **Configure environment**

4. **Configure protection rules** (HIGHLY RECOMMENDED):

   ✅ **Required reviewers**:
   - Add yourself or team members who should approve production deployments
   - Requires at least 1 approval before deployment
   
   ✅ **Wait timer**:
   - Set to 5 or 10 minutes
   - Gives you time to cancel if needed
   
   ✅ **Deployment branches**:
   - Select **Selected branches**
   - Add rule: `main`
   - Only allows deployments from the main branch

5. Click **Save protection rules**

#### Add Production-Specific Secrets (recommended)

Use different secrets for production for better security:

1. In production environment, scroll to **Environment secrets**
2. Add these secrets:
   - `FIREBASE_TOKEN`: Production Firebase token
   - Any other production-specific credentials

---

## Branch Protection Rules

Protect your main branch from accidental changes.

### Step 1: Enable Branch Protection

1. Go to: `https://github.com/VidDazzleLLC/velocityos/settings/branches`

2. Click **Add branch protection rule**

3. **Branch name pattern**: `main`

4. Configure protection rules:

   ✅ **Require a pull request before merging**
   - Require approvals: 1 (or more)
   - Dismiss stale pull request approvals when new commits are pushed
   
   ✅ **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Select status checks:
     - `Root - Build & Test`
     - `Frontend - Build & Test`
     - `Backend - Build & Test`
     - `E2E Tests`
   
   ✅ **Require conversation resolution before merging**
   
   ✅ **Include administrators** (optional but recommended)

5. Click **Create** or **Save changes**

---

## Workflow Permissions

Configure what GitHub Actions workflows can do in your repository.

### Step 1: Set Workflow Permissions

1. Go to: `https://github.com/VidDazzleLLC/velocityos/settings/actions`

2. Scroll to **Workflow permissions**

3. Select:
   - ✅ **Read repository contents and packages permissions**
   
   This is the most secure option. Workflows have read-only access by default.

4. ✅ **Allow GitHub Actions to create and approve pull requests**
   - Only enable if you want automated PR creation

5. Click **Save**

---

## Verification

After completing all steps, verify your configuration:

### 1. Check Repository Secrets

```bash
# Repository secrets should include at least ONE of:
# - FIREBASE_SERVICE_ACCOUNT_KEY (recommended)
# - FIREBASE_TOKEN (legacy, but still supported)
```

Go to: Settings → Secrets and variables → Actions

You should see at least one of:
- ✅ `FIREBASE_SERVICE_ACCOUNT_KEY` (recommended), OR
- ✅ `FIREBASE_TOKEN` (legacy)

### 2. Check Environments

Go to: Settings → Environments

You should see:
- ✅ `staging` (with or without protection rules)
- ✅ `production` (with protection rules)

### 3. Check Branch Protection

Go to: Settings → Branches

You should see:
- ✅ `main` branch protected
- Status checks required

### 4. Test Deployment Workflow

1. Push to `main` branch or create a PR
2. Check GitHub Actions: `https://github.com/VidDazzleLLC/velocityos/actions`
3. Workflows should run:
   - ✅ CI
   - ✅ Deploy Hosting (after push to main)
   - ✅ Deploy Functions (after push to main)

---

## Troubleshooting

### "Failed to authenticate, have you run firebase login?"

This error means Firebase authentication credentials are missing or invalid.

**Solution:**
1. Verify you have added one of these secrets at: Settings → Secrets and variables → Actions
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (recommended), OR
   - `FIREBASE_TOKEN` (legacy)
2. Check the secret name is exactly correct (case-sensitive)
3. For Service Account: Ensure the JSON key is valid and has proper permissions
4. For Firebase Token: Regenerate the token with `firebase login:ci` if it's expired
5. Re-run the workflow

### "Secret FIREBASE_TOKEN not found" or "Secret FIREBASE_SERVICE_ACCOUNT_KEY not found"

**Solution:**
1. Verify secret is added at: Settings → Secrets and variables → Actions
2. Name must be exactly: `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_TOKEN` (case-sensitive)
3. Re-run the workflow

### Deprecation warning about FIREBASE_TOKEN

You may see warnings like:
```
⚠ Authenticating with FIREBASE_TOKEN is deprecated and will be removed in a future major version
```

**Solution:**
This is expected if using the legacy `FIREBASE_TOKEN` method. The workflow still works, but for future compatibility:
1. Create a service account (see Option 1 in GitHub Secrets Configuration above)
2. Add `FIREBASE_SERVICE_ACCOUNT_KEY` secret to your repository
3. The workflow will automatically prefer the service account over the token

### "Environment not found"

**Solution:**
1. Create environment at: Settings → Environments
2. Name must match workflow: `staging` or `production`

### "Deployment waiting for approval"

**Expected behavior for production!**

**Solution:**
1. Go to: Actions → Select the workflow run
2. Click **Review deployments**
3. Select environment and click **Approve and deploy**

### Workflow fails with "Permission denied"

**Solution:**
1. Check workflow permissions: Settings → Actions
2. Ensure workflows have read access to repository
3. For Service Account: Ensure it has Firebase Admin or appropriate role permissions
4. For Firebase Token: Ensure the token is still valid (they can expire)

---

## Best Practices

### Security

- ✅ **Prefer Service Account authentication** over legacy Firebase tokens
- ✅ Use different credentials for staging and production (via environment secrets)
- ✅ Rotate service account keys periodically (every 90 days)
- ✅ Grant minimal required permissions to service accounts
- ✅ Never commit credentials to code
- ✅ Use environment-specific secrets for better isolation

### Deployment Safety

- ✅ Always test in staging before production
- ✅ Require approvals for production deployments
- ✅ Use wait timers to prevent hasty deployments
- ✅ Limit production deployments to `main` branch only

### Workflow Efficiency

- ✅ Use caching for dependencies (already configured)
- ✅ Run jobs in parallel where possible (already configured)
- ✅ Use artifact uploads for build outputs (already configured)

---

## Summary Checklist

Before deploying, ensure:

- [ ] Firebase authentication configured (choose one):
  - [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` secret added (recommended), OR
  - [ ] `FIREBASE_TOKEN` secret added (legacy)
- [ ] `staging` environment created (optional)
- [ ] `production` environment created with protection rules (optional)
- [ ] `main` branch protection enabled
- [ ] Workflow permissions configured
- [ ] Test deployment workflow runs successfully

Once all items are checked, your GitHub repository is ready for automated deployments! 🚀

---

## Next Steps

1. ✅ Complete this checklist
2. ✅ Run setup wizard: `./scripts/firebase-setup-wizard.sh`
3. ✅ Push to main branch to trigger automatic staging deployment
4. ✅ Manually trigger production deployment when ready

For deployment instructions, see:
- [FIREBASE_DEPLOYMENT_COMPLETE.md](FIREBASE_DEPLOYMENT_COMPLETE.md)

---

**Questions or issues?** Create an issue at: https://github.com/VidDazzleLLC/velocityos/issues
