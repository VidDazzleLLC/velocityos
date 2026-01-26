# Manual Tasks Required

This document lists tasks that require manual intervention and cannot be completed via code changes.

## GitHub Repository Configuration

### FIREBASE_TOKEN Secret Configuration

**Status**: ⚠️ **REQUIRED** - Deployment workflows will fail without this secret

> **⚠️ ONE-TIME SETUP**: This configuration only needs to be done **once**. If you've already added the `FIREBASE_TOKEN` secret to your GitHub repository, you can skip this section.

The deployment workflows (`deploy-hosting.yml` and `deploy-functions.yml`) require a `FIREBASE_TOKEN` secret to be configured in the GitHub repository settings.

**To verify if already configured**:
1. Go to your GitHub repository
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Check if `FIREBASE_TOKEN` is listed under "Repository secrets"
4. If it exists, ✅ you're done! If not, follow the steps below.

**Steps to configure (first time only)**:
1. Generate the token locally:
   ```bash
   firebase login:ci
   ```
2. Copy the token from the terminal output
3. Navigate to: **GitHub Repository → Settings → Secrets and variables → Actions**
4. Click **"New repository secret"**
5. Name: `FIREBASE_TOKEN`
6. Value: Paste the token from step 2
7. Click **"Add secret"**

**When to regenerate**:
- Only regenerate if the token expires or is compromised
- See [SECURITY_REMEDIATION.md](./SECURITY_REMEDIATION.md) for token rotation procedures

## Pull Request Management

### PR #8: E2E Testing Framework

**Status**: ✅ Ready for review and merge

**Description**: Adds comprehensive E2E testing framework with Playwright and Google Workspace integration tests

**Link**: https://github.com/VidDazzleLLC/velocityos/pull/8

**Recommendation**: 
- Review the PR to ensure E2E tests align with project requirements
- Verify that the Google Workspace integration tests are appropriate
- Merge when satisfied with the implementation

**Actions Required**:
- [ ] Review PR #8
- [ ] Approve PR #8 (if satisfied)
- [ ] Merge PR #8 to main branch

### PR #6: Wire Next.js Frontend to API Endpoints

**Status**: ⚠️ Needs closure or update - Changes already incorporated

**Description**: Implements complete frontend-backend integration for VelocityOS with Next.js 14

**Link**: https://github.com/VidDazzleLLC/velocityos/pull/6

**Note**: According to PR #23 (which was merged), the changes from PR #6 have already been incorporated into the main branch. This PR is now redundant and should either be:
1. Closed as "incorporated via PR #23", or
2. Updated to reflect only remaining work (if any)

**Verification**: PR #23 was merged with the title "Verify PR #6 merge resolution and prepare production deployment", which indicates it incorporated PR #6's changes.

**Actions Required**:
- [ ] Verify that all changes from PR #6 are present in main branch
- [ ] Close PR #6 with a note that changes were incorporated via PR #23, or
- [ ] Identify any remaining changes from PR #6 that still need to be merged

## Summary

### Immediate Actions Needed
1. **Configure FIREBASE_TOKEN secret** in GitHub repository settings (required for deployments)
2. **Review and merge PR #8** for E2E testing framework
3. **Close or update PR #6** since its changes were incorporated via PR #23

### Verification Steps
After completing the above tasks:
1. Verify deployment workflows run successfully on push to main
2. Verify E2E tests run successfully in CI after merging PR #8
3. Clean up any stale branches from closed PRs

---

**Last Updated**: 2026-01-25
