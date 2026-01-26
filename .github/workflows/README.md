# CI/CD Workflow Documentation

## Overview

This repository includes a comprehensive CI/CD workflow that builds, tests, and validates all components of the VelocityOS application.

## Workflow Structure

### Workflows

This repository includes multiple workflows:

1. **CI Workflow** (`ci.yml`) - Runs on pull requests and pushes
2. **Deploy Hosting** (`deploy-hosting.yml`) - Deploys frontend to Firebase Hosting (staging)
3. **Deploy Functions** (`deploy-functions.yml`) - Deploys Cloud Functions (staging)
4. **Deploy to Production** (`deploy-production.yml`) - Manual production deployment

### Trigger Events

#### CI Workflow
The CI workflow runs on:
- Pull requests to `main` and `develop` branches
- Pushes to `main` and `develop` branches

#### Deployment Workflows
- **deploy-hosting.yml** and **deploy-functions.yml**: Automatically run on pushes to `main` branch
- **deploy-production.yml**: Manually triggered via workflow dispatch

### Components Tested

1. **Root Directory** - Basic Express server for local development
2. **Frontend** (`velocity-os-rebuilt`) - Next.js 14 app with TypeScript and Tailwind CSS
3. **Backend** (`functions`) - Firebase Cloud Functions with Express API

### Workflow Jobs

#### 1. Root Build & Test
- Installs dependencies with `npm ci`
- Runs linting with `npm run lint`
- Runs tests with `npm test`
- Uses Node.js 20.x with dependency caching

#### 2. Frontend Build & Test
- Installs dependencies with `npm ci`
- Runs ESLint for code quality
- Runs tests (placeholder currently)
- Builds Next.js app with static export
- Uploads build artifacts for verification
- Uses Node.js 20.x with dependency caching

#### 3. Backend Build & Test
- Installs dependencies with `npm ci`
- Runs ESLint with Google style guide
- Runs tests (placeholder currently)
- Compiles TypeScript to JavaScript
- Uploads compiled functions
- Uses Node.js 20.x with dependency caching

#### 4. Firebase Deployment Preparation
- **Only runs on pushes to `main` branch**
- Waits for all build jobs to complete
- Downloads build artifacts
- Validates Firebase configuration
- Provides instructions for enabling deployment
- **Does NOT auto-deploy** (requires manual setup)

#### 5. CI Status Summary
- Checks status of all jobs
- Fails if any required job fails
- Provides clear status summary

## Local Development

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Running Locally

#### Root Directory
```bash
npm install
npm run lint
npm test
```

#### Frontend (velocity-os-rebuilt)
```bash
cd velocity-os-rebuilt
npm install
npm run lint
npm test
npm run build
```

The build command automatically creates a static export in the `out/` directory.

#### Backend (functions)
```bash
cd functions
npm install
npm run lint
npm test
npm run build
```

The build command compiles TypeScript to JavaScript in the `lib/` directory.

## Enabling Firebase Deployment

Firebase deployment workflows (`deploy-hosting.yml`, `deploy-functions.yml`, `deploy-production.yml`) require authentication credentials to deploy to Firebase.

### Authentication Options

You have **two options** for authenticating with Firebase:

#### Option 1: Service Account (Recommended) ⭐

**Why use this?**
- Modern, officially recommended approach
- Works with all current and future Firebase CLI versions
- More secure with granular permissions
- Easier to manage and rotate

**Setup Steps:**

1. **Create a Service Account** in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your Firebase project
   - Navigate to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Set a name (e.g., "GitHub Actions Deploy")
   - Grant these roles:
     - **Firebase Admin** (or more specific roles like Firebase Hosting Admin, Cloud Functions Developer)
   - Click **Done**

2. **Generate JSON Key**:
   - Find your service account in the list
   - Click the three dots (⋮) → **Manage keys**
   - Click **Add Key** → **Create new key**
   - Choose **JSON** format
   - Click **Create** (the key file downloads automatically)

3. **Add to GitHub Secrets**:
   - Go to your repository: `Settings` → `Secrets and variables` → `Actions`
   - Click **New repository secret**
   - Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Value: Copy and paste the **entire contents** of the downloaded JSON file
   - Click **Add secret**

#### Option 2: Firebase Token (Legacy)

