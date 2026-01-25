# Deployment Instructions

## GitHub Actions Workflow Fixes ✅

The deployment workflows have been fixed to resolve the shell script syntax errors:

### Fixed Issues:
1. **deploy-hosting.yml**: Corrected YAML indentation for "Install Firebase Tools" step
2. **deploy-functions.yml**: Added missing Firebase CLI installation step

Both workflows now properly install the Firebase CLI before attempting deployment.

## Required Configuration: FIREBASE_TOKEN Secret

> **⚠️ ONE-TIME SETUP**: The `FIREBASE_TOKEN` secret only needs to be configured once per repository.

**To check if already configured**:
1. Go to your repository on GitHub
2. Navigate to: **Settings → Secrets and variables → Actions**
3. Look for `FIREBASE_TOKEN` in the list
4. If it exists, ✅ skip to [Pull Request Status](#pull-request-status) section

**If not configured yet**, follow the detailed setup instructions in [MANUAL_TASKS.md](./MANUAL_TASKS.md#firebase_token-secret-configuration).

**After configuration**:
1. Push a commit to the `main` branch
2. Go to **Actions** tab in your repository
3. Watch the deployment workflows run
4. Verify successful deployment to Firebase

## Pull Request Status

### PR #8: E2E Testing Framework ✅ Ready to Merge
**Status**: OPEN  
**Title**: Add E2E testing framework with Playwright and Google Workspace integration tests

**Summary**: Comprehensive E2E testing implementation with:
- Playwright framework setup
- 10 test scenarios covering authentication, dashboard, customers, campaigns, and Google Workspace integrations
- CI workflow integration
- Complete documentation in `e2e/README.md`
- Successfully merged with main branch

**Recommendation**: ✅ **MERGE** - This PR is ready for merge. All conflicts have been resolved, tests are comprehensive, and the implementation follows best practices.

### PR #6: Frontend-Backend Integration ⚠️ Review Needed
**Status**: OPEN  
**Title**: Wire Next.js frontend to Firebase Functions API endpoints

**Summary**: Complete frontend-backend integration with:
- Next.js 14 static export connecting to Firebase Functions
- Type-safe API client with error handling
- Tailwind CSS with Evolve brand colors
- All pages implemented (Dashboard, Customers, Communications, Feedback, etc.)

**Note**: PR #23 ("Verify PR #6 merge resolution and prepare production deployment") has been merged to main, incorporating the merge conflict resolution from PR #6.

**Recommendation**: 🔍 **REVIEW** - Check if PR #23 includes all changes from PR #6. If so, PR #6 can be closed. Otherwise, identify what's missing and either:
- Close PR #6 if fully superseded by PR #23
- Update PR #6 with remaining changes not in PR #23
- Document any intentional differences

### To Review PR #23:
Compare the changes in PR #6 with PR #23 to determine:
1. Are all API integrations from PR #6 present in PR #23?
2. Are all UI components from PR #6 present in PR #23?
3. Is the Tailwind CSS configuration the same?
4. Are there any features in PR #6 not in PR #23?

## Next Steps

1. ✅ **Configure FIREBASE_TOKEN secret** (follow instructions above)
2. ✅ **Merge PR #8** - E2E testing framework is ready
3. 🔍 **Review PR #6 vs PR #23** - Determine if PR #6 should be closed
4. 🚀 **Test deployments** - Push to main and verify workflows succeed

## Troubleshooting

### Deployment Workflow Fails with "FIREBASE_TOKEN not found"
- Ensure you've added the `FIREBASE_TOKEN` secret to GitHub repository settings
- Verify the secret name is exactly `FIREBASE_TOKEN` (case-sensitive)

### Firebase CLI Not Found
- This is now fixed in the updated workflows
- Both workflows install Firebase CLI before attempting deployment

### Permission Denied Errors
- Ensure your Firebase token has the correct permissions
- You may need to regenerate the token with `firebase login:ci`

## Additional Resources

- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Deployment](https://firebase.google.com/docs/hosting/deploying)
