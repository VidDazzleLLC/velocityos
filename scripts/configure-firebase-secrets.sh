#!/bin/bash

# Firebase Secrets Configuration Helper
# This script helps you configure all required secrets for Firebase Cloud Functions

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_header() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════${NC}"
    echo ""
}

print_header "🔐 Firebase Secrets Configuration"

echo "This script helps you configure secrets for Firebase Cloud Functions."
echo ""
echo "You can configure secrets for:"
echo "  1. Staging environment (default)"
echo "  2. Production environment (prod)"
echo "  3. Both environments"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed"
    echo ""
    echo "Install it with:"
    echo "  npm install -g firebase-tools"
    exit 1
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    print_error "Not logged into Firebase"
    echo ""
    echo "Login with:"
    echo "  firebase login"
    exit 1
fi

print_success "Firebase CLI authenticated"
echo ""

# Select environment
read -p "Which environment do you want to configure? [1-3]: " ENV_CHOICE
echo ""

case $ENV_CHOICE in
    1)
        ENVIRONMENTS=("default")
        ENV_NAMES=("Staging")
        ;;
    2)
        ENVIRONMENTS=("prod")
        ENV_NAMES=("Production")
        ;;
    3)
        ENVIRONMENTS=("default" "prod")
        ENV_NAMES=("Staging" "Production")
        ;;
    *)
        ENVIRONMENTS=("default")
        ENV_NAMES=("Staging")
        ;;
esac

# Check if we should generate new secrets or use existing ones
echo "Do you want to:"
echo "  1. Generate new secrets (recommended for first-time setup)"
echo "  2. Enter existing secrets manually"
echo ""
read -p "Choice [1-2]: " SECRET_CHOICE
echo ""

if [ "$SECRET_CHOICE" == "1" ]; then
    # Generate secrets
    if command -v openssl &> /dev/null; then
        print_info "Generating secure secrets..."
        JWT_SECRET=$(openssl rand -base64 32)
        SESSION_SECRET=$(openssl rand -base64 32)
        print_success "Secrets generated"
        echo ""
        echo "🔐 Generated Secrets:"
        echo "════════════════════════════════════════"
        echo "JWT_SECRET=$JWT_SECRET"
        echo "SESSION_SECRET=$SESSION_SECRET"
        echo "════════════════════════════════════════"
        echo ""
        print_warning "SAVE THESE VALUES for your records!"
        echo ""
    else
        print_error "openssl not found - cannot generate secrets"
        echo "Please install openssl or choose option 2 to enter secrets manually"
        exit 1
    fi
else
    # Manual entry
    echo "Enter your secrets:"
    read -p "JWT_SECRET: " JWT_SECRET
    read -p "SESSION_SECRET: " SESSION_SECRET
    echo ""
fi

# Configure for each environment
for i in "${!ENVIRONMENTS[@]}"; do
    PROJECT="${ENVIRONMENTS[$i]}"
    ENV_NAME="${ENV_NAMES[$i]}"
    
    print_header "Configuring ${ENV_NAME} Environment"
    
    # Set JWT_SECRET
    # Note: Using stdin pipe is the Firebase CLI's standard method for non-interactive secret input
    print_info "Setting JWT_SECRET for ${ENV_NAME}..."
    if echo "$JWT_SECRET" | firebase functions:secrets:set JWT_SECRET --project "$PROJECT" --force; then
        print_success "JWT_SECRET configured for ${ENV_NAME}"
    else
        print_error "Failed to set JWT_SECRET for ${ENV_NAME}"
    fi
    
    # Set SESSION_SECRET
    print_info "Setting SESSION_SECRET for ${ENV_NAME}..."
    if echo "$SESSION_SECRET" | firebase functions:secrets:set SESSION_SECRET --project "$PROJECT" --force; then
        print_success "SESSION_SECRET configured for ${ENV_NAME}"
    else
        print_error "Failed to set SESSION_SECRET for ${ENV_NAME}"
    fi
    
    echo ""
done

# Optional: Configure AI API keys
print_header "Optional: AI API Keys"

