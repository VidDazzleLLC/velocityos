# VelocityOS

VelocityOS is a next‑gen AI business OS that automates routine work.

## Project Structure

- **velocity-os-rebuilt/** - Next.js 14 frontend with TypeScript and Tailwind CSS
- **functions/** - Firebase Cloud Functions for API backend
- **public/** - Static assets

## Features

✅ **Firebase Authentication**
- Email/password sign-up and login
- Google OAuth sign-in
- Protected routes with middleware
- HTTP-only cookie-based sessions
- Token verification in API gateway

✅ **Firebase Hosting & Functions**
- Static site hosting with Next.js export
- API gateway with Express in Cloud Functions
- Automatic API routing (`/api/**` → Cloud Functions)

## Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project (see `FIREBASE_SETUP.md`)

### Setup

1. **Clone and install dependencies:**
   ```bash
   # Frontend
   cd velocity-os-rebuilt
   npm install
   
   # Functions
   cd ../functions
   npm install
   ```

2. **Configure Firebase:**
   ```bash
   # Copy environment template
   cd velocity-os-rebuilt
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

3. **Run locally:**
   ```bash
   # Terminal 1: Functions emulator
   cd functions
   npm run serve
   
   # Terminal 2: Next.js dev server
   cd velocity-os-rebuilt
   npm run dev
   ```

4. **Visit:** `http://localhost:3000`

## Documentation

- **[Firebase Setup Guide](FIREBASE_SETUP.md)** - Complete Firebase configuration
- **[Authentication Guide](velocity-os-rebuilt/README.md)** - Auth implementation details
- **[API Documentation](velocity-os-rebuilt/README.md#api-endpoints)** - API endpoints and usage

## Architecture

```
┌─────────────────────────────────────────┐
│     Firebase Hosting                    │
│  (Next.js Static Export - /out)         │
│                                         │
│  Routes:                                │
│  • /**  → Static pages                  │
│  • /api/** → Cloud Function "api"       │
└─────────────────────────────────────────┘
                  |
                  ↓
┌─────────────────────────────────────────┐
│     Cloud Functions                     │
│  • Authentication middleware            │
│  • Express API gateway                  │
│  • Protected endpoints                  │
└─────────────────────────────────────────┘
                  |
                  ↓
┌─────────────────────────────────────────┐
│     Firebase Services                   │
│  • Authentication (Email, Google)       │
│  • Firestore (coming soon)              │
│  • Cloud Storage (coming soon)          │
└─────────────────────────────────────────┘
```

## Development

### Build
```bash
cd velocity-os-rebuilt
npm run build
npm run export  # Creates static export in /out
```

### Deploy
```bash
# Deploy to staging
firebase deploy --project default

# Deploy to production
firebase deploy --project prod
```

### Test
```bash
# Frontend
cd velocity-os-rebuilt
npm test

# Functions
cd functions
npm test
```

## License

See [LICENSE](LICENSE) file for details.

