# VelocityOS Frontend Integration - Testing Guide

This guide explains how to test the Next.js frontend integration with Firebase Functions API endpoints.

## Prerequisites

Before testing, ensure you have:

1. **Node.js 18+** installed
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
3. Dependencies installed in both directories

## Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd velocity-os-rebuilt
npm install

# Install Firebase Functions dependencies
cd ../functions
npm install
```

### 2. Configure Environment (Optional)

For local development, you can use the default configuration which points API calls to `/api`.

If you need to customize the API URL:

```bash
cd velocity-os-rebuilt
cp .env.local.example .env.local
# Edit .env.local if needed
```

## Running Locally

You'll need **two terminal windows** to run both the backend and frontend simultaneously.

### Terminal 1: Start Firebase Functions Emulator

```bash
cd functions
npm run serve
```

This will start the Firebase Functions emulator. You should see output like:

```
✔  functions[us-central1-api]: http function initialized (http://127.0.0.1:5001/your-project-id/us-central1/api).
```

**Note the API URL** - it will be something like `http://127.0.0.1:5001/velocityos-staging/us-central1/api`

### Terminal 2: Start Next.js Development Server

```bash
cd velocity-os-rebuilt
npm run dev
```

This will start the Next.js dev server on `http://localhost:3000`.

## Connecting Frontend to Emulator

When running locally with the Firebase emulator, you need to configure the Next.js app to proxy API requests to the emulator.

### Option 1: Update next.config.js (Recommended for Development)

Add rewrites to `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  
  // Development only: proxy API calls to Firebase emulator
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5001/velocityos-staging/us-central1/api/:path*',
      },
    ];
  },
}
```

### Option 2: Use Environment Variable

Set the API URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:5001/velocityos-staging/us-central1/api
```

**Note:** Replace `velocityos-staging` with your actual Firebase project ID from `.firebaserc`.

## Testing the Integration

Once both servers are running, test the following:

### 1. Dashboard Page

1. Visit `http://localhost:3000/dashboard`
2. **Expected behavior:**
   - Shows loading spinner initially
   - Displays analytics metrics (Total Customers, Active Campaigns, Revenue, etc.)
   - If API fails, shows error with retry button

### 2. Customers Page

1. Visit `http://localhost:3000/customers`
2. **Expected behavior:**
   - Displays list of existing customers (2 mock customers initially)
   - Click "Add Customer" to show the creation form
   - Fill in name, email, and optionally phone
   - Submit the form
   - See success message
   - New customer appears in the list

**Test cases:**
- ✓ Create customer with all fields
- ✓ Create customer without phone (optional field)
- ✓ Try to create customer with duplicate email (should show error)
- ✓ Try to create customer without required fields (should show validation error)

### 3. Communications Page

1. Visit `http://localhost:3000/communications`
2. **Expected behavior:**
   - Shows campaign creation form
   - Enter campaign name
   - Enter recipient emails (comma or newline separated)
   - Enter campaign message
   - Submit form
   - See success message

**Test cases:**
- ✓ Start campaign with multiple recipients
- ✓ Try invalid email format (should show validation error)
- ✓ Try empty fields (should show validation errors)

### 4. Feedback Page

1. Visit `http://localhost:3000/feedback`
2. **Expected behavior:**
   - Shows feedback form with star rating
   - Click stars to set rating (1-5)
   - Enter comment
   - Submit form
   - See success message
   - Form clears after submission

**Test cases:**
- ✓ Submit feedback with different ratings
- ✓ Try to submit without comment (should show validation error)

### 5. Error Handling

To test error states:

1. **Stop the Firebase emulator** (Ctrl+C in Terminal 1)
2. Try to load any page or submit any form
3. **Expected behavior:**
   - Error messages display
   - Retry buttons appear where appropriate
   - User-friendly error messages (not raw API errors)

## API Endpoints Summary

| Page | Endpoint | Method | Description |
|------|----------|--------|-------------|
| Dashboard | `/api/analytics/dashboard` | GET | Fetch analytics metrics |
| Customers | `/api/customer/list` | GET | List all customers |
| Customers | `/api/customer/create` | POST | Create new customer |
| Communications | `/api/campaign/start` | POST | Start a campaign |
| Feedback | `/api/voc/feedback` | POST | Submit feedback |

## Mock Data

The Firebase Functions include mock data:

- **2 pre-existing customers** (John Doe, Jane Smith)
- **Mock analytics data** (revenue, conversion rate, etc.)
- **In-memory storage** (data resets when emulator restarts)

## Troubleshooting

### "Failed to load dashboard" or other API errors

1. Check that Firebase emulator is running
2. Check the browser console for CORS errors
3. Verify the API URL is correct (check Terminal 1 output)
4. Try accessing the API directly: `http://127.0.0.1:5001/.../api/health`

### Next.js build fails

1. Make sure all dependencies are installed: `npm install`
2. Check for TypeScript errors: The build will show them
3. Verify `tsconfig.json` and `next.config.js` exist

### Port already in use

If port 3000 or 5001 is in use:

```bash
# For Next.js (change port)
PORT=3001 npm run dev

# For Firebase (emulator ports configured in firebase.json)
```

### CORS errors in browser

If you see CORS errors, the Firebase Functions include CORS headers. If still seeing issues:

1. Clear browser cache
2. Try in incognito mode
3. Check that rewrites in `next.config.js` or `NEXT_PUBLIC_API_URL` is set correctly

## Production Deployment

For production deployment:

1. The Next.js app exports static files to `out/`
2. Firebase Hosting serves the static files
3. API calls to `/api/**` are automatically routed to Cloud Functions via `firebase.json` rewrites
4. No environment variable needed (same-origin requests)

```bash
# Build frontend
cd velocity-os-rebuilt
npm run build

# Deploy to Firebase
cd ..
firebase deploy
```

## Notes

- Authentication is **not yet implemented** (coming in PR #6)
- The API client has placeholder comments for where auth headers will be added
- All endpoints currently work without authentication for development
- Mock data is stored in-memory and resets on emulator restart
- For production, replace mock data with Firestore database operations

## Support

If you encounter issues:

1. Check the Firebase emulator logs (Terminal 1)
2. Check the Next.js dev server logs (Terminal 2)
3. Check browser console for client-side errors
4. Verify all dependencies are installed with correct versions
