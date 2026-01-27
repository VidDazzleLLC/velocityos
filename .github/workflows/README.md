# CI/CD Workflow Documentation

## ⚙️ Authentication Setup

**This repository uses Workload Identity Federation (WIF) for secure, keyless authentication to Google Cloud and Firebase.**

### What is Workload Identity Federation?

Workload Identity Federation allows GitHub Actions to authenticate directly with Google Cloud without storing any secrets or tokens. The authentication happens automatically using OpenID Connect (OIDC).

### Setup Status

✅ **Already configured!** The following components are in place:

1. **Workload Identity Pool**: `github-actions` (configured in Google Cloud)
2. **Workload Identity Provider**: `github` (linked to this repository)
3. **Service Account**: `firebase-adminsdk-f6svc@velocityos-staging.iam.gserviceaccount.com`
4. **Permissions**: Service account has Firebase Admin and Hosting deployment access

### No Secrets Required! 🎉

Unlike traditional approaches, you do **NOT** need to:
- Generate Firebase tokens
- Store `FIREBASE_TOKEN` in GitHub Secrets
- Manage or rotate credentials manually

Authentication happens automatically through WIF in the workflow.

---

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

---

## Deployment Workflows

### Deploy Hosting

Automatically deploys the frontend to Firebase Hosting when changes are pushed to `main`.

**Authentication**: Uses Workload Identity Federation (no tokens needed)

### Deploy Functions  

Automatically deploys Firebase Cloud Functions when changes are pushed to `main`.

**Authentication**: Uses Workload Identity Federation (no tokens needed)

### Deploy to Production

Manual workflow for deploying to production environment.

**Authentication**: Uses Workload Identity Federation (no tokens needed)

---

## How It Works

### Authentication Flow

1. GitHub Actions workflow starts
2. Workflow requests an OIDC token from GitHub
3. Google Cloud validates the token against the Workload Identity Pool
4. If valid, grants temporary credentials to the service account
5. Workflow uses credentials to deploy to Firebase

### Example Workflow Step

```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: 'projects/1033383212128/locations/global/workloadIdentityPools/github-actions/providers/github'
    service_account: 'firebase-adminsdk-f6svc@velocityos-staging.iam.gserviceaccount.com'
```

That's it! No secrets, no tokens to manage.

---

## Troubleshooting

### Authentication Errors

If you see `Unable to acquire impersonated credentials`, check:

1. **Service account email** is correct in workflow
2. **Workload Identity Pool** principal has Workload Identity User role
3. **Repository name** matches the one configured in WIF

### Deployment Failures

If deployment fails after authentication:

1. Verify the service account has necessary Firebase roles
2. Check Firebase project permissions
3. Review workflow logs for specific error messages

---

## Additional Resources

- [Workload Identity Federation Documentation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)


---

_Last updated: Testing WIF deployment with Service Account Token Creator role_
