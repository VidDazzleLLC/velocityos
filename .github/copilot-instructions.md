# Copilot Custom Instructions for VelocityOS

## Repository Purpose

VelocityOS is a next-gen AI business OS that automates routine work. It provides AI-powered automation for business tasks, unified data management, analytics dashboards, customer relationship management, and campaign tools.

## Architecture Overview

VelocityOS uses a multi-tier architecture:

- **Frontend**: Next.js 14 application with React 18 (`velocity-os-rebuilt/`)
  - Static site generation for Firebase Hosting
  - TypeScript with strict mode enabled
  - Tailwind CSS for styling
  - Located in `velocity-os-rebuilt/` directory

- **Backend**: Firebase Cloud Functions with Express.js (`functions/`)
  - TypeScript-based serverless functions
  - Firebase Admin SDK for database and auth operations
  - Located in `functions/` directory

- **Static Pages**: Express server for local development (`public/`)
  - Authentication pages in `public/auth/`
  - Dashboard pages in `public/dashboard/`

- **Testing**: Playwright for E2E tests (`e2e/`)
  - Comprehensive end-to-end tests covering authentication, dashboard, customers, and campaigns
  - Test utilities and fixtures in `e2e/fixtures/`

## Project Structure

```
velocityos/
├── velocity-os-rebuilt/   # Frontend (Next.js 14)
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   └── out/               # Built static export (for Firebase Hosting)
├── functions/             # Backend (Firebase Cloud Functions)
│   ├── src/               # TypeScript source
│   └── lib/               # Compiled JavaScript
├── public/                # Static HTML files
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── e2e/                   # End-to-end tests
│   ├── fixtures/          # Test helpers and utilities
│   └── tests/             # Test specifications
├── scripts/               # Deployment and setup scripts
├── .github/workflows/     # CI/CD pipelines
├── firebase.json          # Firebase configuration
├── .firebaserc            # Firebase project aliases
├── server.js              # Express server (local dev)
└── package.json           # Root package configuration
```

## Development Guidelines

### Building the Project

1. **Frontend** (Next.js):
   ```bash
   cd velocity-os-rebuilt
   npm install
   npm run build
   ```

2. **Backend** (Firebase Functions):
   ```bash
   cd functions
   npm install
   npm run build
   ```

3. **Local Development**:
   ```bash
   # Root - start Express dev server
   npm install
   npm run dev
   
   # Frontend - start Next.js dev server
   cd velocity-os-rebuilt
   npm run dev
   ```

### Testing

- **E2E Tests** (Playwright): Located in `e2e/` directory
  ```bash
  npm run test:e2e          # Run all E2E tests
  npm run test:e2e:ui       # Run with UI mode
  npm run test:e2e:debug    # Debug mode
  ```
  
- **Unit Tests**: 
  - Frontend: `cd velocity-os-rebuilt && npm test`
  - Backend: `cd functions && npm test`
  - Note: Currently minimal test infrastructure

### Linting

- **Frontend** (Next.js with ESLint):
  ```bash
  cd velocity-os-rebuilt
  npm run lint
  ```

- **Backend** (TypeScript ESLint with Google style):
  ```bash
  cd functions
  npm run lint
  ```

- **Root**: No linting configured at root level

## Coding Standards

### TypeScript

- Use **strict mode** (`"strict": true` in tsconfig.json)
- All new code should use TypeScript, not JavaScript
- Prefer explicit types over `any`
- Use proper type definitions for props and function parameters

### Frontend (Next.js)

- Use Next.js 14 App Router patterns
- Components should be in `velocity-os-rebuilt/components/`
- Pages/routes should be in `velocity-os-rebuilt/app/`
- Follow React 18 best practices (hooks, functional components)
- Use Tailwind CSS for styling (avoid inline styles)
- Follow existing component patterns and naming conventions

### Backend (Firebase Functions)

- Follow Google TypeScript style guide
- Use Firebase Admin SDK for database operations
- Keep functions small and focused
- Use proper error handling and logging
- All functions should be in `functions/src/`

### Testing

- E2E tests should cover complete user flows
- Use Playwright's best practices (page objects, fixtures)
- Tests should be independent and repeatable
- Follow existing test patterns in `e2e/tests/`

## Deployment

### Firebase Deployment Workflow

1. **Setup**: Use `./scripts/firebase-setup-wizard.sh` for guided setup
2. **Staging**: Auto-deploys on push to `main` branch
3. **Production**: Manual deployment via workflow dispatch
4. **Verification**: Run `./scripts/verify-deployment.sh` after deployment

### Key Scripts

- `./scripts/firebase-setup-wizard.sh` - Interactive Firebase setup
- `./scripts/deploy.sh` - Deploy to staging or production
- `./scripts/configure-firebase-secrets.sh` - Configure secrets
- `./scripts/verify-deployment.sh` - Verify deployment health
- `./scripts/generate-secrets.sh` - Generate secure secrets

## Key Practices

1. **Minimal Changes**: Make the smallest possible changes to address issues
2. **Test Before Commit**: Always run relevant tests before committing
3. **Build Verification**: Ensure builds succeed before pushing
4. **Documentation**: Update README.md or relevant docs when adding new features
5. **TypeScript**: Maintain strict type safety across the codebase
6. **Dependencies**: Use existing libraries when possible; only add new dependencies when necessary
7. **Security**: Never commit secrets or credentials to the repository
8. **Code Review**: Follow existing code patterns and conventions

## Special Considerations

- **Multi-package Structure**: This repo has 3 package.json files (root, functions, velocity-os-rebuilt)
- **Firebase Configuration**: Firebase project settings are in `firebase.json` and `.firebaserc`
- **Environment Variables**: Use `.env.example` and `.env.test.example` as templates
- **Static Export**: Frontend builds to static files for Firebase Hosting
- **Node Version**: Backend requires Node.js 18 (specified in `functions/package.json`)

## Documentation

Key documentation files:
- [README.md](../README.md) - Main project documentation
- [FIREBASE_DEPLOYMENT_COMPLETE.md](../FIREBASE_DEPLOYMENT_COMPLETE.md) - Complete Firebase setup guide
- [e2e/README.md](../e2e/README.md) - E2E testing documentation
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment overview
- [LAUNCH_CHECKLIST.md](../LAUNCH_CHECKLIST.md) - Pre-launch checklist

## Common Tasks

### Adding a New Feature

1. Determine if it's frontend (Next.js) or backend (Functions)
2. Create necessary components/functions in the appropriate directory
3. Add E2E tests in `e2e/tests/` if it affects user workflows
4. Update documentation if adding new APIs or significant features
5. Test locally before committing
6. Ensure linting passes

### Fixing Bugs

1. Identify the affected component (frontend/backend/static pages)
2. Write or update E2E tests to reproduce the bug
3. Fix the issue with minimal changes
4. Verify tests pass
5. Run linting

### Updating Dependencies

1. Check if dependency is for frontend, backend, or E2E tests
2. Update in the appropriate `package.json` file
3. Test thoroughly after updating
4. Update lockfiles (`package-lock.json`)
