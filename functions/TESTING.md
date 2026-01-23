# Testing Guide for VelocityOS API Gateway

This guide provides comprehensive testing instructions for the Firebase Cloud Functions API Gateway.

## Prerequisites

1. **Node.js**: Version 18 or 20
2. **Firebase CLI**: Install globally
   ```bash
   npm install -g firebase-tools
   ```
3. **Firebase Login**: Authenticate with Firebase
   ```bash
   firebase login
   ```

## Local Testing with Firebase Emulators

### Step 1: Install Dependencies

```bash
cd functions
npm install
```

### Step 2: Validate Function Structure

```bash
npm run validate
```

Expected output:
```
✅ Cloud Function "api" is properly exported
✅ "api" export is a valid function
✨ All validations passed!
```

### Step 3: List All Routes

```bash
npm run list-routes
```

This will display all 10 registered API endpoints.

### Step 4: Start Firebase Emulators

From the project root:
```bash
firebase emulators:start --only functions
```

Or from the functions directory:
```bash
npm run serve
```

The API will be available at:
```
http://localhost:5001/velocityos-staging/us-central1/api
```

**Note**: The project ID `velocityos-staging` comes from `.firebaserc`. Update if your project ID is different.

## Testing Individual Endpoints

All examples below use `localhost:5001/velocityos-staging/us-central1` as the base URL.
Adjust according to your Firebase project ID and region.

### 1. Health Check (GET /api/health)

**Purpose**: Verify the API is running

```bash
curl http://localhost:5001/velocityos-staging/us-central1/api/health
```

**Expected Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-23T12:00:00.000Z",
  "service": "VelocityOS API Gateway"
}
```

---

### 2. Agent Restart (POST /api/agent/restart)

**Purpose**: Restart an AI agent instance

```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/agent/restart \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-001"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Agent agent-001 restart initiated",
  "agentId": "agent-001",
  "status": "restarting",
  "timestamp": "2024-01-23T12:00:00.000Z"
}
```

**Error Cases**:

Missing agentId (400 Bad Request):
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/agent/restart \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 3. Gateway Dispatch (POST /api/gateway/dispatch)

**Purpose**: Dispatch requests to various backend services

```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/gateway/dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "service": "analytics",
    "action": "getDashboard",
    "params": {
      "dateRange": "7d"
    }
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "service": "analytics",
  "action": "getDashboard",
  "result": {
    "revenue": 45231,
    "users": 2345,
    "conversionRate": 3.2
  },
  "timestamp": "2024-01-23T12:00:00.000Z"
}
```

**Try different services**:
```bash
# Customer service
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/gateway/dispatch \
  -H "Content-Type: application/json" \
  -d '{"service":"customer","action":"list","params":{}}'
```

---

### 4. Analytics Dashboard (GET /api/analytics/dashboard)

**Purpose**: Retrieve dashboard metrics and KPIs

```bash
curl "http://localhost:5001/velocityos-staging/us-central1/api/analytics/dashboard?dateRange=7d"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "dateRange": "7d",
  "metrics": {
    "revenue": {
      "current": 45231,
      "previous": 38950,
      "change": 16.1,
      "trend": "up"
    },
    "users": {
      "current": 2345,
      "previous": 2180,
      "change": 7.6,
      "trend": "up"
    },
    ...
  },
  "insights": [...]
}
```

**Query Parameters**:
- `dateRange`: Optional (e.g., '7d', '30d', '90d')

---

### 5. Create Customer (POST /api/customer/create)

**Purpose**: Create a new customer record

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

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Customer created successfully",
  "customer": {
    "id": "cust_1234567890_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "metadata": {},
    "status": "active",
    "createdAt": "2024-01-23T12:00:00.000Z",
    "updatedAt": "2024-01-23T12:00:00.000Z"
  }
}
```

**Error Cases**:

Invalid email (400 Bad Request):
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/customer/create \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"invalid-email"}'
```

---

### 6. List Customers (GET /api/customer/list)

**Purpose**: List all customers with optional filtering

```bash
# Basic list
curl "http://localhost:5001/velocityos-staging/us-central1/api/customer/list"

