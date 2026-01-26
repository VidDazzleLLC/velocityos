# VelocityOS Backend Setup Guide

This guide will walk you through setting up the VelocityOS backend with all required services.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Google Cloud Project with Firebase enabled
- Gemini API key from Google AI Studio

---

## 1. Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the wizard to create a new project
4. Enable Blaze (pay-as-you-go) plan for Cloud Functions

### Initialize Firebase in Your Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select Functions, Firestore, Hosting)
firebase init

# Select your project
firebase use --add
```

---

## 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

---

## 3. Obtain API Keys

### Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

### Google OAuth Credentials (for Workspace Integration)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure consent screen if prompted
6. Select "Web application" as application type
7. Add authorized redirect URIs
8. Copy Client ID and Client Secret

---

## 4. Configure Environment Variables

### Local Development

Create `.env` file in the root directory:

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your keys
```

Example `.env`:
```env
# Gemini AI
GEMINI_API_KEY=your_actual_gemini_key_here

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
```

### Firebase Functions Configuration

For production, set environment variables in Firebase Functions:

```bash
# Set Gemini API key
firebase functions:config:set gemini.api_key="your_gemini_api_key"

# Set Google OAuth credentials
firebase functions:config:set google.oauth_client_id="your_client_id"
firebase functions:config:set google.oauth_client_secret="your_client_secret"

# View all config
firebase functions:config:get
```

To use these in your code:
```typescript
const geminiKey = functions.config().gemini.api_key;
const clientId = functions.config().google.oauth_client_id;
```

---

## 5. Firestore Setup

### Create Firestore Database

1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Select location (choose closest to your users)
4. Start in production mode (security rules will be deployed)

### Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### Create Required Indexes

Deploy composite indexes:

```bash
firebase deploy --only firestore:indexes
```

The indexes are defined in `firestore.indexes.json`.

---

## 6. Build and Test Locally

### Build TypeScript

```bash
cd functions
npm run build
```

### Run Firebase Emulators

```bash
# Start all emulators (Functions, Firestore, Auth)
firebase emulators:start

# Or start only Functions emulator
cd functions
npm run serve
```

The API will be available at:
```
http://localhost:5001/your-project-id/us-central1/api
```

### Test Endpoints

```bash
# Health check
curl http://localhost:5001/your-project-id/us-central1/api/health

# Create customer
curl -X POST http://localhost:5001/your-project-id/us-central1/api/customer/create \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "name": "Test Customer",
    "email": "test@example.com",
    "status": "lead"
  }'

# Get analytics dashboard
curl http://localhost:5001/your-project-id/us-central1/api/analytics/dashboard \
  -H "x-user-id: test-user"
```

---

## 7. Deploy to Production

### Deploy All Functions

```bash
# Deploy everything
firebase deploy

# Or deploy only functions
firebase deploy --only functions
```

### Deploy Specific Functions

```bash
# Deploy only the API function
firebase deploy --only functions:api

# Deploy only background jobs
firebase deploy --only functions:syncGmail,functions:syncCalendar
```

### View Deployment Info

```bash
# Get function URLs
firebase functions:list

# View logs
firebase functions:log
```

---

## 8. Enable Google Workspace APIs

For background sync jobs to work, enable the following APIs in Google Cloud Console:

