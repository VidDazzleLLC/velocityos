# VelocityOS Scripts

This directory contains helpful scripts for setting up, deploying, and managing VelocityOS.

## Quick Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `firebase-setup-wizard.sh` | **Interactive Firebase setup** | First-time Firebase configuration |
| `setup.sh` | Initial project setup | First time cloning repository |
| `deploy.sh` | Deploy to Firebase | Manual deployments |
| `configure-firebase-secrets.sh` | Configure Firebase secrets | Setting up secrets for Cloud Functions |
| `verify-deployment.sh` | Verify deployment health | After deploying to check status |
| `generate-secrets.sh` | Generate JWT/Session secrets | Creating secure authentication secrets |

## Available Scripts

### 🧙 firebase-setup-wizard.sh ⭐ **RECOMMENDED FOR FIRST-TIME SETUP**

**Purpose**: Interactive wizard that guides you through complete Firebase setup

**Usage**:
```bash
./scripts/firebase-setup-wizard.sh
```

**What it does**:
- ✅ Checks and installs prerequisites (Node.js, npm, Firebase CLI)
- ✅ Authenticates with Firebase
- ✅ Helps configure Firebase projects (staging and production)
- ✅ Updates `.firebaserc` with your project IDs
- ✅ Generates secure secrets (JWT_SECRET, SESSION_SECRET)
- ✅ Configures Firebase Cloud Functions secrets
- ✅ Builds frontend and backend
- ✅ Generates Firebase CI token for GitHub Actions
- ✅ Provides step-by-step instructions for GitHub setup

**When to use**:
- **First time setting up Firebase for VelocityOS**
- When you need guided setup with explanations
- When configuring both staging and production environments

**Interactive prompts**:
- Installation of Firebase CLI (if needed)
- Firebase login
- Project ID configuration
- Secret generation and configuration
- AI API key setup (optional)
- GitHub Actions token generation

**Time**: 10-15 minutes

---

### 🚀 setup.sh

**Purpose**: First-time project setup and installation

**Usage**:
```bash
./scripts/setup.sh
```

**What it does**:
- Checks prerequisites (Node.js, npm, Firebase CLI)
- Installs all dependencies (root, frontend, backend)
- Creates `.env` file from template
- Optionally generates secure secrets
- Builds frontend and backend
- Provides next steps guidance

**When to use**:
- First time setting up the project
- After cloning the repository
- When setting up a new development environment

---

### 🔐 generate-secrets.sh

**Purpose**: Generate secure random secrets for authentication

**Usage**:
```bash
./scripts/generate-secrets.sh
```

**What it does**:
- Generates a secure `JWT_SECRET` (32-byte base64)
- Generates a secure `SESSION_SECRET` (32-byte base64)
- Displays the secrets for manual copying
- Provides instructions for updating `.env`

**When to use**:
- When setting up a new environment
- When rotating secrets for security
- When configuring staging vs production environments

**Requirements**:
- `openssl` command-line tool

**Example output**:
```
🔐 VelocityOS Secret Generator
================================

Generating secrets...

✅ JWT_SECRET generated
✅ SESSION_SECRET generated

📋 Your Generated Secrets:
================================

JWT_SECRET=abc123...xyz789
SESSION_SECRET=def456...uvw012

================================
```

---

### 🔧 configure-firebase-secrets.sh

**Purpose**: Configure secrets for Firebase Cloud Functions

**Usage**:
```bash
./scripts/configure-firebase-secrets.sh
```

**What it does**:
- Guides you through configuring Firebase Function secrets
- Allows choosing staging, production, or both environments
- Can generate new secrets or use existing ones
- Configures required secrets (JWT_SECRET, SESSION_SECRET)
- Optionally configures AI API keys (Gemini, OpenAI, Anthropic)
- Optionally configures OAuth credentials (Google)

**When to use**:
- After creating Firebase projects
- When adding new secrets to Cloud Functions
- When configuring different secrets for staging vs production
- When rotating secrets

**Interactive options**:
1. Select environment (staging/production/both)
2. Generate new or enter existing secrets
3. Configure optional AI API keys
4. Configure optional OAuth credentials

---

### 🚀 deploy.sh

**Purpose**: Interactive Firebase deployment with safety checks

**Usage**:
```bash
./scripts/deploy.sh
```

**What it does**:
- Verifies Firebase CLI authentication
- Prompts for deployment target (staging/production)
- Runs pre-deployment checks:
  - Validates builds are up-to-date
  - Checks Firebase configuration files
  - Confirms deployment intent
- Allows selecting what to deploy:
  - Everything (hosting + functions)
  - Hosting only
  - Functions only
