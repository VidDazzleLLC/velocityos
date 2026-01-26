#!/bin/bash

# VelocityOS Launch Script
# Simple script to launch VelocityOS locally

set -e  # Exit on any error

echo "🚀 Launching VelocityOS..."
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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Dependencies not installed"
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found"
    if [ -f .env.example ]; then
        print_info "Creating .env from .env.example..."
        cp .env.example .env
        print_success ".env file created"
        print_warning "Please update .env with your actual configuration"
    fi
fi

echo ""
echo "================================"
print_success "Starting VelocityOS server..."
echo "================================"
echo ""
print_info "Server will be available at http://localhost:3000"
print_info "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start