# With pagination
curl "http://localhost:5001/velocityos-staging/us-central1/api/customer/list?limit=10&offset=0"

# With filters
curl "http://localhost:5001/velocityos-staging/us-central1/api/customer/list?status=active&search=john"
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "customers": [...],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 3,
    "hasMore": false
  },
  "timestamp": "2024-01-23T12:00:00.000Z"
}
```

---

### 7. VOC Feedback (POST /api/voc/feedback)

**Purpose**: Submit customer feedback (Voice of Customer)

```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/voc/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_123",
    "rating": 5,
    "comment": "Great service! Very happy with the product.",
    "category": "product"
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "feedback_1234567890_abc123",
    "customerId": "cust_123",
    "rating": 5,
    "comment": "Great service! Very happy with the product.",
    "category": "product",
    "sentiment": "positive",
    "metadata": {},
    "createdAt": "2024-01-23T12:00:00.000Z"
  }
}
```

**Error Cases**:

Invalid rating (400 Bad Request):
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/voc/feedback \
  -H "Content-Type: application/json" \
  -d '{"rating":6,"comment":"Test"}'
```

---

### 8. Payment Charge (POST /api/payment/charge)

**Purpose**: Process a payment charge

```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/payment/charge \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "usd",
    "customerId": "cust_123",
    "description": "Invoice #12345",
    "paymentMethod": "card"
  }'
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "charge": {
    "id": "ch_1234567890_abc123",
    "amount": 5000,
    "currency": "usd",
    "customerId": "cust_123",
    "description": "Invoice #12345",
    "paymentMethod": "card",
    "status": "succeeded",
    "metadata": {},
    "createdAt": "2024-01-23T12:00:00.000Z"
  }
}
```

**Error Cases**:

Invalid amount (400 Bad Request):
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/payment/charge \
  -H "Content-Type: application/json" \
  -d '{"amount":-100,"currency":"usd","customerId":"cust_123"}'
```

---

### 9. Start Campaign (POST /api/campaign/start)

**Purpose**: Start a marketing/communication campaign

```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/campaign/start \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring Sale 2024",
    "type": "email",
    "recipients": ["cust_123", "cust_456", "cust_789"],
    "template": "spring_sale_2024",
    "scheduledAt": "2024-03-01T10:00:00Z"
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Campaign started successfully",
  "campaign": {
    "id": "camp_1234567890_abc123",
    "name": "Spring Sale 2024",
    "type": "email",
    "status": "scheduled",
    "recipientCount": 3,
    "template": "spring_sale_2024",
    "scheduledAt": "2024-03-01T10:00:00Z",
    "metadata": {},
    "createdAt": "2024-01-23T12:00:00.000Z"
  }
}
```

**Campaign Types**:
- `email` - Email campaign
- `sms` - SMS campaign
- `push` - Push notification
- `voice` - Voice call campaign

---

### 10. Outbound Call (POST /api/outboundcall)

**Purpose**: Initiate an outbound call via Twilio

```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/outboundcall \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Hello from VelocityOS! This is a test call.",
    "voice": "Polly.Joanna",
    "callbackUrl": "https://example.com/call/status"
  }'
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Outbound call initiated",
  "call": {
    "sid": "CA1234567890abcdef",
    "to": "+1234567890",
    "status": "queued",
    "direction": "outbound",
    "voice": "Polly.Joanna",
    "message": "Hello from VelocityOS! This is a test call.",
    "callbackUrl": "https://example.com/call/status",
    "metadata": {},
    "createdAt": "2024-01-23T12:00:00.000Z"
  }
}
```

**Error Cases**:

Invalid phone number (400 Bad Request):
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/outboundcall \
  -H "Content-Type: application/json" \
  -d '{"to":"invalid-number","message":"Test"}'
```

---

## Testing Error Handling

### 404 Not Found

```bash
curl http://localhost:5001/velocityos-staging/us-central1/api/invalid/route
```

**Expected Response** (404 Not Found):
```json
{
  "error": "Route not found",
  "path": "/api/invalid/route",
  "method": "GET",
  "availableRoutes": [
    "GET /api/health",
    "POST /api/agent/restart",
    ...
  ]
}
```