- Executes deployment
- Provides post-deployment URLs and next steps

**When to use**:
- Manual deployments to staging or production
- When you need control over deployment targets
- Testing deployments before automating

**Requirements**:
- Firebase CLI installed and authenticated
- Frontend built (`velocity-os-rebuilt/out/`)
- Backend built (`functions/lib/`)

**Safety Features**:
- Confirmation required for production deployments
- Option to rebuild before deploying
- Clear deployment summary before execution

---

### ✅ verify-deployment.sh

**Purpose**: Verify that your Firebase deployment is working correctly

**Usage**:
```bash
./scripts/verify-deployment.sh
```

**What it does**:
- Prompts for environment (staging/production)
- Retrieves project ID from `.firebaserc`
- Runs comprehensive health checks:
  - ✅ Hosting accessibility
  - ✅ Cloud Functions deployment status
  - ✅ API health endpoint
  - ✅ Firestore database accessibility
  - ✅ Firebase Authentication configuration
  - ✅ Build artifacts presence
  - ✅ Configuration files validation
- Provides deployment summary with URLs
- Suggests next steps if checks fail

**When to use**:
- After deploying to verify everything works
- Troubleshooting deployment issues
- Regular health checks

**Example output**:
```
✅ Checks passed: 7
❌ Checks failed: 0

All checks passed! 🎉

🌐 Access your app at:
   https://velocityos-staging-xxx.web.app

📊 Firebase Console:
   https://console.firebase.google.com/project/velocityos-staging-xxx
```

---

## Script Permissions

All scripts should be executable. If not, run:

```bash
chmod +x scripts/*.sh
```

## Common Workflows

### First-Time Complete Setup (RECOMMENDED)

```bash
# Run the all-in-one wizard
./scripts/firebase-setup-wizard.sh

# Follow the interactive prompts
# When complete, deploy:
./scripts/deploy.sh
```

### Alternative: Manual Setup

```bash
# 1. Run setup script
./scripts/setup.sh

# 2. Generate secrets
./scripts/generate-secrets.sh

# 3. Edit .env with generated secrets and your API keys
nano .env

# 4. Configure Firebase secrets
./scripts/configure-firebase-secrets.sh

# 5. Test locally
npm start

# 6. Deploy to staging
./scripts/deploy.sh
```

### Deploying to Staging

```bash
# Option 1: Using deploy script (recommended)
./scripts/deploy.sh
# Select: 1 (staging)
# Select: 1 (everything)

# Option 2: Direct command
firebase deploy --project default
```

### Deploying to Production

```bash
# Using deploy script (recommended for safety)
./scripts/deploy.sh
# Select: 2 (production)
# Confirm: yes
# Select: 1 (everything)
```

### Verify Deployment

```bash
./scripts/verify-deployment.sh
# Select environment to verify
```

### Rotating Secrets

```bash
# 1. Generate new secrets
./scripts/generate-secrets.sh

# 2. Update .env file with new secrets

# 3. Update Firebase Functions secrets
./scripts/configure-firebase-secrets.sh

# 4. Redeploy functions
./scripts/deploy.sh
# Select functions only
```

### Configuring AI API Keys

```bash
# Use the secrets configuration script
./scripts/configure-firebase-secrets.sh

# Follow prompts to add:
# - GEMINI_API_KEY
# - OPENAI_API_KEY
# - ANTHROPIC_API_KEY
```

## Troubleshooting

### "Permission denied" error
```bash
chmod +x scripts/*.sh
```

### "openssl: command not found"
Install OpenSSL:
- macOS: `brew install openssl`
- Ubuntu/Debian: `sudo apt-get install openssl`
- Windows: Use Git Bash or WSL

### "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### "firebase login" fails
```bash
firebase logout
firebase login --reauth
```

## Security Best Practices

1. **Never commit secrets**: The `.env` file is in `.gitignore` for a reason
2. **Use different secrets**: Generate separate secrets for staging and production
3. **Rotate regularly**: Change secrets periodically for security
4. **Secure storage**: Use environment variables or secret managers in CI/CD

## Additional Resources

- [Deployment Guide](../DEPLOYMENT.md)
- [Launch Checklist](../LAUNCH_CHECKLIST.md)
- [Firebase Setup Guide](../FIREBASE_SETUP.md)
- [Main README](../README.md)

## Contributing

When adding new scripts:
1. Make them executable: `chmod +x scripts/your-script.sh`
2. Add clear comments and usage instructions
3. Update this README with script documentation
4. Follow the existing script structure and formatting
5. Test on both macOS and Linux if possible

## License

Apache 2.0 - See [LICENSE](../LICENSE)
