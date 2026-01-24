# VelocityOS Firebase Authentication Setup

This document provides instructions for setting up Firebase Authentication for VelocityOS.

## Prerequisites

1. Firebase project created (see root `FIREBASE_SETUP.md`)
2. Firebase Authentication enabled with:
   - Email/Password sign-in method
   - Google sign-in provider

## Setup Instructions

### 1. Install Dependencies

```bash
# Frontend dependencies
cd velocity-os-rebuilt
npm install

# Functions dependencies
cd ../functions
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cd velocity-os-rebuilt
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Where to find these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project Settings
4. Under "Your apps" section, select your web app or create one
5. Copy the config values

### 3. Enable Authentication Providers

#### Email/Password:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Save

#### Google Sign-in:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Google"
3. Add your authorized domain (e.g., `localhost`, your production domain)
4. Save

### 4. Test Locally

**Terminal 1 - Start Firebase Functions Emulator:**
```bash
cd functions
npm run serve
```

**Terminal 2 - Start Next.js Development Server:**
```bash
cd velocity-os-rebuilt
npm run dev
```

Visit `http://localhost:3000/login` to test authentication.

## Features Implemented

### Authentication Flows

✅ **Sign-up with Email/Password**
- Email validation
- Password strength requirements (min 6 characters)
- Confirm password matching
- Success message and redirect to dashboard

✅ **Login with Email/Password**
- Email and password authentication
- Error handling for invalid credentials
- Redirect to dashboard on success

✅ **Google Sign-in**
- Popup-based OAuth flow
- Error handling for popup blocked/cancelled
- Automatic redirect to dashboard

✅ **Logout**
- Sign out from Firebase
- Clear authentication cookies
- Redirect to login page

### Protected Routes

The following routes are protected by middleware:
- `/dashboard` - Main dashboard
- `/customers` - Customer management
- `/communications` - Communications hub
- `/reports` - Reports and analytics
- `/settings` - Settings page

**Behavior:**
- Unauthenticated users → redirected to `/login`
- Authenticated users at `/login` → redirected to `/dashboard`

### Security Features

✅ **HTTP-only Cookies**
- ID tokens stored in HTTP-only cookies
- Not accessible to client-side JavaScript
- 5-day expiration

✅ **Token Verification**
- Frontend middleware validates tokens
- Backend API verifies tokens with Firebase Admin SDK
- Invalid/expired tokens return 401 Unauthorized

✅ **API Authorization**
- All API routes (except `/api/health`) require authentication
- Authorization header: `Bearer <firebase-id-token>`
- User info attached to `req.user` in API routes

## API Endpoints

### Public Endpoints

**Health Check:**
```bash
GET /api/health
Response: { status: 'ok', timestamp: '...', service: 'VelocityOS API' }
```

### Protected Endpoints (Require Auth)

**Get Current User:**
```bash
GET /api/user
Headers: Authorization: Bearer <token>
Response: { user: { uid: '...', email: '...', emailVerified: true } }
```

**Dashboard Data:**
```bash
GET /api/dashboard
Headers: Authorization: Bearer <token>
Response: { message: '...', user: '...', data: { stats: {...} } }
```

**Customers:**
```bash
GET /api/customers
Headers: Authorization: Bearer <token>
Response: { customers: [...] }

POST /api/customers
Headers: Authorization: Bearer <token>
Body: { name: '...', ... }
Response: { success: true, customer: {...} }
```

## Testing Guide

### 1. Sign-up Flow

1. Visit `http://localhost:3000/login`
2. Click "Don't have an account? Sign up"
3. Enter email and password (min 6 characters)
4. Confirm password
5. Click "Sign Up"
6. Verify redirect to `/dashboard`
7. Verify user info displayed

### 2. Google Sign-in

1. Visit `http://localhost:3000/login`
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Verify redirect to `/dashboard`

### 3. Protected Routes

1. Log out from dashboard
2. Try to visit `/dashboard` directly
3. Verify redirect to `/login`
4. Log in again
5. Verify redirect to `/dashboard`
6. Navigate to `/customers`, `/reports`, etc.
7. Verify access granted

### 4. Login Flow

1. Visit `/login` while logged in
2. Verify redirect to `/dashboard`
3. Log out
4. Visit `/login` and sign in
5. Verify redirect to `/dashboard`

### 5. API Authorization

**While logged in:**
1. Open DevTools → Network tab
2. Visit `/dashboard`
3. Check API calls include `Authorization: Bearer <token>` header
4. Verify API returns 200 OK

**While logged out:**
1. Try calling API directly (e.g., `/api/user`)
2. Verify 401 Unauthorized response

## File Structure

```
velocity-os-rebuilt/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── session/
│   │           └── route.ts          # Session management API
│   ├── login/
│   │   └── page.tsx                  # Login/signup page
│   ├── dashboard/
│   │   └── page.tsx                  # Protected dashboard
│   ├── customers/
│   │   └── page.tsx                  # Protected customers page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home (redirects to dashboard)
│   └── globals.css                   # Global styles
├── lib/
│   ├── firebase.ts                   # Firebase client SDK initialization
│   ├── auth.ts                       # Auth helper functions
│   └── api.ts                        # API client with auth headers
├── middleware.ts                     # Route protection middleware
├── .env.example                      # Environment variables template
└── package.json

functions/
├── middleware/
│   └── auth.js                       # Firebase Admin auth middleware
├── index.js                          # Express app with API routes
└── package.json
```

## Troubleshooting

### "Firebase is not initialized" error
- Check that `.env.local` exists and has correct values
- Restart the dev server after adding environment variables
- Ensure all `NEXT_PUBLIC_` prefixed variables are set

### Google sign-in popup blocked
- Allow popups for `localhost` in browser settings
- Try using `signInWithRedirect` instead of `signInWithPopup`

### 401 Unauthorized on API calls
- Check that user is logged in
- Verify token is being sent in Authorization header
- Check Firebase Admin SDK is initialized in functions

### Middleware not redirecting
- Clear browser cookies
- Check middleware matcher configuration
- Verify cookie name matches between frontend and middleware

### Build errors
- Run `npm install` in both `velocity-os-rebuilt` and `functions`
- Check TypeScript errors with `npm run build`
- Ensure all imports are correct

## Security Considerations

- **Never commit `.env.local`** - it contains sensitive API keys
- **Use HTTPS in production** - required for secure cookies
- **Enable email verification** - add email verification flow (TODO)
- **Implement rate limiting** - prevent brute force attacks (TODO)
- **Add CSRF protection** - for additional security (TODO)
- **Monitor auth logs** - check Firebase Console for suspicious activity

## Future Enhancements

- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Session timeout handling
- [ ] Remember me checkbox
- [ ] Social sign-in (Facebook, Apple, etc.)
- [ ] User profile management
- [ ] Role-based access control (RBAC)

## Support

For issues or questions:
- Check Firebase Console → Authentication for user data
- Review browser DevTools → Console for errors
- Check Firebase Functions logs: `firebase functions:log`
- See root `FIREBASE_SETUP.md` for project setup

## License

See root LICENSE file.
