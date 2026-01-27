#!/bin/bash

# VelocityOS Deployment Verification Script
# This script verifies that your deployment is working correctly

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

print_header "🔍 VelocityOS Deployment Verification"

echo "This script verifies your Firebase deployment."
echo ""

# Check which environment to verify
echo "Which environment do you want to verify?"
echo "1) Staging (default)"
echo "2) Production (prod)"
echo ""
read -p "Enter choice [1-2]: " -n 1 -r
echo ""

if [[ $REPLY =~ ^2$ ]]; then
    PROJECT="prod"
    ENV_NAME="Production"
else
    PROJECT="default"
    ENV_NAME="Staging"
fi

echo ""
print_info "Verifying ${ENV_NAME} deployment..."
echo ""

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI not installed"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    print_error "Not logged into Firebase"
    echo "Run: firebase login"
    exit 1
fi

# Get project ID from .firebaserc
if [ -f ".firebaserc" ]; then
    # Use Python for robust JSON parsing (more reliable than grep/sed)
    if command -v python3 &> /dev/null; then
        PROJECT_ID=$(python3 -c "import json; f=open('.firebaserc'); data=json.load(f); print(data['projects']['$PROJECT'])" 2>/dev/null)
    elif command -v python &> /dev/null; then
        PROJECT_ID=$(python -c "import json; f=open('.firebaserc'); data=json.load(f); print(data['projects']['$PROJECT'])" 2>/dev/null)
    else
        # Fallback to grep/sed if Python not available
        if [ "$PROJECT" == "prod" ]; then
            PROJECT_ID=$(grep -A 1 '"prod"' .firebaserc | tail -n 1 | sed 's/.*: *"\(.*\)".*/\1/')
        else
            PROJECT_ID=$(grep -A 1 '"default"' .firebaserc | tail -n 1 | sed 's/.*: *"\(.*\)".*/\1/')
        fi
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        print_error "Could not read project ID from .firebaserc"
        exit 1
    fi
    
    print_success "Project ID: $PROJECT_ID"
else
    print_error ".firebaserc not found"
    exit 1
fi

# Construct URLs
HOSTING_URL="https://$PROJECT_ID.web.app"
HOSTING_URL_ALT="https://$PROJECT_ID.firebaseapp.com"

print_info "Expected URLs:"
echo "  Primary: $HOSTING_URL"
echo "  Alternate: $HOSTING_URL_ALT"
echo ""

# Verification checks
CHECKS_PASSED=0
CHECKS_FAILED=0

print_header "Running Verification Checks"

# Check 1: Hosting accessibility
print_info "Check 1: Verifying hosting is accessible..."
if curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$HOSTING_URL" | grep -q "200"; then
    print_success "Hosting is accessible at $HOSTING_URL"
    ((CHECKS_PASSED++))
else
    print_error "Hosting is not accessible at $HOSTING_URL"
    echo "  Try visiting manually: $HOSTING_URL"
    ((CHECKS_FAILED++))
fi

# Check 2: Verify functions are deployed
print_info "Check 2: Checking Cloud Functions deployment..."
FUNCTIONS_OUTPUT=$(firebase functions:list --project "$PROJECT" 2>&1 || true)

if echo "$FUNCTIONS_OUTPUT" | grep -q "api"; then
    print_success "Cloud Functions deployed (found 'api' function)"
    ((CHECKS_PASSED++))
else
    print_warning "Cloud Functions may not be deployed"
    echo "  Run: firebase deploy --only functions --project $PROJECT"
    ((CHECKS_FAILED++))
fi

# Check 3: API health endpoint
print_info "Check 3: Testing API health endpoint..."
API_HEALTH_URL="$HOSTING_URL/api/health"

HEALTH_RESPONSE=$(curl -s --max-time 10 "$API_HEALTH_URL" || echo "")
if echo "$HEALTH_RESPONSE" | grep -q '"status"'; then
    print_success "API health endpoint responding"
    echo "  Response: $HEALTH_RESPONSE"
    ((CHECKS_PASSED++))
