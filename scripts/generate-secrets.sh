#!/bin/bash

# VelocityOS Secret Generator
# Generates secure random secrets for environment configuration

echo "🔐 VelocityOS Secret Generator"
echo "================================"
echo ""
echo "This script generates secure random secrets for your .env file."
echo ""

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl is required but not installed."
    echo "Please install openssl and try again."
    exit 1
fi

echo "Generating secrets..."
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "✅ JWT_SECRET generated"

# Generate Session secret
SESSION_SECRET=$(openssl rand -base64 32)
echo "✅ SESSION_SECRET generated"

echo ""
echo "📋 Your Generated Secrets:"
echo "================================"
echo ""
echo "JWT_SECRET=$JWT_SECRET"
echo "SESSION_SECRET=$SESSION_SECRET"
echo ""
echo "================================"
echo ""
echo "📝 Next Steps:"
echo "1. Copy these values to your .env file"
echo "2. Keep these secrets secure and never commit them to git"
echo "3. Use different secrets for staging and production"
echo ""
echo "To update .env automatically, you can run:"
echo "  sed -i 's|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|' .env"
echo "  sed -i 's|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|' .env"
echo ""
echo "Or manually edit .env and paste the values above."
echo ""
