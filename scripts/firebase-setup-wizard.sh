#!/bin/bash

# VelocityOS Firebase Setup Wizard
# This interactive script guides you through Firebase setup step-by-step

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
FIRE="🔥"
STAR="⭐"
GEAR="⚙️"
LOCK="🔐"

print_header() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}${CHECK} $1${NC}"; }
print_error() { echo -e "${RED}${CROSS} $1${NC}"; }
print_warning() { echo -e "${YELLOW}${WARNING} $1${NC}"; }
print_info() { echo -e "${BLUE}${INFO} $1${NC}"; }

print_step() {
    echo ""
    echo -e "${MAGENTA}${GEAR} Step $1: $2${NC}"
    echo ""
}

# Welcome message
clear
print_header "${ROCKET} VelocityOS Firebase Setup Wizard"
echo -e "${CYAN}This wizard will guide you through setting up Firebase for VelocityOS.${NC}"
echo -e "${CYAN}The setup includes:${NC}"
echo -e "  ${CHECK} Firebase CLI installation"
echo -e "  ${CHECK} Firebase project configuration"
echo -e "  ${CHECK} Environment variables setup"
echo -e "  ${CHECK} Secret generation"
echo -e "  ${CHECK} GitHub Actions configuration"
echo ""
read -p "Press Enter to begin..."

# Step 1: Check Node.js
print_step "1/8" "Checking Prerequisites"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo ""
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
else
    NPM_VERSION=$(npm -v)
    print_success "npm installed: $NPM_VERSION"
fi

# Step 2: Install Firebase CLI
print_step "2/8" "Firebase CLI Setup"

if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI not found"
    echo ""
    read -p "Install Firebase CLI globally? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Firebase CLI..."
        npm install -g firebase-tools
        print_success "Firebase CLI installed"
    else
        print_error "Firebase CLI is required to continue"
        exit 1
    fi
else
    FIREBASE_VERSION=$(firebase --version)
    print_success "Firebase CLI installed: $FIREBASE_VERSION"
fi

# Step 3: Firebase Login
print_step "3/8" "Firebase Authentication"

if firebase projects:list &> /dev/null; then
    print_success "Already logged into Firebase"
else
    print_warning "Not logged into Firebase"
    echo ""
    echo "This will open your browser to authenticate with Google."
    read -p "Login now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        firebase login
        print_success "Logged into Firebase"
    else
        print_error "Firebase authentication is required"
        exit 1
    fi
fi

# Step 4: Project Configuration
print_step "4/8" "Firebase Project Configuration"

echo "Now let's configure your Firebase projects."
echo ""
echo "${FIRE} You need TWO Firebase projects:"
echo "  1. Staging (for development/testing)"
echo "  2. Production (for live app)"
echo ""
echo "If you haven't created them yet:"
echo "  ${BLUE}${INFO} Go to: https://console.firebase.google.com/${NC}"
echo "  ${BLUE}${INFO} Click 'Add project' or 'Create a project'${NC}"
echo "  ${BLUE}${INFO} Create projects named 'velocityos-staging' and 'velocityos-production'${NC}"
echo ""
read -p "Have you created both Firebase projects? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Please create Firebase projects first, then run this wizard again"
    echo ""
    echo "Steps to create projects:"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Click 'Add project'"
    echo "3. Create 'velocityos-staging'"
    echo "4. Create 'velocityos-production'"
    echo "5. For each project:"
    echo "   - Enable Firebase Hosting"
    echo "   - Enable Cloud Functions (requires Blaze plan)"
    echo "   - Create Firestore Database"
    echo "   - Enable Authentication (Email/Password)"
    exit 0
fi

# List available projects
echo ""
echo "Your Firebase projects:"
firebase projects:list

echo ""
echo "Enter your Firebase Project IDs:"
echo "(These should match the Project ID shown in Firebase Console, not the project name)"
echo ""

read -p "Staging Project ID: " STAGING_PROJECT_ID
read -p "Production Project ID: " PRODUCTION_PROJECT_ID

# Update .firebaserc
echo ""
print_info "Updating .firebaserc..."

cat > .firebaserc << EOF
{
  "projects": {
    "default": "$STAGING_PROJECT_ID",
    "prod": "$PRODUCTION_PROJECT_ID"
  }
}
EOF

print_success ".firebaserc updated with your project IDs"

# Verify projects
echo ""
print_info "Verifying project configuration..."
firebase use default
print_success "Default project set to: $STAGING_PROJECT_ID"

# Step 5: Generate Secrets
print_step "5/8" "Secret Generation"

echo "Generating secure secrets for JWT and Session..."
echo ""

if command -v openssl &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 32)
    SESSION_SECRET=$(openssl rand -base64 32)
    
    print_success "Secrets generated successfully"
    echo ""
    echo "${LOCK} Your generated secrets:"
    echo "══════════════════════════════════════"
    echo "JWT_SECRET=$JWT_SECRET"
    echo "SESSION_SECRET=$SESSION_SECRET"
    echo "══════════════════════════════════════"
    echo ""
    print_warning "SAVE THESE SECRETS! You'll need them in the next step."
    echo ""
    read -p "Press Enter when you've saved these values..."
