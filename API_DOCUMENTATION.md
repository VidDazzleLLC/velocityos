# VelocityOS Backend API Documentation

## Overview

VelocityOS provides a complete RESTful API powered by Firebase Cloud Functions, integrating with Firestore, Gemini AI, and Google Workspace.

**Base URL**: `https://your-project.cloudfunctions.net/api`

**API Version**: 1.0.0

---

## Authentication

All API endpoints support user authentication via the `x-user-id` header:

```
x-user-id: <user-firebase-uid>
```

---

## Rate Limiting

- **Limit**: 100 requests per minute per user
- **Response Code**: `429 Too Many Requests` when exceeded

---

## Core API Endpoints

### Health Check

**GET** `/health`

Check API health status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": 1706278400000
}
```

---

### Analytics Dashboard

**GET** `/analytics/dashboard`

Retrieve dashboard analytics including revenue, users, conversion rate, and customer satisfaction.

**Query Parameters**:
- `startDate` (optional): ISO 8601 date string (default: 30 days ago)
- `endDate` (optional): ISO 8601 date string (default: now)

**Example Request**:
```bash
curl -X GET "https://your-project.cloudfunctions.net/api/analytics/dashboard?startDate=2024-01-01&endDate=2024-01-31" \
  -H "x-user-id: user123"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "revenue": 125000,
    "users": 450,
    "conversionRate": 12.5,
    "satisfaction": 4.3,
    "charts": {
      "period": {
        "start": "2024-01-01T00:00:00.000Z",
        "end": "2024-01-31T23:59:59.999Z"
      },
      "totalEvents": 3450,
      "feedbackCount": 120
    }
  }
}
```

---

### Customer Management

#### Create Customer

**POST** `/customer/create`

Create a new customer with email uniqueness validation.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "tags": ["vip", "enterprise"],
  "status": "lead"
}
```

**Response**:
```json
{
  "success": true,
  "customer": {
    "id": "customer_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "tags": ["vip", "enterprise"],
    "status": "lead",
    "assignedTo": "user123",
    "createdAt": {...},
    "updatedAt": {...},
    "metadata": {}
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Email already exists",
  "message": "A customer with this email already exists"
}
```

---

#### List Customers

**GET** `/customer/list`

List customers with pagination, search, filtering, and sorting.

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Results per page (default: 30)
- `q` (optional): Search query (searches name, email, company)
- `status` (optional): Filter by status (`active`, `inactive`, `lead`)
- `tags` (optional): Comma-separated tags to filter by
- `sortBy` (optional): Field to sort by (default: `createdAt`)
- `sortOrder` (optional): Sort order (`asc`, `desc`) (default: `desc`)

**Example Request**:
```bash
curl -X GET "https://your-project.cloudfunctions.net/api/customer/list?page=1&pageSize=10&status=active&sortBy=name&sortOrder=asc" \
  -H "x-user-id: user123"
```

**Response**:
```json
{
  "success": true,
  "customers": [...],
  "total": 150,
  "page": 1,
  "pageSize": 10
}
```

---

### Voice of Customer (VOC) - Feedback

**POST** `/voc/feedback`

Submit customer feedback with AI-powered sentiment analysis using Gemini AI.

**Request Body**:
```json
{
  "customerId": "customer_abc123",
  "rating": 5,
  "comment": "Excellent service! Very satisfied with the product.",
  "category": "product"
}
```

**Response**:
```json
{
  "success": true,
  "feedback": {
    "id": "feedback_xyz789",
    "customerId": "customer_abc123",
    "userId": "user123",
    "rating": 5,
    "comment": "Excellent service! Very satisfied with the product.",
    "sentiment": "positive",
    "sentimentScore": 0.95,
    "category": "product",
    "timestamp": {...},
    "resolved": false
  },
  "sentiment": {
    "sentiment": "positive",
    "sentimentScore": 0.95
  }
}
```

**Features**:
- Automatic sentiment analysis via Gemini AI
- Sentiment classification: `positive`, `neutral`, `negative`
- Sentiment score: 0-1 (0 = very negative, 1 = very positive)
- Low rating alerts (rating < 3) logged for follow-up

---

### Campaign Management

**POST** `/campaign/start`

Create and start a marketing campaign (email, SMS, or mixed).

**Request Body**:
```json
{
  "name": "Summer Sale 2024",
  "type": "email",
  "targetAudience": ["customer1", "customer2", "customer3"],
  "content": "Check out our amazing summer deals!"
}
```

**Response**:
```json
{
  "success": true,
  "campaign": {
    "id": "campaign_123",
    "name": "Summer Sale 2024",
    "type": "email",
    "status": "running",
    "targetAudience": ["customer1", "customer2", "customer3"],
    "content": "Check out our amazing summer deals!",
    "startedAt": {...},
    "metrics": {
      "sent": 3,
      "delivered": 0,
      "opened": 0,
      "clicked": 0
    }
  },
  "sent": 3
}
```

**Campaign Types**:
- `email`: Send via Gmail API (placeholder - requires OAuth setup)
- `sms`: Send via SMS provider (placeholder for Twilio integration)
- `mixed`: Send both email and SMS

---

### Agent Management

**POST** `/agent/restart`

Restart an AI agent and update its state.

**Request Body**:
```json
{
  "agentId": "agent_456"
}
```

**Response**:
```json
{
  "success": true,
  "agentId": "agent_456",
  "status": "active",
  "message": "Agent restarted successfully"
}
```

