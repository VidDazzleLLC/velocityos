# CI/CD Workflow Documentation

## Overview

This repository includes a comprehensive CI/CD workflow that builds, tests, and validates all components of the VelocityOS application.

## Workflow Structure

### Trigger Events

The CI workflow runs on:
- Pull requests to `main` and `develop` branches
- Pushes to `main` and `develop` branches

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

To enable automatic deployment to Firebase staging on main branch pushes:

1. **Set up GitHub Secrets**:
   - `FIREBASE_SERVICE_ACCOUNT`: Base64-encoded Firebase service account JSON
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID (e.g., `velocityos-staging`)

2. **Generate Service Account**:
   ```bash
   # In Firebase Console, go to Project Settings > Service Accounts
   # Generate new private key and download JSON file
   # Then encode it:
   base64 -i service-account.json | pbcopy  # macOS
   base64 -i service-account.json | xclip   # Linux
   ```

3. **Update Workflow**:
   Uncomment the deployment steps in `.github/workflows/ci.yml` under the `firebase-prepare` job.

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