else
    print_error "openssl not found - cannot generate secrets"
    echo "Please install openssl or generate secrets manually"
    exit 1
fi

# Step 6: Configure Firebase Secrets
print_step "6/8" "Firebase Function Secrets Configuration"

echo "Now we'll set up secrets for Cloud Functions."
echo ""
echo "We'll configure secrets for the STAGING environment first."
echo "You can repeat this process for production later."
echo ""

read -p "Configure secrets for staging now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_info "Setting JWT_SECRET for staging..."
    echo "$JWT_SECRET" | firebase functions:secrets:set JWT_SECRET --project default --force
    
    print_info "Setting SESSION_SECRET for staging..."
    echo "$SESSION_SECRET" | firebase functions:secrets:set SESSION_SECRET --project default --force
    
    print_success "Required secrets configured for staging"
    
    echo ""
    read -p "Do you have a GEMINI_API_KEY for AI features? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Enter your GEMINI_API_KEY: " GEMINI_KEY
        echo "$GEMINI_KEY" | firebase functions:secrets:set GEMINI_API_KEY --project default --force
        print_success "GEMINI_API_KEY configured"
    else
        print_info "Skipping GEMINI_API_KEY (you can add it later)"
    fi
else
    print_warning "Skipping secret configuration"
    echo "You can configure secrets later with:"
    echo "  firebase functions:secrets:set JWT_SECRET --project default"
    echo "  firebase functions:secrets:set SESSION_SECRET --project default"
fi

# Step 7: Build Application
print_step "7/8" "Building Application"

echo "Building frontend and backend..."
echo ""

# Build frontend
if [ -d "velocity-os-rebuilt" ]; then
    print_info "Building frontend (Next.js)..."
    cd velocity-os-rebuilt
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        npm install
    fi
    
    npm run build
    cd ..
    print_success "Frontend built successfully"
else
    print_warning "velocity-os-rebuilt directory not found, skipping frontend build"
fi

# Build backend
if [ -d "functions" ]; then
    print_info "Building backend (Cloud Functions)..."
    cd functions
    
    if [ ! -d "node_modules" ]; then
        print_info "Installing backend dependencies..."
        npm install
    fi
    
    npm run build
    cd ..
    print_success "Backend built successfully"
else
    print_warning "functions directory not found, skipping backend build"
fi

# Step 8: GitHub Actions Setup
print_step "8/8" "GitHub Actions Configuration"

echo "To enable automatic deployments via GitHub Actions, you need to:"
echo ""
echo "1. Generate a Firebase CI token"
echo "2. Add it to GitHub repository secrets"
echo ""
read -p "Generate Firebase CI token now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_info "Generating Firebase CI token..."
    echo ""
    echo "${WARNING} IMPORTANT: Copy the token that appears below!"
    echo ""
    firebase login:ci
    echo ""
    print_success "Token generated"
    echo ""
    echo "Next steps for GitHub Actions:"
    echo "1. Go to: https://github.com/VidDazzleLLC/velocityos/settings/secrets/actions"
    echo "2. Click 'New repository secret'"
    echo "3. Name: FIREBASE_TOKEN"
    echo "4. Value: Paste the token from above"
    echo "5. Click 'Add secret'"
    echo ""
    read -p "Press Enter when you've added the secret to GitHub..."
else
    print_info "Skipping CI token generation"
    echo ""
    echo "You can generate it later with:"
    echo "  firebase login:ci"
fi

# Success!
print_header "${STAR} Setup Complete! ${STAR}"

echo -e "${GREEN}Congratulations! Firebase setup is complete.${NC}"
echo ""
echo "${ROCKET} You can now deploy VelocityOS:"
echo ""
echo "  ${CYAN}1. Deploy to staging:${NC}"
echo "     ./scripts/deploy.sh"
echo ""
echo "  ${CYAN}2. Or deploy manually:${NC}"
echo "     firebase deploy --project default"
echo ""
echo "${INFO} Your Firebase URLs will be:"
echo "  Staging: https://$STAGING_PROJECT_ID.web.app"
echo "  Production: https://$PRODUCTION_PROJECT_ID.web.app"
echo ""
echo "${STAR} Next steps:"
echo "  ${CHECK} Deploy to staging and test"
echo "  ${CHECK} Configure production secrets"
echo "  ${CHECK} Deploy to production"
echo "  ${CHECK} Set up custom domain (optional)"
echo ""
echo "For detailed deployment instructions, see:"
echo "  ${BLUE}FIREBASE_DEPLOYMENT_COMPLETE.md${NC}"
echo ""
print_success "Happy deploying! ${ROCKET}"
echo ""
