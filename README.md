# VelocityOS

> A next-generation AI-powered Business Operating System that automates routine work and streamlines business operations.

[![CI](https://github.com/VidDazzleLLC/velocityos/workflows/CI/badge.svg)](https://github.com/VidDazzleLLC/velocityos/actions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## Overview

VelocityOS is an intelligent business automation platform that combines AI capabilities with modern web technologies to help businesses automate routine tasks, manage customer relationships, and gain actionable insights from their data.

### Key Features

- 🤖 **AI-Powered Automation** - Intelligent task automation and workflow management
- 📊 **Business Analytics** - Real-time metrics and insights dashboard
- 👥 **Customer Management** - Comprehensive CRM capabilities
- 💬 **Communications Hub** - Unified messaging and customer interactions
- 📈 **Reports & Analytics** - Detailed business intelligence and reporting
- ⚙️ **Settings & Configuration** - Flexible system customization

## Architecture

VelocityOS is built with a modern, scalable architecture:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS (Static Export)
- **Backend**: Firebase Cloud Functions with Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting with CDN
- **CI/CD**: GitHub Actions

```
┌─────────────────────────────────────────┐
│     Firebase Hosting                    │
│  (Next.js Static Export)                │
│                                         │
│  Routes:                                │
│  • /**  → Static HTML/JS                │
│  • /api/** → Cloud Function "api"       │
└─────────────────────────────────────────┘
                   |
                   ↓
┌─────────────────────────────────────────┐
│     Cloud Functions (Express API)       │
│  • /api/metrics                         │
│  • /api/insights                        │
│  • /api/health                          │
└─────────────────────────────────────────┘
                   |
                   ↓
┌─────────────────────────────────────────┐
│     External Services                   │
│  • Gemini AI / OpenAI                   │
│  • Firebase Firestore                   │
│  • Firebase Authentication              │
└─────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VidDazzleLLC/velocityos.git
   cd velocityos
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Frontend dependencies
   cd velocity-os-rebuilt
   npm install
   cd ..
   
   # Backend dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run locally**
   ```bash
   # Start the development server
   npm start
   # Visit http://localhost:3000
   ```

## Development

### Project Structure

```
velocityos/
├── velocity-os-rebuilt/    # Next.js frontend application
│   ├── app/                # Next.js 14 App Router pages
│   ├── components/         # Reusable React components
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── functions/              # Firebase Cloud Functions
│   ├── src/                # TypeScript source code
│   │   └── index.ts        # Main API entry point
│   └── package.json        # Backend dependencies
├── public/                 # Legacy HTML files (for reference)
├── .github/workflows/      # CI/CD pipeline configurations
├── server.js               # Local development Express server
├── firebase.json           # Firebase configuration
├── .firebaserc             # Firebase project aliases
└── package.json            # Root package configuration
```

### Local Development Workflow

**Frontend Development**
```bash
cd velocity-os-rebuilt
npm run dev         # Start Next.js dev server on port 3000
npm run build       # Build for production
npm run lint        # Run ESLint
```

**Backend Development**
```bash
cd functions
npm run build       # Compile TypeScript
npm run serve       # Start Firebase emulators
npm run lint        # Run ESLint
```

**Full Stack Testing**
```bash
# From root directory
npm start           # Runs Express server with both frontend and API
```

### Firebase Emulator Suite

Test Firebase services locally:

```bash
firebase emulators:start
```

This starts:
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Hosting: http://localhost:5000

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deploy

```bash
# Deploy to staging
firebase deploy --project default

# Deploy to production
firebase deploy --project prod
```

### Automated Deployment

Push to `main` branch triggers automatic deployment to staging via GitHub Actions.

## Testing

```bash
# Run all tests
npm test                              # Root tests
cd velocity-os-rebuilt && npm test   # Frontend tests
cd functions && npm test              # Backend tests
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `JWT_SECRET` | JWT token secret | Yes (production) |
| `SESSION_SECRET` | Session secret | Yes (production) |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `GEMINI_API_KEY` | Google Gemini API key | No |

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- TypeScript for all new code
- ESLint for code quality
- Follow Next.js and Firebase best practices
- Write meaningful commit messages
- Add tests for new features

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **CI**: Runs on all PRs and commits to main/develop
  - Builds all components (root, frontend, backend)
  - Runs linting and tests
  - Validates Firebase configuration
  
- **Deploy Hosting**: Deploys frontend to Firebase Hosting
- **Deploy Functions**: Deploys backend API to Cloud Functions

See [.github/workflows/README.md](.github/workflows/README.md) for details.

## Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [Firebase Setup](FIREBASE_SETUP.md) - Firebase configuration guide
- [Workflow Guide](.github/workflows/README.md) - CI/CD documentation

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change port in .env file
PORT=3001
```

**Firebase CLI not found**
```bash
npm install -g firebase-tools
```

**Build fails**
```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm install
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting tips.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: React 18

### Backend
- **Runtime**: Node.js 18
- **Functions**: Firebase Cloud Functions
- **Framework**: Express.js
- **Language**: TypeScript

### Infrastructure
- **Hosting**: Firebase Hosting
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **CI/CD**: GitHub Actions

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/VidDazzleLLC/velocityos/issues)
- **Email**: support@viddazzle.com

## Roadmap

- [ ] Advanced AI workflow automation
- [ ] Multi-tenant support
- [ ] Real-time collaboration features
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Integration marketplace
- [ ] Voice and video communications
- [ ] Advanced CRM features

## Acknowledgments

Built with ❤️ by [VidDazzle LLC](https://viddazzle.com)

---

**VelocityOS** - Accelerate your business operations with AI-powered automation.
