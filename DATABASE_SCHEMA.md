# VelocityOS Database Schema

## Overview
VelocityOS uses **Google Firestore** as its primary NoSQL database, integrated with **Gemini AI** for intelligent automation and insights. All data is stored in Firebase/Google Cloud Platform, leveraging Google's infrastructure for scalability and reliability.

## Technology Stack
- **Database**: Google Firestore (NoSQL)
- **AI Engine**: Google Gemini AI
- **Authentication**: Firebase Authentication
- **Storage**: Google Cloud Storage
- **Analytics**: Google Analytics 4 + Firebase Analytics
- **Search**: Google Cloud Search (optional)
- **Functions**: Firebase Cloud Functions

---

## Collections

### 1. **users**
Stores user account information and preferences.

```javascript
{
  userId: string,              // Firebase Auth UID
  email: string,               // User email (unique)
  displayName: string,         // User's full name
  photoURL: string,            // Profile picture URL
  role: string,                // 'admin' | 'user' | 'agent'
  preferences: {
    theme: string,             // UI theme preference
    notifications: boolean,    // Email notifications enabled
    language: string           // Preferred language
  },
  geminiSettings: {
    model: string,             // Preferred Gemini model
    temperature: number,       // AI creativity level (0-1)
    autoSuggestions: boolean   // Enable AI auto-suggestions
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp
}
```

**Indexes:**
- `email` (unique)
- `role + createdAt`
- `lastLoginAt`

---

### 2. **customers**
CRM data for managing customer relationships.

```javascript
{
  customerId: string,          // Auto-generated ID
  email: string,               // Customer email (unique)
  name: string,                // Full name
  phone: string,               // Phone number
  company: string,             // Company name
  status: string,              // 'active' | 'inactive' | 'prospect'
  tags: array,                 // Custom tags for segmentation
  metadata: {
    source: string,            // Lead source
    industry: string,          // Customer industry
    size: string               // Company size
  },
  geminiInsights: {
    sentiment: string,         // 'positive' | 'neutral' | 'negative'
    engagementScore: number,   // 0-100
    nextBestAction: string,    // AI-generated recommendation
    riskLevel: string,         // 'low' | 'medium' | 'high'
    summary: string            // Gemini-generated customer summary
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastContactedAt: timestamp
}
```

**Indexes:**
- `email` (unique)
- `status + createdAt`
- `tags`
- `geminiInsights.engagementScore`

---

### 3. **agents**
AI agent configurations and state management.

```javascript
{
  agentId: string,             // Auto-generated ID
  name: string,                // Agent name
  type: string,                // 'customer_service' | 'sales' | 'analytics' | 'content'
  status: string,              // 'active' | 'paused' | 'stopped'
  geminiConfig: {
    model: string,             // 'gemini-pro' | 'gemini-pro-vision'
    systemPrompt: string,      // Agent personality/instructions
    temperature: number,       // 0-1
    topK: number,              // Token sampling parameter
    topP: number,              // Nucleus sampling parameter
    maxTokens: number          // Response length limit
  },
  capabilities: array,         // ['chat', 'email', 'analytics', 'scheduling']
  metrics: {
    totalInteractions: number,
    successRate: number,       // 0-100
    averageResponseTime: number, // milliseconds
    satisfactionScore: number  // 0-5
  },
  schedule: {
    enabled: boolean,
    timezone: string,
    activeHours: object        // { start: '09:00', end: '17:00' }
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastActive: timestamp
}
```

**Indexes:**
- `status + lastActive`
- `type + status`

---

### 4. **analytics_events**
Tracks all system events for analytics and AI training.

```javascript
{
  eventId: string,             // Auto-generated ID
  eventType: string,           // 'page_view' | 'user_action' | 'ai_interaction' | 'conversion'
  userId: string,              // User who triggered event
  timestamp: timestamp,
  properties: {
    page: string,
    action: string,
    value: any,
    duration: number           // milliseconds
  },
  geminiProcessing: {
    analyzed: boolean,
    insights: string,          // AI-generated insights
    anomalyDetected: boolean,
    recommendations: array     // AI suggestions
  },
  sessionId: string,
  deviceInfo: {
    type: string,              // 'desktop' | 'mobile' | 'tablet'
    os: string,
    browser: string
  }
}
```

**Indexes:**
- `timestamp + eventType`
- `userId + timestamp`
- `sessionId`

---

### 5. **feedback**
Voice of Customer (VOC) feedback with Gemini AI analysis.

```javascript
{
  feedbackId: string,          // Auto-generated ID
  customerId: string,          // Reference to customer
  rating: number,              // 1-5 stars
  comment: string,             // Customer feedback text
  source: string,              // 'email' | 'chat' | 'survey' | 'call'
  category: string,            // 'product' | 'service' | 'support'
  geminiAnalysis: {
    sentiment: string,         // 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative'
    sentimentScore: number,    // -1 to 1
    emotions: array,           // ['happy', 'frustrated', 'confused']
    topics: array,             // Extracted topics/themes
    urgency: string,           // 'low' | 'medium' | 'high' | 'critical'
    summary: string,           // AI-generated summary
    actionItems: array,        // Suggested follow-up actions
    relatedFeedback: array     // Similar feedback IDs
  },
  status: string,              // 'new' | 'in_review' | 'resolved'
  assignedTo: string,          // User ID
  createdAt: timestamp,
  updatedAt: timestamp,
  resolvedAt: timestamp
}
```

