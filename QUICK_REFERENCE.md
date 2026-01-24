# VelocityOS Quick Reference

A one-page reference for common tasks and commands.

## 🚀 First Time Setup

```bash
# Clone and setup
git clone https://github.com/VidDazzleLLC/velocityos.git
cd velocityos
./scripts/setup.sh
```

## 💻 Development

### Start Local Server
```bash
npm start                    # Starts on http://localhost:3000
```

### Build for Production
```bash
# Frontend
cd velocity-os-rebuilt && npm run build && cd ..

# Backend
cd functions && npm run build && cd ..
```

### Run Tests
```bash
npm test                     # Root
cd velocity-os-rebuilt && npm test && cd ..   # Frontend
cd functions && npm test && cd ..             # Backend
```

### Linting
```bash
npm run lint                 # Root
cd velocity-os-rebuilt && npm run lint && cd ..   # Frontend
cd functions && npm run lint && cd ..             # Backend
```

## 🔐 Security

### Generate Secrets
```bash
./scripts/generate-secrets.sh
```

### Set Firebase Secrets
```bash
firebase functions:secrets:set JWT_SECRET --project default
firebase functions:secrets:set SESSION_SECRET --project default
```

## 🚢 Deployment

### Interactive Deploy
```bash
./scripts/deploy.sh
```

### Manual Deploy
```bash
# Staging
firebase deploy --project default

# Production
firebase deploy --project prod

# Hosting only
firebase deploy --only hosting --project default

# Functions only
firebase deploy --only functions --project default
```

## 🔧 Firebase Commands

### Login
```bash
firebase login
firebase login:ci            # Get CI token
```

### Project Management
```bash
firebase projects:list       # List all projects
firebase use default         # Switch to staging
firebase use prod            # Switch to production
```

### Emulators
```bash
firebase emulators:start     # Start all emulators
firebase emulators:start --only functions,hosting
```

### Logs
```bash
firebase functions:log       # View function logs
firebase functions:log --only api --limit 50
```

## 📁 Project Structure

```
velocityos/
├── velocity-os-rebuilt/     # Next.js frontend
│   ├── app/                 # Pages (App Router)
│   ├── components/          # React components
│   └── out/                 # Build output (git ignored)
├── functions/               # Firebase Cloud Functions
│   ├── src/                 # TypeScript source
│   └── lib/                 # Compiled JS (git ignored)
├── public/                  # Legacy HTML files
├── scripts/                 # Helper scripts
├── .github/workflows/       # CI/CD pipelines
├── server.js                # Local dev server
├── firebase.json            # Firebase config
├── .firebaserc              # Project aliases
└── .env                     # Environment vars (git ignored)
```

## 🌐 API Endpoints

### Local Development
- `http://localhost:3000/` - Login page
- `http://localhost:3000/dashboard` - Dashboard
- `http://localhost:3000/api/metrics` - Metrics API
- `http://localhost:3000/api/insights` - Insights API

### Production
- `https://[project-id].web.app/` - App
- `https://[project-id].web.app/api/*` - API

## 📝 Environment Variables

### Required
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=<generate-with-script>
SESSION_SECRET=<generate-with-script>
```

### Optional
```env
OPENAI_API_KEY=<your-key>
GEMINI_API_KEY=<your-key>
ANTHROPIC_API_KEY=<your-key>
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase CLI Not Found
```bash
npm install -g firebase-tools
```

### Deployment Fails
```bash
firebase login --reauth
firebase --debug deploy
```

### Clear Firebase Cache
```bash
rm -rf .firebase/
firebase use default
```

## 📚 Documentation

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Deployment guide
- **LAUNCH_CHECKLIST.md** - Pre-launch checklist
- **LAUNCH_STATUS.md** - Current launch status
- **FIREBASE_SETUP.md** - Firebase setup guide
- **scripts/README.md** - Scripts documentation

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com/
- **GitHub Actions**: https://github.com/VidDazzleLLC/velocityos/actions
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## ⌨️ Common Workflows

### Add New Page
1. Create `app/[page-name]/page.tsx`
2. Build: `cd velocity-os-rebuilt && npm run build`
3. Test locally: `npm start`

### Add New API Endpoint
1. Edit `functions/src/index.ts`
2. Build: `cd functions && npm run build`
3. Deploy: `./scripts/deploy.sh`

### Update Dependencies
```bash
# Check for updates
npm outdated
cd velocity-os-rebuilt && npm outdated
cd ../functions && npm outdated

# Update
npm update
cd velocity-os-rebuilt && npm update
cd ../functions && npm update
```

### View Production Logs
```bash
firebase functions:log --project prod --limit 100
```

### Emergency Rollback
```bash
# View deployment history
firebase hosting:channel:list --project prod

# Firebase automatically keeps previous versions
# Use Firebase Console to roll back
```

## 💡 Tips

- Use `./scripts/deploy.sh` for safer deployments
- Always test in staging before production
- Generate new secrets for each environment
- Monitor Firebase Console after deployments
- Set up billing alerts in Firebase Console
- Use Firebase emulators for local testing

---

**Quick Start**: `./scripts/setup.sh`  
**Deploy**: `./scripts/deploy.sh`  
**Help**: See DEPLOYMENT.md

© 2026 VidDazzle LLC | Apache 2.0 License