else
    print_warning "API health endpoint not responding as expected"
    echo "  URL: $API_HEALTH_URL"
    echo "  Response: $HEALTH_RESPONSE"
    ((CHECKS_FAILED++))
fi

# Check 4: Firestore database
print_info "Check 4: Checking Firestore database..."
if firebase firestore:databases:list --project "$PROJECT" &> /dev/null; then
    print_success "Firestore database is accessible"
    ((CHECKS_PASSED++))
else
    print_warning "Could not verify Firestore database"
    echo "  Check Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID/firestore"
    ((CHECKS_FAILED++))
fi

# Check 5: Authentication
print_info "Check 5: Checking Firebase Authentication..."
# This is a basic check - we just verify the project is accessible
if firebase projects:list | grep -q "$PROJECT_ID"; then
    print_success "Firebase project is configured"
    echo "  Verify auth in console: https://console.firebase.google.com/project/$PROJECT_ID/authentication"
    ((CHECKS_PASSED++))
else
    print_warning "Could not verify Firebase project"
    ((CHECKS_FAILED++))
fi

# Check 6: Build artifacts
print_info "Check 6: Verifying build artifacts..."

BUILD_ERRORS=0

if [ -d "velocity-os-rebuilt/out" ] && [ -f "velocity-os-rebuilt/out/index.html" ]; then
    print_success "Frontend build artifacts present"
else
    print_error "Frontend build artifacts missing"
    echo "  Run: cd velocity-os-rebuilt && npm run build"
    ((BUILD_ERRORS++))
fi

if [ -d "functions/lib" ] && [ -f "functions/lib/index.js" ]; then
    print_success "Backend build artifacts present"
else
    print_error "Backend build artifacts missing"
    echo "  Run: cd functions && npm run build"
    ((BUILD_ERRORS++))
fi

if [ $BUILD_ERRORS -eq 0 ]; then
    ((CHECKS_PASSED++))
else
    ((CHECKS_FAILED++))
fi

# Check 7: Configuration files
print_info "Check 7: Verifying configuration files..."

CONFIG_ERRORS=0

if [ -f "firebase.json" ]; then
    print_success "firebase.json present"
else
    print_error "firebase.json missing"
    ((CONFIG_ERRORS++))
fi

if [ -f ".firebaserc" ]; then
    print_success ".firebaserc present"
else
    print_error ".firebaserc missing"
    ((CONFIG_ERRORS++))
fi

if [ -f "firestore.rules" ]; then
    print_success "firestore.rules present"
else
    print_warning "firestore.rules missing (optional)"
fi

if [ $CONFIG_ERRORS -eq 0 ]; then
    ((CHECKS_PASSED++))
else
    ((CHECKS_FAILED++))
fi

# Summary
print_header "Verification Summary"

echo "Environment: ${ENV_NAME}"
echo "Project ID: ${PROJECT_ID}"
echo ""
echo "Results:"
echo "  ✅ Checks passed: ${CHECKS_PASSED}"
echo "  ❌ Checks failed: ${CHECKS_FAILED}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    print_success "All checks passed! 🎉"
    echo ""
    echo "Your deployment appears to be working correctly."
    echo ""
    echo "🌐 Access your app at:"
    echo "   $HOSTING_URL"
    echo ""
    echo "📊 Firebase Console:"
    echo "   https://console.firebase.google.com/project/$PROJECT_ID"
    echo ""
    echo "Next steps:"
    echo "  1. Test authentication flow"
    echo "  2. Verify all features work as expected"
    echo "  3. Check Firebase Console logs for errors"
    echo "  4. Test on mobile devices"
    echo ""
    exit 0
else
    print_warning "Some checks failed"
    echo ""
    echo "Please review the errors above and:"
    echo "  1. Fix any build issues"
    echo "  2. Redeploy: ./scripts/deploy.sh"
    echo "  3. Run this verification script again"
    echo ""
    echo "For detailed logs:"
    echo "  firebase functions:log --project $PROJECT"
    echo ""
    echo "For help:"
    echo "  See FIREBASE_DEPLOYMENT_COMPLETE.md"
    echo ""
    exit 1
fi
