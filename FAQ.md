# VelocityOS Frequently Asked Questions (FAQ)

## Firebase Configuration

### Where do I put the Firebase Token?

The Firebase Token is stored as a **GitHub Repository Secret**, not in your code or local files.

**Quick Answer:**
1. Run `firebase login:ci` in your terminal
2. Go to GitHub: **Repository → Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token
6. Click **"Add secret"**

**Detailed Guide:** See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

### Why can't I put the Firebase Token in a `.env` file?

The Firebase Token is used by GitHub Actions (CI/CD) to deploy your app automatically. GitHub Actions runs on GitHub's servers, not your local machine, so it needs the token to be stored as a GitHub Secret.

**Do NOT** commit the Firebase Token to your repository - it's a security risk!

### What is the difference between Repository Secrets and Environment Secrets?

- **Repository Secrets**: Available to all workflows in the repository. Simpler to set up. ✅ Recommended for most users.
- **Environment Secrets**: Specific to a GitHub Environment (like "staging" or "production"). Allows different tokens per environment and deployment protection rules. Use only if you need advanced controls.

For VelocityOS, using **Repository Secrets** is sufficient unless you need separate tokens for staging and production.

### How do I know if my Firebase Token is set up correctly?

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. You should see `FIREBASE_TOKEN` listed under "Repository secrets"
4. Push a change to the `main` branch
5. Check the **Actions** tab - deployment workflows should run successfully

If the deployment fails with "FIREBASE_TOKEN not found", the secret is not configured properly.

### The Firebase Token expired or doesn't work. What should I do?

Firebase tokens can expire or become invalid. To fix:

1. Generate a new token:
   ```bash
   firebase login:ci
   ```

2. Update the GitHub secret:
   - Go to **Settings → Secrets and variables → Actions**
   - Click on `FIREBASE_TOKEN`
   - Click **"Update secret"**
   - Paste the new token
   - Click **"Update secret"**

## Development

### How do I run VelocityOS locally?

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at `http://localhost:3000`

See [README.md](README.md) for more details.

### How do I run tests?

```bash
# Run end-to-end tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui
```

See [e2e/README.md](e2e/README.md) for more details.

## Deployment

### How do I deploy to Firebase manually?

```bash
# Deploy to staging (default project)
firebase deploy --project default

# Deploy to production
firebase deploy --project prod

# Deploy only hosting
firebase deploy --only hosting --project default

# Deploy only functions
firebase deploy --only functions --project default
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for more details.

### Does deployment happen automatically?

Yes! When you push to the `main` branch, GitHub Actions will automatically:
1. Build the application
2. Run tests
3. Deploy to Firebase (if `FIREBASE_TOKEN` is configured)

You can monitor deployments in the **Actions** tab of your GitHub repository.

### How do I deploy to production instead of staging?

The repository is configured with two Firebase projects:
- **default**: Staging environment
- **prod**: Production environment

To deploy to production:
```bash
firebase deploy --project prod
```

Or update the GitHub Actions workflow to deploy to `prod` on specific triggers (like tags or manual dispatch).

## Troubleshooting

### Port 3000 is already in use

Change the port in your `.env` file:
```env
PORT=3001
```

Or kill the process using port 3000:
```bash
# Find the process
lsof -i :3000

# Kill it (replace PID with the actual process ID)
kill -9 <PID>
```

### npm install fails

Try clearing the cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase CLI not found

Install the Firebase CLI globally:
```bash
npm install -g firebase-tools
```

Then verify:
```bash
firebase --version
```

### Deployment fails with permission errors

1. Re-authenticate with Firebase:
   ```bash
   firebase login --reauth
   ```

2. Verify you have the correct permissions in the Firebase project

3. Generate a new CI token:
   ```bash
   firebase login:ci
   ```

4. Update the `FIREBASE_TOKEN` secret in GitHub

### Build fails in GitHub Actions

1. Check the **Actions** tab for detailed error logs
2. Try building locally to reproduce the error:
   ```bash
   cd velocity-os-rebuilt
   npm run build
   ```
3. Fix any errors and push again

## Getting Help

If you encounter issues not covered in this FAQ:

1. Check the detailed documentation:
   - [README.md](README.md) - Getting started
   - [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Firebase configuration
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
   - [e2e/README.md](e2e/README.md) - Testing documentation

2. Check GitHub Actions logs for deployment issues

3. Review Firebase Console logs for runtime errors

4. Open an issue on GitHub with:
   - Description of the problem
   - Steps to reproduce
   - Error messages or screenshots
   - Your environment (OS, Node version, etc.)

---

**Last Updated:** 2026-01-25
