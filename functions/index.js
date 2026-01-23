const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS Configuration - Allow requests from frontend
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5001',
    /\.web\.app$/,
    /\.firebaseapp\.com$/
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  functions.logger.info(`${req.method} ${req.path}`, { 
    body: req.body, 
    query: req.query 
  });
  next();
});

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates required fields in request body
 * @param {Object} body - Request body
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object|null} Error object if validation fails, null otherwise
 */
function validateRequiredFields(body, requiredFields) {
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    return {
      error: 'Missing required fields',
      missingFields
    };
  }
  return null;
}

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'VelocityOS API Gateway'
  });
});

/**
 * POST /api/agent/restart
 * Restart an AI agent instance
 * 
 * Request body:
 * {
 *   "agentId": "agent-001"
 * }
 */
app.post('/api/agent/restart', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['agentId']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { agentId } = req.body;

    // TODO: Implement actual agent restart logic
    // This would typically:
    // 1. Check if agent exists in Firestore
    // 2. Stop the current agent instance
    // 3. Clear agent state/cache
    // 4. Reinitialize agent with fresh configuration
    // 5. Update agent status in database

    functions.logger.info('Agent restart requested', { agentId });

    // Mock response
    res.status(200).json({
      success: true,
      message: `Agent ${agentId} restart initiated`,
      agentId,
      status: 'restarting',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    functions.logger.error('Agent restart error', error);
    res.status(500).json({
      error: 'Failed to restart agent',
      message: error.message
    });
  }
});

/**
 * POST /api/gateway/dispatch
 * Dispatch requests to various services
 * 
 * Request body:
 * {
 *   "service": "analytics",
 *   "action": "getDashboard",
 *   "params": {}
 * }
 */
app.post('/api/gateway/dispatch', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['service', 'action']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { service, action, params = {} } = req.body;

    // TODO: Implement service dispatcher
    // This would route to appropriate service modules:
    // - analytics service
    // - customer service
    // - payment service
    // - campaign service
    // - telephony service
    // - AI agent service

    functions.logger.info('Gateway dispatch', { service, action, params });

    // Mock response based on service type
    let result;
    switch (service) {
      case 'analytics':
        result = { revenue: 45231, users: 2345, conversionRate: 3.2 };
        break;
      case 'customer':
        result = { customers: [], totalCount: 0 };
        break;
      default:
        result = { message: 'Service processed' };
    }

    res.status(200).json({
      success: true,
      service,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    functions.logger.error('Gateway dispatch error', error);
    res.status(500).json({
      error: 'Failed to dispatch request',
      message: error.message
    });
  }
});

/**
 * GET /api/analytics/dashboard
 * Retrieve dashboard metrics and KPIs
 * 
 * Query parameters:
 * - dateRange: optional (e.g., '7d', '30d', '90d')
 */
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const { dateRange = '7d' } = req.query;

    // TODO: Implement actual analytics logic
    // This would:
    // 1. Query Firestore for transaction data
    // 2. Aggregate metrics (revenue, users, conversion rate, etc.)
    // 3. Calculate trends and growth rates
    // 4. Fetch AI-generated insights
    // 5. Return formatted dashboard data

    functions.logger.info('Analytics dashboard requested', { dateRange });

    // Mock analytics data
    res.status(200).json({
      success: true,
      dateRange,
      metrics: {
        revenue: {
          current: 45231,
          previous: 38950,
          change: 16.1,
          trend: 'up'
        },
        users: {
          current: 2345,
          previous: 2180,
          change: 7.6,
          trend: 'up'
        },
        conversionRate: {
          current: 3.2,
          previous: 2.9,
          change: 10.3,
          trend: 'up'
        },
        tasksCompleted: {
          current: 89,
          previous: 76,
          change: 17.1,
          trend: 'up'
        },
        customerSatisfaction: {
          current: 4.7,
          previous: 4.5,
          change: 4.4,
          trend: 'up'
        }
      },
      insights: [
        {
          id: 'insight-1',
          text: 'Your conversion rate is up 15% this week. Consider scaling your marketing budget on high-performing campaigns.',
          confidence: 0.87,
          category: 'growth'
        },
        {
          id: 'insight-2',
          text: 'Customer satisfaction increased by 4.4%. Recent product improvements are resonating well with users.',
          confidence: 0.92,
          category: 'customer_success'
        }
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    functions.logger.error('Analytics dashboard error', error);
    res.status(500).json({
      error: 'Failed to retrieve analytics',
      message: error.message
    });
  }
});

