# Quick Start: Testing Firebase Deployment

## ✅ What Was Fixed

The Firebase deployment authentication issue has been resolved. The problem was:
1. Third-party action `w9jds/firebase-action` not properly passing tokens
2. Incorrect token reference syntax in shell commands

## 🚀 How to Deploy NOW

### Option 1: Deploy to Staging (Automatic)
```bash
# Simply push to main branch
git push origin main
```
This will automatically trigger:
- `deploy-hosting.yml` - Deploys frontend to Firebase Hosting
- `deploy-functions.yml` - Deploys backend to Firebase Functions

### Option 2: Deploy to Production (Manual)
1. Go to GitHub Actions: https://github.com/VidDazzleLLC/velocityos/actions
2. Click "Deploy to Production" workflow
3. Click "Run workflow" button
4. Type `DEPLOY` in the confirmation field
5. Click "Run workflow"

This will deploy both hosting and functions to the production Firebase project.

## ✅ Verification Checklist

Before deploying, ensure:
- [ ] `FIREBASE_TOKEN` secret is set in GitHub repository settings
  - Go to: Settings → Secrets and variables → Actions → Repository secrets
  - Name: `FIREBASE_TOKEN`
  - Value: Your Firebase CI token (from `firebase login:ci`)

- [ ] Firebase projects exist:
  - Staging: `velocityos-staging`
  - Production: `velocityos-production`

- [ ] You have necessary permissions in both Firebase projects

## 🔍 Monitoring Deployment

1. Go to Actions tab in GitHub
2. Click on the running workflow
3. Expand the deployment job to see logs
4. Look for success messages like: ✅ Deployment complete!

## ❓ If You Still Get Authentication Errors

1. **Regenerate the Firebase token**:
   ```bash
   firebase login:ci
   ```
   Copy the new token and update the GitHub secret.

2. **Verify token has correct permissions**:
   - The token must be from an account with deploy permissions
   - Check Firebase Console → Project Settings → Users and permissions

3. **Check the workflow logs**:
   - Look for the exact error message
   - Verify the token is being passed (it will be masked as ***)

## 📝 Technical Details

The fix uses direct Firebase CLI commands with proper token syntax:
```yaml
- name: Install Firebase CLI
  run: npm install -g firebase-tools@latest

- name: Deploy to Firebase Hosting
  run: firebase deploy --only hosting --token "${{ secrets.FIREBASE_TOKEN }}" --non-interactive
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Key points:
- Token passed via `--token` flag directly to CLI
- GitHub Actions expression `${{ secrets.FIREBASE_TOKEN }}` used (not shell variable)
- `--non-interactive` flag for CI/CD environments
- Firebase CLI installed globally in each job

## 🎯 Expected Results

After successful deployment:
- Staging URL: https://velocityos-staging.web.app
- Production URL: https://velocityos-production.web.app
- Functions deployed and accessible via hosting rewrites

## Need Help?

See `FIREBASE_DEPLOYMENT_FIX.md` for detailed technical explanation.