echo "Do you want to configure AI API keys?"
echo "These are optional and only needed if you're using AI features."
echo ""
read -p "Configure AI API keys? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Which AI services do you want to configure?"
    echo ""
    
    # Gemini API
    read -p "Configure GEMINI_API_KEY? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Get your Gemini API key from: https://ai.google.dev/"
        read -p "Enter GEMINI_API_KEY: " GEMINI_KEY
        
        for i in "${!ENVIRONMENTS[@]}"; do
            PROJECT="${ENVIRONMENTS[$i]}"
            ENV_NAME="${ENV_NAMES[$i]}"
            
            print_info "Setting GEMINI_API_KEY for ${ENV_NAME}..."
            if echo "$GEMINI_KEY" | firebase functions:secrets:set GEMINI_API_KEY --project "$PROJECT" --force; then
                print_success "GEMINI_API_KEY configured for ${ENV_NAME}"
            fi
        done
    fi
    
    echo ""
    
    # OpenAI API
    read -p "Configure OPENAI_API_KEY? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Get your OpenAI API key from: https://platform.openai.com/api-keys"
        read -p "Enter OPENAI_API_KEY: " OPENAI_KEY
        
        for i in "${!ENVIRONMENTS[@]}"; do
            PROJECT="${ENVIRONMENTS[$i]}"
            ENV_NAME="${ENV_NAMES[$i]}"
            
            print_info "Setting OPENAI_API_KEY for ${ENV_NAME}..."
            if echo "$OPENAI_KEY" | firebase functions:secrets:set OPENAI_API_KEY --project "$PROJECT" --force; then
                print_success "OPENAI_API_KEY configured for ${ENV_NAME}"
            fi
        done
    fi
    
    echo ""
    
    # Anthropic API
    read -p "Configure ANTHROPIC_API_KEY? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Get your Anthropic API key from: https://console.anthropic.com/"
        read -p "Enter ANTHROPIC_API_KEY: " ANTHROPIC_KEY
        
        for i in "${!ENVIRONMENTS[@]}"; do
            PROJECT="${ENVIRONMENTS[$i]}"
            ENV_NAME="${ENV_NAMES[$i]}"
            
            print_info "Setting ANTHROPIC_API_KEY for ${ENV_NAME}..."
            if echo "$ANTHROPIC_KEY" | firebase functions:secrets:set ANTHROPIC_API_KEY --project "$PROJECT" --force; then
                print_success "ANTHROPIC_API_KEY configured for ${ENV_NAME}"
            fi
        done
    fi
fi

# Optional: OAuth Credentials
echo ""
print_header "Optional: OAuth Credentials"

echo "Do you want to configure OAuth credentials?"
echo "These are optional and only needed if you're using social login."
echo ""
read -p "Configure OAuth credentials? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    
    # Google OAuth
    read -p "Configure Google OAuth? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Enter GOOGLE_OAUTH_CLIENT_ID: " GOOGLE_CLIENT_ID
        read -p "Enter GOOGLE_OAUTH_CLIENT_SECRET: " GOOGLE_CLIENT_SECRET
        
        for i in "${!ENVIRONMENTS[@]}"; do
            PROJECT="${ENVIRONMENTS[$i]}"
            ENV_NAME="${ENV_NAMES[$i]}"
            
            print_info "Setting Google OAuth credentials for ${ENV_NAME}..."
            echo "$GOOGLE_CLIENT_ID" | firebase functions:secrets:set GOOGLE_OAUTH_CLIENT_ID --project "$PROJECT" --force
            echo "$GOOGLE_CLIENT_SECRET" | firebase functions:secrets:set GOOGLE_OAUTH_CLIENT_SECRET --project "$PROJECT" --force
            print_success "Google OAuth configured for ${ENV_NAME}"
        done
    fi
fi

# Summary
print_header "✅ Configuration Complete"

echo "Secrets configured successfully!"
echo ""
echo "Summary:"
for i in "${!ENVIRONMENTS[@]}"; do
    PROJECT="${ENVIRONMENTS[$i]}"
    ENV_NAME="${ENV_NAMES[$i]}"
    
    echo ""
    echo "${ENV_NAME} (${PROJECT}):"
    echo "  ✅ JWT_SECRET"
    echo "  ✅ SESSION_SECRET"
done

echo ""
echo "To view configured secrets:"
echo "  firebase functions:secrets:access JWT_SECRET --project default"
echo ""
echo "To add more secrets later:"
echo "  firebase functions:secrets:set SECRET_NAME --project default"
echo ""
echo "To list all secrets:"
echo "  firebase functions:secrets:list --project default"
echo ""
print_success "Configuration complete! 🎉"
echo ""