1. Go to [API Library](https://console.cloud.google.com/apis/library)
2. Enable these APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API
   - People API (Contacts)

### Set Up OAuth Scopes

Add these scopes in your OAuth consent screen:

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/contacts.readonly
```

---

## 9. Monitoring and Logging

### View Logs in Console

1. Firebase Console > Functions > Logs
2. Or use CLI: `firebase functions:log`

### Set Up Monitoring

1. Firebase Console > Functions > Dashboard
2. Monitor:
   - Invocations
   - Execution time
   - Memory usage
   - Error rate

### Set Up Alerts

1. Cloud Console > Monitoring > Alerting
2. Create alerts for:
   - High error rate
   - Function execution failures
   - Budget alerts

---

## 10. Testing Checklist

After deployment, verify:

- [ ] Health endpoint returns 200
- [ ] Can create customers
- [ ] Can list customers with pagination
- [ ] Feedback submission works
- [ ] Gemini AI sentiment analysis works
- [ ] Campaign creation works
- [ ] Analytics dashboard returns data
- [ ] Rate limiting works (test with 100+ requests)
- [ ] Error handling works (test invalid inputs)
- [ ] Logs appear in Firebase Console

---

## 11. Scheduled Functions Setup

Scheduled functions (background jobs) require Cloud Scheduler API:

```bash
# Enable Cloud Scheduler API
gcloud services enable cloudscheduler.googleapis.com --project=your-project-id
```

The following functions will run automatically:
- `syncGmail`: Every 5 minutes
- `syncCalendar`: Every 10 minutes
- `syncDrive`: Every 30 minutes
- `syncContacts`: Every 24 hours

View scheduled jobs:
```bash
gcloud scheduler jobs list --project=your-project-id
```

---

## 12. Database Initialization (Optional)

To seed the database with initial data:

### Create Test Users

```bash
# Use Firebase Admin SDK or Firebase Console
# Navigate to: Authentication > Users > Add user
```

### Create Sample Data

Use the API endpoints or Firestore Console to add:
- Sample customers
- Sample analytics events
- Sample feedback

---

## 13. Security Best Practices

1. **API Keys**: Never commit API keys to Git
2. **CORS**: Configure CORS for production domains only
3. **Rate Limiting**: Adjust limits based on usage patterns
4. **Firestore Rules**: Review and update security rules regularly
5. **OAuth Tokens**: Store securely, rotate regularly
6. **HTTPS Only**: All production endpoints use HTTPS
7. **Input Validation**: All inputs validated with Zod schemas

---

## 14. Cost Optimization

### Firestore
- Use composite indexes wisely
- Implement pagination to reduce reads
- Cache frequently accessed data

### Cloud Functions
- Set appropriate memory limits
- Set max instances to prevent runaway costs
- Use scheduled functions sparingly

### Gemini AI
- Cache AI responses when possible
- Implement fallback logic for AI failures
- Monitor API usage

---

## 15. Troubleshooting

### Common Issues

**Issue**: Functions deployment fails
```bash
# Solution: Check Node.js version
node --version  # Should be 18+

# Verify package.json engines field
cd functions
cat package.json | grep engines
```

**Issue**: CORS errors
```bash
# Solution: Update CORS configuration in index.ts
# Change: cors({origin: true})
# To: cors({origin: 'https://yourdomain.com'})
```

**Issue**: Firestore permission denied
```bash
# Solution: Check security rules
firebase deploy --only firestore:rules
```

**Issue**: Environment variables not working
```bash
# Solution: Verify config
firebase functions:config:get

# Re-deploy after config changes
firebase deploy --only functions
```

**Issue**: Scheduled functions not running
```bash
# Enable Cloud Scheduler API
gcloud services enable cloudscheduler.googleapis.com

# Check job status
gcloud scheduler jobs list
```

---

## 16. Development Workflow

### Recommended Workflow

1. Make changes to `functions/src/index.ts`
2. Build: `npm run build`
3. Lint: `npm run lint`
4. Test locally: `npm run serve`
5. Test endpoints with curl/Postman
6. Commit changes
7. Deploy: `firebase deploy --only functions`

### Quick Commands

```bash
# Build, lint, and test
cd functions
npm run build && npm run lint && npm run serve

# Watch for changes (in separate terminal)
npm run build -- --watch
```

---

## 17. Next Steps

After basic setup:

1. **Implement OAuth Flow**: Add user authentication for Workspace access
2. **Add Tests**: Create unit and integration tests
3. **Set Up CI/CD**: Automate deployment with GitHub Actions
4. **Add Caching**: Implement Redis for performance
5. **Add Metrics**: Custom metrics for business insights
6. **Documentation**: Keep API docs updated
7. **Monitoring**: Set up advanced monitoring and alerting

---

## Support and Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Google Workspace APIs**: https://developers.google.com/workspace
- **Project Docs**: See `DATABASE_SCHEMA.md` and `API_DOCUMENTATION.md`

---

## Quick Reference

```bash
# Install dependencies
npm install && cd functions && npm install && cd ..

# Set environment variables
firebase functions:config:set gemini.api_key="YOUR_KEY"

# Test locally
firebase emulators:start

# Deploy to production
firebase deploy --only functions

# View logs
firebase functions:log --limit 50

# Check function status
firebase functions:list
```