**Note:** This method is deprecated in Firebase CLI v11+ but still supported for backward compatibility.

**Setup Steps:**

1. **Generate Token** on your local machine:
   ```bash
   firebase login:ci
   ```

2. **Copy the token** from the terminal output

3. **Add to GitHub Secrets**:
   - Go to your repository: `Settings` → `Secrets and variables` → `Actions`
   - Click **New repository secret**
   - Name: `FIREBASE_TOKEN`
   - Value: Paste the token from step 1
   - Click **Add secret**

### How It Works

The deployment workflows automatically detect which authentication method is available:

1. **First**, they check for `FIREBASE_SERVICE_ACCOUNT_KEY` (recommended)
2. **If not found**, they check for `FIREBASE_TOKEN` (legacy)
3. **If neither found**, the workflow fails with a clear error message

You only need to set up **one** of these methods. If both are present, the service account will be used.

### Testing Deployment

After setting up authentication:

1. **For staging deployment**: Push to the `main` branch
   - `deploy-hosting.yml` and `deploy-functions.yml` will run automatically

2. **For production deployment**:
   - Go to `Actions` → `Deploy to Production`
   - Click `Run workflow`
   - Type `DEPLOY` in the confirmation field
   - Click `Run workflow`

### Troubleshooting Deployment

If deployment fails with authentication errors:

1. **Verify secrets are set correctly**:
   - Go to `Settings` → `Secrets and variables` → `Actions`
   - Ensure either `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_TOKEN` exists

2. **For Service Account**:
   - Verify the JSON is valid and complete
   - Ensure the service account has proper permissions
   - Check that the Firebase project ID matches

3. **For Firebase Token**:
   - Tokens can expire - regenerate with `firebase login:ci`
   - Ensure the token has access to the correct Firebase projects

4. **Check workflow logs**:
   - Go to `Actions` tab
   - Click on the failed workflow run
   - Check the "Setup Firebase Authentication" step for error details

For more details, see [GITHUB_SETUP.md](../../GITHUB_SETUP.md) in the repository root.

## Configuration Files

### Root
- `package.json` - Dependencies and scripts
- `package-lock.json` - Locked dependency versions

### Frontend (velocity-os-rebuilt)
- `package.json` - Next.js and dependencies
- `package-lock.json` - Locked dependency versions
- `next.config.js` - Next.js configuration (static export enabled)
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.eslintrc.json` - ESLint configuration (Next.js strict)

### Backend (functions)
- `package.json` - Firebase Functions dependencies
- `package-lock.json` - Locked dependency versions
- `tsconfig.json` - TypeScript configuration (strict mode)
- `.eslintrc.js` - ESLint configuration (Google style guide)
- `src/index.ts` - Main Cloud Function entry point

## Caching Strategy

The workflow uses GitHub Actions caching to speed up builds:
- Node modules are cached per directory
- Cache key is based on `package-lock.json` hash
- Separate caches for root, frontend, and backend

## Node.js Version Management

The Node.js version is centralized as an environment variable:
```yaml
env:
  NODE_VERSION: '20'
```

To update the Node.js version, change this single value and all jobs will use the new version.

## Parallel Execution

Jobs run in parallel where possible:
- Root, frontend, and backend builds run simultaneously
- Firebase preparation waits for all builds to complete
- This minimizes total CI time

## Troubleshooting

### Build Failures

1. **Check job logs** in GitHub Actions for specific error messages
2. **Run locally** to reproduce the issue
3. **Verify dependencies** are correctly installed
4. **Check Node.js version** matches the workflow

### Cache Issues

If you suspect cache corruption:
1. Update a dependency to change `package-lock.json`
2. This will invalidate the cache and force a fresh install

### TypeScript Errors

- Ensure `tsconfig.json` is properly configured
- Run `npm run build` locally to check compilation
- Check that all type definitions are installed

## Security

- Workflow uses minimal permissions (`contents: read`)
- No automatic deployment to production
- Firebase credentials stored as encrypted secrets
- CodeQL security scanning enabled

## Future Enhancements

- [ ] Add actual test suites for frontend and backend
- [ ] Add code coverage reporting
- [ ] Add performance benchmarking
- [ ] Add automated dependency updates (Dependabot)
- [ ] Add preview deployments for pull requests
- [ ] Add end-to-end testing with Playwright or Cypress