---

### Gateway Dispatch

**POST** `/gateway/dispatch`

Route requests to appropriate service handlers.

**Request Body**:
```json
{
  "service": "customer",
  "method": "getProfile",
  "params": {
    "customerId": "customer_abc123"
  }
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "message": "Dispatched customer.getProfile",
    "params": {...}
  },
  "executionTime": 42
}
```

---

## AI-Powered Endpoints

### Email Analysis

**POST** `/ai/email-analysis`

Analyze email content using Gemini AI for priority, category, sentiment, and suggested responses.

**Request Body**:
```json
{
  "emailContent": "I'm having trouble with my account login..."
}
```

**Response**:
```json
{
  "success": true,
  "analysis": "{\n  \"priority\": \"high\",\n  \"category\": \"support\",\n  \"sentiment\": \"frustrated\",\n  \"suggestedResponse\": \"...\"\n}"
}
```

---

### Meeting Scheduling

**POST** `/ai/schedule-meeting`

Get AI-suggested meeting times based on preferences.

**Request Body**:
```json
{
  "attendees": ["john@example.com", "jane@example.com"],
  "duration": 30,
  "preferences": {
    "timezone": "America/New_York",
    "preferredTime": "morning"
  }
}
```

**Response**:
```json
{
  "success": true,
  "suggestions": "Based on your requirements...\n1. Tomorrow at 9:00 AM\n2. Wednesday at 10:30 AM\n3. Friday at 9:30 AM"
}
```

---

### Document Summarization

**POST** `/ai/summarize-document`

Generate executive summary and key points from document content.

**Request Body**:
```json
{
  "documentContent": "Long document text goes here..."
}
```

**Response**:
```json
{
  "success": true,
  "summary": "**Key Points:**\n- Point 1\n- Point 2\n\n**Executive Summary:**\n..."
}
```

---

### Customer Segmentation

**POST** `/ai/segment-customers`

AI-powered customer segmentation and targeting recommendations.

**Request Body**:
```json
{}
```

**Response**:
```json
{
  "success": true,
  "segments": "**Recommended Segments:**\n1. High-value customers...\n2. At-risk customers...\n..."
}
```

---

### Predictive Analytics

**POST** `/ai/predict`

Generate predictions for sales, churn, revenue, etc.

**Request Body**:
```json
{
  "type": "sales",
  "historicalData": {
    "january": 50000,
    "february": 55000,
    "march": 60000
  }
}
```

**Response**:
```json
{
  "success": true,
  "type": "sales",
  "prediction": "**Sales Forecast (Next 30 Days):**\n$65,000 - $70,000\n\n**Confidence Level:** 85%\n..."
}
```

---

## Background Jobs (Scheduled Functions)

The following functions run automatically in the background:

### Gmail Sync
- **Schedule**: Every 5 minutes
- **Function**: `syncGmail`
- **Purpose**: Fetch new emails, analyze with Gemini AI, store in Firestore, trigger auto-responses

### Calendar Sync
- **Schedule**: Every 10 minutes
- **Function**: `syncCalendar`
- **Purpose**: Sync calendar events, detect conflicts, update availability

### Drive Sync
- **Schedule**: Every 30 minutes
- **Function**: `syncDrive`
- **Purpose**: Sync file metadata, index documents for search

### Contacts Sync
- **Schedule**: Daily
- **Function**: `syncContacts`
- **Purpose**: Sync Google Contacts, merge with customer database

---

## Error Handling

All endpoints follow consistent error handling patterns:

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

---

## Environment Variables

Required environment variables (set in Firebase Functions config):

```bash
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
```

To set environment variables:
```bash
firebase functions:config:set gemini.api_key="your_key"
firebase functions:config:set google.oauth_client_id="your_client_id"
firebase functions:config:set google.oauth_client_secret="your_secret"
```

---

## Testing

### Local Testing

1. Start Firebase emulators:
```bash
cd functions
npm run serve
```

2. Test endpoints locally:
```bash
curl http://localhost:5001/your-project/us-central1/api/health
```

### Production Testing

```bash
curl https://your-project.cloudfunctions.net/api/health
```

---

## Deployment

Deploy all functions:
```bash
cd functions
npm run deploy
```

Deploy specific function:
```bash
firebase deploy --only functions:api
firebase deploy --only functions:syncGmail
```

---

## Logging & Monitoring

All API requests and errors are logged using Firebase Functions logger:

- View logs in Firebase Console: Functions > Logs
- View logs via CLI: `firebase functions:log`

---

## Security

1. **Firestore Security Rules**: See `firestore.rules`
2. **CORS**: Enabled for all origins (configure in production)
3. **Rate Limiting**: 100 req/min per user
4. **Input Validation**: Using Zod schemas
5. **Error Sanitization**: Sensitive errors not exposed to clients

---

## Next Steps

1. **OAuth Setup**: Configure Google OAuth for Gmail/Calendar/Drive access
2. **Twilio Integration**: Add SMS sending capability
3. **Advanced Analytics**: Implement chart data endpoints
4. **Caching**: Add Redis for performance optimization
5. **WebSockets**: Real-time updates for dashboard
6. **Tests**: Add comprehensive unit and integration tests

---

## Support

For issues and questions:
- GitHub Issues: [VidDazzleLLC/velocityos](https://github.com/VidDazzleLLC/velocityos)
- Documentation: See `DATABASE_SCHEMA.md` for data structures