**Indexes:**
- `rating + createdAt`
- `customerId + createdAt`
- `status + geminiAnalysis.urgency`
- `geminiAnalysis.sentiment`

---

### 6. **campaigns**
Marketing campaigns powered by Gemini AI.

```javascript
{
  campaignId: string,          // Auto-generated ID
  name: string,                // Campaign name
  type: string,                // 'email' | 'sms' | 'push' | 'multi-channel'
  status: string,              // 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
  targetAudience: {
    segmentIds: array,         // Customer segment IDs
    filters: object,           // Dynamic filtering criteria
    estimatedReach: number
  },
  content: {
    subject: string,
    body: string,
    template: string,
    geminiGenerated: boolean,  // Was content AI-generated?
    geminiPrompt: string       // Prompt used for generation
  },
  geminiOptimization: {
    suggestedSubjectLines: array, // AI-suggested alternatives
    toneAnalysis: string,      // 'professional' | 'casual' | 'urgent'
    readabilityScore: number,  // 0-100
    predictedEngagement: number, // Estimated open rate
    bestSendTime: timestamp,   // AI-recommended send time
    personalizationTips: array
  },
  schedule: {
    scheduledAt: timestamp,
    timezone: string,
    recurring: boolean,
    frequency: string          // 'daily' | 'weekly' | 'monthly'
  },
  metrics: {
    sent: number,
    delivered: number,
    opened: number,
    clicked: number,
    converted: number,
    unsubscribed: number
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp
}
```

**Indexes:**
- `status + scheduledAt`
- `type + createdAt`

---

### 7. **payments**
Transaction records integrated with Google Pay.

```javascript
{
  paymentId: string,           // Auto-generated ID
  customerId: string,          // Reference to customer
  amount: number,              // Amount in cents
  currency: string,            // 'USD', 'EUR', etc.
  status: string,              // 'pending' | 'completed' | 'failed' | 'refunded'
  method: string,              // 'google_pay' | 'card' | 'bank_transfer'
  googlePayToken: string,      // Google Pay payment token
  metadata: {
    orderId: string,
    productIds: array,
    taxAmount: number,
    discountAmount: number
  },
  geminiRiskAnalysis: {
    riskScore: number,         // 0-100
    fraudProbability: number,  // 0-1
    anomalyDetected: boolean,
    recommendations: string
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  completedAt: timestamp
}
```

**Indexes:**
- `customerId + createdAt`
- `status + amount`

---

### 8. **calls**
Call logs with Gemini AI transcription and analysis.

```javascript
{
  callId: string,              // Auto-generated ID
  customerId: string,          // Reference to customer
  agentId: string,             // AI or human agent
  direction: string,           // 'inbound' | 'outbound'
  status: string,              // 'completed' | 'missed' | 'voicemail'
  duration: number,            // seconds
  recordingUrl: string,        // Google Cloud Storage URL
  geminiTranscription: {
    text: string,              // Full transcript
    confidence: number,        // 0-1
    language: string,
    speakers: array,           // Speaker diarization
    timestamps: array          // Word-level timestamps
  },
  geminiAnalysis: {
    summary: string,           // Call summary
    sentiment: string,
    keyTopics: array,
    actionItems: array,
    customerSatisfaction: number, // 0-10
    nextSteps: array,
    escalationNeeded: boolean
  },
  startTime: timestamp,
  endTime: timestamp,
  createdAt: timestamp
}
```

**Indexes:**
- `customerId + startTime`
- `status + startTime`
- `geminiAnalysis.escalationNeeded`

---

### 9. **gemini_conversations**
Stores AI conversation history for context and training.

```javascript
{
  conversationId: string,      // Auto-generated ID
  userId: string,              // User interacting with AI
  agentId: string,             // AI agent ID
  messages: array,             // Conversation message history
  /*
  messages: [
    {
      role: 'user' | 'model',
      content: string,
      timestamp: timestamp,
      metadata: object
    }
  ]
  */
  context: {
    intent: string,            // Detected user intent
    entities: array,           // Extracted entities
    sessionId: string
  },
  metrics: {
    totalMessages: number,
    averageResponseTime: number,
    satisfactionRating: number,
    resolved: boolean
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  closedAt: timestamp
}
```

**Indexes:**
- `userId + createdAt`
- `agentId + createdAt`

---

## Google Cloud Integration

### Services Used:
1. **Gemini AI API** - All AI-powered features
2. **Firebase Firestore** - Primary database
3. **Firebase Authentication** - User authentication
4. **Firebase Cloud Functions** - Backend API
5. **Google Cloud Storage** - File storage
6. **Google Analytics 4** - User analytics
7. **Google Cloud Speech-to-Text** - Call transcription
8. **Google Cloud Natural Language** - Sentiment analysis
9. **Google Pay** - Payment processing
10. **Google Workspace Integration** - Calendar, Gmail, Drive

### Environment Variables Required:
```bash
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT=your-project-id
FIREBASE_CONFIG=your-firebase-config-json
```

---

## Security Rules
See `firestore.rules` for complete security implementation.

## Indexes
See `firestore.indexes.json` for all composite indexes.
