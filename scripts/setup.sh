#!/bin/bash

# VelocityOS Quick Setup Script
# This script helps you set up VelocityOS for the first time

set -e  # Exit on any error

echo "🚀 VelocityOS Quick Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
else
    NPM_VERSION=$(npm -v)
    print_success "npm installed: $NPM_VERSION"
fi

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI not installed"
    echo ""
    read -p "Install Firebase CLI globally? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g firebase-tools
        print_success "Firebase CLI installed"
    else
        print_warning "Skipping Firebase CLI installation (you'll need it for deployment)"
    fi
else
    print_success "Firebase CLI installed"
fi

echo ""
echo "================================"
echo "📦 Installing Dependencies"
echo "================================"
echo ""

# Install root dependencies
print_info "Installing root dependencies..."
npm install
print_success "Root dependencies installed"

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd velocity-os-rebuilt
npm install
cd ..
print_success "Frontend dependencies installed"

# Install backend dependencies
print_info "Installing backend dependencies..."
cd functions
npm install
cd ..
print_success "Backend dependencies installed"

echo ""
echo "================================"
echo "⚙️  Environment Configuration"
echo "================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    print_warning ".env file already exists"
    read -p "Overwrite with template? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        print_success ".env created from template"
    else
        print_info "Keeping existing .env file"
    fi
else
    cp .env.example .env
    print_success ".env created from template"
fi

# Generate secrets
echo ""
read -p "Generate secure secrets for JWT and Session? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -base64 32)
        SESSION_SECRET=$(openssl rand -base64 32)
        
        # Update .env file on macOS and Linux
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
            sed -i '' "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|" .env
        else
            # Linux
            sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
            sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|" .env
        fi
        
        print_success "Secrets generated and saved to .env"
    else
        print_warning "openssl not found, skipping secret generation"
        print_info "You can generate secrets later with: ./scripts/generate-secrets.sh"
    fi
else
    print_info "Skipping secret generation"
    print_info "You can generate secrets later with: ./scripts/generate-secrets.sh"
fi

echo ""
echo "================================"
echo "🏗️  Building Application"
echo "================================"
echo ""

# Build frontend
print_info "Building frontend..."
cd velocity-os-rebuilt
npm run build
cd ..
print_success "Frontend built successfully"

# Build backend
print_info "Building backend..."
cd functions
npm run build
cd ..
print_success "Backend built successfully"

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
print_success "VelocityOS is ready for development!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure your .env file with actual values"
echo "   - Add API keys for AI services (if using)"
echo "   - Update other configuration as needed"
echo ""
echo "2. Set up Firebase (for deployment):"
echo "   - Create Firebase projects (staging and production)"
echo "   - Run: firebase login"
echo "   - Update .firebaserc with your project IDs"
echo ""
echo "3. Start development:"
echo "   - Run: npm start"
echo "   - Visit: http://localhost:3000"
echo ""
echo "4. See DEPLOYMENT.md for deployment instructions"
echo "   See LAUNCH_CHECKLIST.md for pre-launch checklist"
echo ""
echo "🎉 Happy coding!"
echo ""