### 400 Bad Request

Missing required fields:
```bash
curl -X POST http://localhost:5001/velocityos-staging/us-central1/api/customer/create \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Missing required fields",
  "missingFields": ["name", "email"]
}
```

---

## Monitoring Logs

### View Real-time Logs

While the emulator is running, logs appear in the console automatically.

### Structured Logging

All requests are logged with:
- HTTP method
- Request path
- Request body
- Query parameters

Example log output:
```
i  functions: {"severity":"INFO","message":"POST /api/customer/create","body":{"name":"John Doe","email":"john@example.com"}}
```

---

## Testing CORS

### Test Preflight Request

```bash
curl -X OPTIONS http://localhost:5001/velocityos-staging/us-central1/api/health \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Should include CORS headers in response:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
```

---

## Automated Testing Script

Save this as `test-all.sh` in the `functions` directory:

```bash
#!/bin/bash

BASE_URL="http://localhost:5001/velocityos-staging/us-central1/api"

echo "🧪 Testing VelocityOS API Gateway"
echo "=================================="
echo ""

# 1. Health check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq .
echo ""

# 2. Analytics
echo "2. Testing Analytics Dashboard..."
curl -s "$BASE_URL/analytics/dashboard?dateRange=7d" | jq .
echo ""

# 3. Create Customer
echo "3. Testing Create Customer..."
curl -s -X POST "$BASE_URL/customer/create" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}' | jq .
echo ""

# 4. List Customers
echo "4. Testing List Customers..."
curl -s "$BASE_URL/customer/list" | jq .
echo ""

# 5. VOC Feedback
echo "5. Testing VOC Feedback..."
curl -s -X POST "$BASE_URL/voc/feedback" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Great!"}' | jq .
echo ""

# 6. Payment
echo "6. Testing Payment Charge..."
curl -s -X POST "$BASE_URL/payment/charge" \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"currency":"usd","customerId":"cust_123"}' | jq .
echo ""

# 7. Campaign
echo "7. Testing Campaign Start..."
curl -s -X POST "$BASE_URL/campaign/start" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Campaign","type":"email"}' | jq .
echo ""

# 8. Agent Restart
echo "8. Testing Agent Restart..."
curl -s -X POST "$BASE_URL/agent/restart" \
  -H "Content-Type: application/json" \
  -d '{"agentId":"agent-001"}' | jq .
echo ""

# 9. Gateway Dispatch
echo "9. Testing Gateway Dispatch..."
curl -s -X POST "$BASE_URL/gateway/dispatch" \
  -H "Content-Type: application/json" \
  -d '{"service":"analytics","action":"getDashboard"}' | jq .
echo ""

# 10. Outbound Call
echo "10. Testing Outbound Call..."
curl -s -X POST "$BASE_URL/outboundcall" \
  -H "Content-Type: application/json" \
  -d '{"to":"+1234567890","message":"Test"}' | jq .
echo ""

echo "✅ All tests completed!"
```

Make it executable and run:
```bash
chmod +x test-all.sh
./test-all.sh
```

---

## Troubleshooting

### Emulator Won't Start

1. Check if port 5001 is already in use:
   ```bash
   lsof -i :5001
   ```

2. Kill the process or use a different port:
   ```bash
   firebase emulators:start --only functions --port 5002
   ```

### Functions Not Loading

1. Check for syntax errors:
   ```bash
   npm run validate
   ```

2. Check dependencies are installed:
   ```bash
   npm install
   ```

### CORS Errors

1. Verify CORS origins in `index.js`
2. Check that preflight requests are handled
3. Ensure Origin header is sent in requests

---

## Next Steps

After local testing:

1. **Deploy to staging**:
   ```bash
   firebase deploy --only functions --project default
   ```

2. **Test on staging**:
   - URL: `https://us-central1-velocityos-staging.cloudfunctions.net/api`
   - Or via hosting: `https://velocityos-staging.web.app/api`

3. **Monitor logs**:
   ```bash
   firebase functions:log --project default
   ```

4. **Deploy to production**:
   ```bash
   firebase deploy --only functions --project prod
   ```
