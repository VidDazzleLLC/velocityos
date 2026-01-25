# Firebase Token Security Remediation Guide

## ⚠️ SECURITY ALERT

A Firebase secret token was identified as being saved in GitHub. This document outlines the immediate remediation steps required.

## Immediate Actions Required

### 1. Revoke the Exposed Token

**ACTION: Immediately revoke the compromised Firebase CI token**

```bash
# The exposed token should be considered compromised and must be revoked
# Firebase CI tokens cannot be directly revoked, but you can:

# Option A: Revoke all refresh tokens for your account (recommended)
# 1. Go to Firebase Console: https://console.firebase.google.com/
# 2. Click on your profile icon → Account
# 3. Sign out from all devices

# Option B: Remove the token from Firebase project access
# 1. Go to Firebase Console
# 2. Project Settings → Service Accounts
# 3. Manage service account permissions in Google Cloud Console
# 4. Remove or rotate credentials
```

### 2. Generate a New Firebase Token

**ACTION: Create a new Firebase CI token for GitHub Actions**

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login and generate a new CI token
firebase login:ci

# Copy the generated token - you'll need it for the next step
# Example output: 1//0abcdefghijklmnopqrstuvwxyz...
```

**⚠️ IMPORTANT: DO NOT save this token in the repository code or documentation**

### 3. Update GitHub Secret

**ACTION: Update the FIREBASE_TOKEN secret in GitHub**

1. Go to your GitHub repository: https://github.com/VidDazzleLLC/velocityos
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Find the existing `FIREBASE_TOKEN` secret
4. Click **Update** or delete and recreate it
5. Paste the NEW token generated in Step 2
6. Click **Save**

### 4. Verify No Tokens in Repository History

**ACTION: Confirm no tokens are committed in the repository**

```bash
# Search for Firebase CI token patterns in current files
git grep -E "1//[0-9A-Za-z_-]{30,}" || echo "✓ No tokens found in current files"

# Search git history for tokens (may take time in large repos)
git log --all --full-history -p -S "1//" | grep -i "firebase\|token" || echo "✓ No tokens in recent history"
```

### 5. Audit GitHub Secrets Access

**ACTION: Review who has access to GitHub Secrets**

1. Go to: **Settings** → **Collaborators and teams**
2. Review all users and teams with **Write** or **Admin** access
3. Remove any unnecessary access
4. Consider enabling **Required reviews** for production deployments

## Security Best Practices Going Forward

### 1. Never Commit Secrets

**NEVER** commit any of the following to the repository:

- Firebase CI tokens (format: `1//...`)
- Firebase service account JSON files
- API keys
- Database passwords
- Private keys
- OAuth client secrets
- Environment variables with sensitive data

### 2. Use GitHub Secrets Properly

✅ **CORRECT** way to use secrets in GitHub Actions:

```yaml
env:
  FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

❌ **INCORRECT** - Never do this:

```yaml
env:
  FIREBASE_TOKEN: "1//0abcdefghijklmnopqrstuvwxyz..."
```

### 3. Protected Files

The following file patterns are protected by `.gitignore` and should NEVER be committed:

- `.env` files (except `.env.example`)
- `serviceAccountKey.json` or similar service account files
- `firebase-debug.log`
- `*.pem`, `*.key` files
- `.firebase/` directory

### 4. Use Environment Variables

For local development:

```bash
# Create a .env file (already in .gitignore)
cp .env.example .env

# Add your secrets to .env (this file will NOT be committed)
FIREBASE_TOKEN=your-token-here

# Never commit .env file
```

### 5. Enable Secret Scanning

**RECOMMENDED**: Enable GitHub's secret scanning

1. Go to: **Settings** → **Code security and analysis**
2. Enable **Secret scanning**
3. Enable **Push protection** to prevent accidental commits of secrets

### 6. Use Pre-Commit Hooks (Optional)

Install git-secrets to prevent committing secrets:

```bash
# Install git-secrets
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets
cd git-secrets
sudo make install

# Configure for this repository
cd /path/to/velocityos
git secrets --install
git secrets --register-aws
git secrets --add '1//[0-9A-Za-z_-]{30,}'  # Firebase CI token pattern
```

## Verification Steps

After completing the remediation:

- [ ] Old Firebase token has been revoked
- [ ] New Firebase token generated
- [ ] GitHub Secret `FIREBASE_TOKEN` updated with new token
- [ ] Confirmed no tokens in repository code
- [ ] Confirmed no tokens in repository history
- [ ] Verified `.gitignore` includes secret file patterns
- [ ] Tested GitHub Actions workflows with new token
- [ ] Reviewed collaborator access to GitHub Secrets
- [ ] (Optional) Enabled GitHub secret scanning
- [ ] (Optional) Installed git-secrets pre-commit hooks

## Testing the Remediation

After updating the GitHub Secret:

```bash
# Trigger a deployment workflow to test
git commit --allow-empty -m "Test Firebase token rotation"
git push origin main

# Monitor GitHub Actions
# Go to: Actions tab in GitHub
# Verify the deployment workflow runs successfully
```

## Monitoring and Alerts

### Set Up Notifications

1. **GitHub Security Alerts**
   - Go to: **Settings** → **Notifications**
   - Enable alerts for secret scanning

2. **Firebase Monitoring**
   - Monitor Firebase Console for unauthorized access
   - Review Cloud Function logs for suspicious activity
   - Check Firebase Authentication logs

3. **Regular Audits**
   - Review GitHub Actions logs monthly
   - Audit GitHub Secret access quarterly
   - Rotate Firebase tokens annually (or immediately if compromised)

## Incident Response

If a token compromise is suspected in the future:

1. **Immediately** revoke the compromised token
2. Generate a new token
3. Update GitHub Secrets
4. Review Firebase logs for unauthorized access
5. Check for data exfiltration
6. Update all affected systems
7. Document the incident
8. Review and improve security practices

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)
- [OWASP Secret Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Contact

For security concerns or questions:
- Create a private security advisory in GitHub
- Contact: connect@viddazzle.com
- Review: SECURITY.md (if exists)

---

**Status**: ⚠️ REMEDIATION IN PROGRESS

**Last Updated**: 2026-01-25

**Prepared by**: Security Team
