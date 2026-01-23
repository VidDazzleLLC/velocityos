# VelocityOS Cloud Functions API Gateway

This directory contains Firebase Cloud Functions that serve as a unified API gateway for VelocityOS backend services.

## Architecture

The API gateway is implemented as an Express.js application exported as a Firebase Cloud Function. All API routes are accessible under `/api/**` paths.

## Setup

### Install Dependencies

```bash
cd functions
npm install
```

### Environment Variables

Set up Firebase Functions secrets for external services:

```bash
# Gemini AI (for AI agents and insights)
firebase functions:secrets:set GEMINI_API_KEY --project default

# Twilio (for telephony)
firebase functions:secrets:set TWILIO_ACCOUNT_SID --project default
firebase functions:secrets:set TWILIO_AUTH_TOKEN --project default
firebase functions:secrets:set TWILIO_FROM_NUMBER --project default

# Stripe (for payments)
firebase functions:secrets:set STRIPE_SECRET_KEY --project default

# PayPal (alternative payment processor)
firebase functions:secrets:set PAYPAL_CLIENT_ID --project default
firebase functions:secrets:set PAYPAL_CLIENT_SECRET --project default
```

## Local Development

### Start Firebase Emulators

```bash
cd functions
npm run serve
```

Or from the project root:

```bash
firebase emulators:start --only functions
```

The API will be available at:
```
http://localhost:5001/velocityos-staging/us-central1/api
```

## API Endpoints

### Health Check
```bash
curl http://localhost:5001/velocityos-staging/us-central1/api/health
```

### Agent Management

**Restart an AI agent:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/agent/restart \
  -H "Content-Type: application/json" \
  -d '{"agentId":"agent-001"}'
```

### Gateway

**Dispatch request to a service:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/gateway/dispatch \
  -H "Content-Type: application/json" \
  -d '{"service":"analytics","action":"getDashboard","params":{}}'
```

### Analytics

**Get dashboard metrics:**
```bash
curl "http://localhost:5001/velocityos-staging/us-central1/api/analytics/dashboard?dateRange=7d"
```

### Customer/CRM

**Create a customer:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/customer/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp"
  }'
```

**List customers:**
```bash
curl "http://localhost:5001/velocityos-staging/us-central1/api/customer/list?limit=50&offset=0"
```

**Search customers:**
```bash
curl "http://localhost:5001/velocityos-staging/us-central1/api/customer/list?search=john&status=active"
```

### Voice of Customer (VOC)

**Submit feedback:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/voc/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_123",
    "rating": 5,
    "comment": "Great service!",
    "category": "product"
  }'
```

### Payments

**Process a payment:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/payment/charge \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "usd",
    "customerId": "cust_123",
    "description": "Invoice payment",
    "paymentMethod": "card"
  }'
```

### Campaigns

**Start a campaign:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/campaign/start \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring Sale",
    "type": "email",
    "recipients": ["cust_123", "cust_456"],
    "template": "spring_sale_2024",
    "scheduledAt": "2024-03-01T10:00:00Z"
  }'
```

### Telephony

**Initiate outbound call:**
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/outboundcall \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Hello from VelocityOS",
    "voice": "Polly.Joanna"
  }'
```

## Implementation Status

### Fully Implemented (Stubbed with Mock Data)
All endpoints are implemented with:
- ✅ Request validation
- ✅ Error handling
- ✅ CORS configuration
- ✅ Proper HTTP status codes
- ✅ Mock response data
- ✅ Comprehensive TODO comments for actual implementation

### Endpoints

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/health` | GET | ✅ Functional | Health check endpoint |
| `/api/agent/restart` | POST | ⚠️ Stubbed | Returns mock success, needs agent logic |
| `/api/gateway/dispatch` | POST | ⚠️ Stubbed | Returns mock data, needs service router |
| `/api/analytics/dashboard` | GET | ⚠️ Stubbed | Returns mock metrics, needs Firestore integration |
| `/api/customer/create` | POST | ⚠️ Stubbed | Returns mock customer, needs Firestore + CRM |
| `/api/customer/list` | GET | ⚠️ Stubbed | Returns mock list, needs Firestore query |
| `/api/voc/feedback` | POST | ⚠️ Stubbed | Returns mock feedback, needs Firestore + AI sentiment |
| `/api/payment/charge` | POST | ⚠️ Stubbed | Returns mock charge, needs Stripe/PayPal integration |
| `/api/campaign/start` | POST | ⚠️ Stubbed | Returns mock campaign, needs email/SMS service |
| `/api/outboundcall` | POST | ⚠️ Stubbed | Returns mock call, needs Twilio integration |

## Next Steps

### To Wire Up Actual Implementations:

1. **Analytics Service** (`/api/analytics/dashboard`)
   - Query Firestore for transaction data
   - Implement metric calculations
   - Integrate Gemini AI for insights generation

2. **Customer Service** (`/api/customer/*`)
   - Create Firestore collections: `customers`, `customer_history`
   - Integrate with CRM (Salesforce/HubSpot)
   - Implement search and filtering logic

3. **VOC Service** (`/api/voc/feedback`)
   - Store feedback in Firestore
   - Use Gemini AI for sentiment analysis
   - Create alert system for low ratings

4. **Payment Service** (`/api/payment/charge`)
   - Initialize Stripe SDK
   - Implement payment intent flow
   - Set up webhook handlers
   - Integrate with customer balance tracking

5. **Campaign Service** (`/api/campaign/start`)
   - Integrate SendGrid for email campaigns
   - Integrate Twilio for SMS campaigns
   - Implement scheduling with Cloud Scheduler
   - Track campaign metrics

6. **Telephony Service** (`/api/outboundcall`)
   - Initialize Twilio client
   - Create TwiML generators
   - Implement call status tracking
   - Connect to AI agent for dynamic conversations

7. **Agent Service** (`/api/agent/restart`)
   - Define agent state management in Firestore
   - Implement agent lifecycle management
   - Create agent health monitoring

8. **Gateway Service** (`/api/gateway/dispatch`)
   - Create service registry
   - Implement dynamic routing
   - Add request/response transformation

## Deployment

### Deploy to Staging
```bash
firebase deploy --only functions --project default
```

### Deploy to Production
```bash
firebase deploy --only functions --project prod
```

### View Logs
```bash
firebase functions:log --project default
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Next.js dev server)
- `http://localhost:5000` (Firebase Hosting emulator)
- `http://localhost:5001` (Functions emulator)
- `*.web.app` (Firebase Hosting)
- `*.firebaseapp.com` (Firebase Hosting)

Update `corsOptions` in `index.js` to add additional origins.

## Error Handling

All endpoints implement:
- Input validation with clear error messages
- Try-catch blocks for error handling
- Proper HTTP status codes (400, 404, 500, etc.)
- Structured error responses
- Error logging with Firebase Functions logger

## Authentication

**Note:** Authentication/authorization will be added in PR #6. For now, all endpoints are open.

TODO items marked in code for:
- Firebase Authentication token verification
- Role-based access control (RBAC)
- API key validation
- Rate limiting

## Testing

### Unit Tests
```bash
# TODO: Add unit tests
npm test
```

### Integration Tests
```bash
# TODO: Add integration tests with emulators
npm run test:integration
```

## License

Apache-2.0 - See LICENSE file in project root