/**
 * POST /api/customer/create
 * Create a new customer record
 * 
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "phone": "+1234567890",
 *   "company": "Acme Corp"
 * }
 */
app.post('/api/customer/create', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['name', 'email']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { name, email, phone, company, metadata = {} } = req.body;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // TODO: Implement actual customer creation
    // This would:
    // 1. Validate email uniqueness in Firestore
    // 2. Create customer document in Firestore
    // 3. Initialize customer in CRM (Salesforce, HubSpot, etc.)
    // 4. Send welcome email
    // 5. Trigger onboarding workflow

    functions.logger.info('Customer creation requested', { name, email });

    // Generate mock customer ID
    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mock customer object
    const customer = {
      id: customerId,
      name,
      email,
      phone: phone || null,
      company: company || null,
      metadata,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      customer
    });

  } catch (error) {
    functions.logger.error('Customer creation error', error);
    res.status(500).json({
      error: 'Failed to create customer',
      message: error.message
    });
  }
});

/**
 * GET /api/customer/list
 * List all customers with optional filtering
 * 
 * Query parameters:
 * - limit: number of results (default: 50)
 * - offset: pagination offset (default: 0)
 * - status: filter by status (active, inactive, etc.)
 * - search: search by name or email
 */
app.get('/api/customer/list', async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      status,
      search
    } = req.query;

    // TODO: Implement actual customer listing
    // This would:
    // 1. Query Firestore customers collection
    // 2. Apply filters (status, search)
    // 3. Implement pagination (limit, offset)
    // 4. Sort by creation date or other criteria
    // 5. Return customer list with metadata

    functions.logger.info('Customer list requested', { limit, offset, status, search });

    // Mock customer data
    const mockCustomers = [
      {
        id: 'cust_001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Acme Corp',
        status: 'active',
        totalSpent: 5420,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cust_002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        company: 'TechStart Inc',
        status: 'active',
        totalSpent: 12300,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cust_003',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '+1234567892',
        company: 'Digital Solutions',
        status: 'active',
        totalSpent: 8750,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      customers: mockCustomers,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: mockCustomers.length,
        hasMore: false
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    functions.logger.error('Customer list error', error);
    res.status(500).json({
      error: 'Failed to retrieve customers',
      message: error.message
    });
  }
});

/**
 * POST /api/voc/feedback
 * Submit customer feedback (Voice of Customer)
 * 
 * Request body:
 * {
 *   "customerId": "cust_123",
 *   "rating": 5,
 *   "comment": "Great service!",
 *   "category": "product"
 * }
 */
app.post('/api/voc/feedback', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['rating']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { customerId, rating, comment, category = 'general', metadata = {} } = req.body;

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    // TODO: Implement actual VOC feedback logic
    // This would:
    // 1. Store feedback in Firestore
    // 2. Analyze sentiment using AI (Gemini)
    // 3. Categorize feedback automatically
    // 4. Trigger alerts for low ratings
    // 5. Update customer satisfaction metrics
    // 6. Generate action items for customer success team

    functions.logger.info('VOC feedback submitted', { customerId, rating, category });

    // Generate mock feedback ID
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mock sentiment analysis (would use Gemini AI)
    let sentiment = 'neutral';
    if (rating >= 4) sentiment = 'positive';
    if (rating <= 2) sentiment = 'negative';

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedbackId,
        customerId: customerId || 'anonymous',
        rating,
        comment: comment || '',
        category,
        sentiment,
        metadata,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    functions.logger.error('VOC feedback error', error);
    res.status(500).json({
      error: 'Failed to submit feedback',
      message: error.message
    });
  }
});

/**
 * POST /api/payment/charge
 * Process a payment charge
 * 
 * Request body:
 * {
 *   "amount": 1000,
 *   "currency": "usd",
 *   "customerId": "cust_123",
 *   "description": "Invoice payment",
 *   "paymentMethod": "card"
 * }
 */
app.post('/api/payment/charge', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['amount', 'currency', 'customerId']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { 
      amount, 
      currency, 
      customerId, 
      description = 'Payment',
      paymentMethod = 'card',
      metadata = {}
    } = req.body;

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0'
      });
    }

    // TODO: Implement actual payment processing
    // This would:
    // 1. Initialize Stripe/PayPal SDK
    // 2. Create payment intent
    // 3. Process charge
    // 4. Handle webhooks for payment confirmation
    // 5. Update customer balance in Firestore
    // 6. Send receipt email
    // 7. Log transaction

    functions.logger.info('Payment charge requested', { 
      amount, 
      currency, 
      customerId 
    });

    // Generate mock charge ID
    const chargeId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      charge: {
        id: chargeId,
        amount,
        currency,
        customerId,
        description,
        paymentMethod,
        status: 'succeeded',
        metadata,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    functions.logger.error('Payment charge error', error);
    res.status(500).json({
      error: 'Failed to process payment',
      message: error.message
    });
  }
});

