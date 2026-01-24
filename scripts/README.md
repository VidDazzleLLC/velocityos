# VelocityOS Scripts

This directory contains helpful scripts for setting up, deploying, and managing VelocityOS.

## Available Scripts

### 🚀 setup.sh

**Purpose**: First-time setup and installation

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

## Script Permissions

All scripts should be executable. If not, run:

```bash
chmod +x scripts/*.sh
```

## Common Workflows

### First-Time Setup
```bash
# 1. Run setup script
./scripts/setup.sh

# 2. Generate secrets
./scripts/generate-secrets.sh

# 3. Edit .env with generated secrets and your API keys
nano .env

# 4. Test locally
npm start
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

### Rotating Secrets
```bash
# 1. Generate new secrets
./scripts/generate-secrets.sh

# 2. Update .env file with new secrets

# 3. Update Firebase Functions secrets
firebase functions:secrets:set JWT_SECRET --project default
firebase functions:secrets:set SESSION_SECRET --project default

# 4. Redeploy functions
./scripts/deploy.sh
# Select functions only
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
