#!/bin/bash

# VelocityOS Firebase Deployment Helper
# This script helps you deploy to Firebase with pre-deployment checks

set -e

echo "🚀 VelocityOS Firebase Deployment Helper"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed"
    echo ""
    echo "Install it with:"
    echo "  npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_warning "You are not logged in to Firebase"
    echo ""
    read -p "Login now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        firebase login
    else
        print_error "Cannot deploy without Firebase authentication"
        exit 1
    fi
fi

print_success "Firebase CLI authenticated"
echo ""

# Ask which environment to deploy to
echo "Select deployment target:"
echo "1) Staging (default)"
echo "2) Production (prod)"
echo ""
read -p "Enter choice [1-2]: " -n 1 -r
echo ""

if [[ $REPLY =~ ^2$ ]]; then
    PROJECT="prod"
    ENV_NAME="production"
    print_warning "You are about to deploy to PRODUCTION"
    echo ""
    read -p "Are you sure? (yes/no) " -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Deployment cancelled"
        exit 0
    fi
else
    PROJECT="default"
    ENV_NAME="staging"
fi

print_info "Deploying to: $ENV_NAME ($PROJECT)"
echo ""

# Pre-deployment checks
echo "Running pre-deployment checks..."
echo ""

# Check if builds are up to date
print_info "Checking frontend build..."
if [ ! -d "velocity-os-rebuilt/out" ] || [ ! -f "velocity-os-rebuilt/out/index.html" ]; then
    print_warning "Frontend not built or outdated"
    echo ""
    read -p "Build frontend now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd velocity-os-rebuilt
        npm run build
        cd ..
        print_success "Frontend built"
    else
        print_error "Frontend build required for deployment"
        exit 1
    fi
else
    print_success "Frontend build exists"
fi

print_info "Checking backend build..."
if [ ! -d "functions/lib" ] || [ ! -f "functions/lib/index.js" ]; then
    print_warning "Backend not built or outdated"
    echo ""
    read -p "Build backend now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd functions
        npm run build
        cd ..
        print_success "Backend built"
    else
        print_error "Backend build required for deployment"
        exit 1
    fi
else
    print_success "Backend build exists"
fi

# Check Firebase configuration
print_info "Validating Firebase configuration..."
if [ ! -f "firebase.json" ]; then
    print_error "firebase.json not found"
    exit 1
fi
print_success "firebase.json valid"

if [ ! -f ".firebaserc" ]; then
    print_error ".firebaserc not found"
    exit 1
fi
print_success ".firebaserc valid"

echo ""
echo "=========================================="
echo "Deployment Configuration:"
echo "=========================================="
echo "Environment: $ENV_NAME"
echo "Project: $PROJECT"
echo "Frontend: velocity-os-rebuilt/out"
echo "Backend: functions"
echo "=========================================="
echo ""

# Ask what to deploy
echo "What would you like to deploy?"
echo "1) Everything (hosting + functions)"
echo "2) Hosting only"
echo "3) Functions only"
echo ""
read -p "Enter choice [1-3]: " -n 1 -r
echo ""

case $REPLY in
    1)
        DEPLOY_TARGET="hosting,functions"
        ;;
    2)
        DEPLOY_TARGET="hosting"
        ;;
    3)
        DEPLOY_TARGET="functions"
        ;;
    *)
        DEPLOY_TARGET="hosting,functions"
        ;;
esac

print_info "Deploying: $DEPLOY_TARGET"
echo ""

# Final confirmation
read -p "Proceed with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy to Firebase
firebase deploy --only "$DEPLOY_TARGET" --project "$PROJECT"

# Check deployment status
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    print_success "Deployment successful!"
    echo "=========================================="
    echo ""
    
    # Get hosting URL
    if [[ $DEPLOY_TARGET == *"hosting"* ]]; then
        echo "🌐 Your app is live at:"
        if [ "$PROJECT" == "prod" ]; then
            # Get actual Firebase project ID from .firebaserc
            PROD_PROJECT=$(grep -A 1 '"prod"' .firebaserc | tail -n 1 | sed 's/.*: *"\(.*\)".*/\1/')
            echo "   https://$PROD_PROJECT.web.app"
            echo "   https://$PROD_PROJECT.firebaseapp.com"
        else
            # Get actual Firebase project ID from .firebaserc
            DEFAULT_PROJECT=$(grep -A 1 '"default"' .firebaserc | tail -n 1 | sed 's/.*: *"\(.*\)".*/\1/')
            echo "   https://$DEFAULT_PROJECT.web.app"
            echo "   https://$DEFAULT_PROJECT.firebaseapp.com"
        fi
        echo ""
    fi
    
    echo "📊 Next steps:"
    echo "1. Test your deployment"
    echo "2. Check Firebase Console for logs"
    echo "3. Monitor for errors"
    echo ""
else
    echo ""
    print_error "Deployment failed"
    echo ""
    echo "Troubleshooting tips:"
    echo "1. Check Firebase Console for error messages"
    echo "2. Verify your Firebase project permissions"
    echo "3. Run: firebase --debug deploy"
    echo ""
    exit 1
fi