/**
 * POST /api/campaign/start
 * Start a marketing/communication campaign
 * 
 * Request body:
 * {
 *   "name": "Spring Sale",
 *   "type": "email",
 *   "recipients": ["cust_123", "cust_456"],
 *   "template": "spring_sale_2024",
 *   "scheduledAt": "2024-03-01T10:00:00Z"
 * }
 */
app.post('/api/campaign/start', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['name', 'type']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { 
      name, 
      type, 
      recipients = [], 
      template,
      content,
      scheduledAt,
      metadata = {}
    } = req.body;

    // Validate campaign type
    const validTypes = ['email', 'sms', 'push', 'voice'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid campaign type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    // TODO: Implement actual campaign logic
    // This would:
    // 1. Validate recipients exist
    // 2. Load campaign template if specified
    // 3. Queue campaign for delivery
    // 4. Schedule if scheduledAt is provided
    // 5. Track campaign metrics (open rate, click rate, etc.)
    // 6. Store campaign in Firestore
    // 7. Trigger appropriate service (SendGrid, Twilio, etc.)

    functions.logger.info('Campaign start requested', { 
      name, 
      type, 
      recipientCount: recipients.length 
    });

    // Generate mock campaign ID
    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.status(201).json({
      success: true,
      message: 'Campaign started successfully',
      campaign: {
        id: campaignId,
        name,
        type,
        status: scheduledAt ? 'scheduled' : 'active',
        recipientCount: recipients.length,
        template: template || null,
        scheduledAt: scheduledAt || null,
        metadata,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    functions.logger.error('Campaign start error', error);
    res.status(500).json({
      error: 'Failed to start campaign',
      message: error.message
    });
  }
});

/**
 * POST /api/outboundcall
 * Initiate an outbound call via Twilio
 * 
 * Request body:
 * {
 *   "to": "+1234567890",
 *   "message": "Hello from VelocityOS",
 *   "voice": "Polly.Joanna",
 *   "callbackUrl": "https://example.com/callback"
 * }
 */
app.post('/api/outboundcall', async (req, res) => {
  try {
    const validationError = validateRequiredFields(req.body, ['to']);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const { 
      to, 
      message = 'Hello, this is VelocityOS',
      voice = 'Polly.Joanna',
      callbackUrl,
      metadata = {}
    } = req.body;

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return res.status(400).json({
        error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)'
      });
    }

    // TODO: Implement actual Twilio integration
    // This would:
    // 1. Initialize Twilio client with credentials from secrets
    // 2. Create TwiML for voice message or connect to AI agent
    // 3. Initiate call using Twilio API
    // 4. Store call record in Firestore
    // 5. Handle call status callbacks
    // 6. Log call metrics and outcomes

    functions.logger.info('Outbound call requested', { to, voice });

    // Generate mock call SID
    const callSid = `CA${Math.random().toString(36).substr(2, 32)}`;

    res.status(201).json({
      success: true,
      message: 'Outbound call initiated',
      call: {
        sid: callSid,
        to,
        status: 'queued',
        direction: 'outbound',
        voice,
        message,
        callbackUrl: callbackUrl || null,
        metadata,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    functions.logger.error('Outbound call error', error);
    res.status(500).json({
      error: 'Failed to initiate call',
      message: error.message
    });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * 404 handler - route not found
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      'GET /api/health',
      'POST /api/agent/restart',
      'POST /api/gateway/dispatch',
      'GET /api/analytics/dashboard',
      'POST /api/customer/create',
      'GET /api/customer/list',
      'POST /api/voc/feedback',
      'POST /api/payment/charge',
      'POST /api/campaign/start',
      'POST /api/outboundcall'
    ]
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  functions.logger.error('Unhandled error', err);
  
  // Don't leak error details in production
  const isDev = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
});

// ============================================================================
// CLOUD FUNCTION EXPORT
// ============================================================================

/**
 * Export Express app as HTTPS Cloud Function
 * This will be available at: https://REGION-PROJECT_ID.cloudfunctions.net/api
 * With Firebase Hosting rewrites, it's accessible at: /api/**
 */
exports.api = functions.https.onRequest(app);
