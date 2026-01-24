/**
 * VelocityOS Firebase Cloud Functions
 * 
 * This module exposes an Express app under the `/api` path through Firebase Functions.
 * All endpoints are accessible via `/api/<endpoint>`.
 */

const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  
  next();
});

// Mock data storage (in-memory for demo purposes)
let customers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    createdAt: new Date('2024-01-20').toISOString(),
  },
];

let campaigns = [];
let feedbacks = [];
let nextCustomerId = 3;
let nextCampaignId = 1;

/**
 * Analytics Dashboard Endpoint
 * GET /api/analytics/dashboard
 */
app.get('/analytics/dashboard', (req, res) => {
  const dashboardData = {
    totalCustomers: customers.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    revenue: 45231.50,
    conversionRate: 3.2,
    tasksCompleted: 89,
  };
  
  res.json({
    success: true,
    data: dashboardData,
  });
});

/**
 * List Customers Endpoint
 * GET /api/customer/list
 */
app.get('/customer/list', (req, res) => {
  res.json({
    success: true,
    data: customers,
  });
});

/**
 * Create Customer Endpoint
 * POST /api/customer/create
 */
app.post('/customer/create', (req, res) => {
  const { name, email, phone } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required',
    });
  }
  
  // Check for duplicate email
  const existingCustomer = customers.find(c => c.email === email);
  if (existingCustomer) {
    return res.status(400).json({
      success: false,
      error: 'A customer with this email already exists',
    });
  }
  
  const newCustomer = {
    id: String(nextCustomerId++),
    name,
    email,
    phone: phone || '',
    createdAt: new Date().toISOString(),
  };
  
  customers.push(newCustomer);
  
  res.status(201).json({
    success: true,
    data: newCustomer,
    message: 'Customer created successfully',
  });
});

/**
 * Start Campaign Endpoint
 * POST /api/campaign/start
 */
app.post('/campaign/start', (req, res) => {
  const { name, recipients, message, scheduledAt } = req.body;
  
  // Validation
  if (!name || !recipients || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, recipients, and message are required',
    });
  }
  
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Recipients must be a non-empty array',
    });
  }
  
  const newCampaign = {
    id: String(nextCampaignId++),
    name,
    recipients,
    message,
    status: 'active',
    createdAt: new Date().toISOString(),
    scheduledAt: scheduledAt || new Date().toISOString(),
  };
  
  campaigns.push(newCampaign);
  
  res.status(201).json({
    success: true,
    data: newCampaign,
    message: 'Campaign started successfully',
  });
});

/**
 * Submit VOC Feedback Endpoint
 * POST /api/voc/feedback
 */
app.post('/voc/feedback', (req, res) => {
  const { rating, comment } = req.body;
  
  // Validation
  if (rating === undefined || !comment) {
    return res.status(400).json({
      success: false,
      error: 'Rating and comment are required',
    });
  }
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Rating must be between 1 and 5',
    });
  }
  
  const newFeedback = {
    rating,
    comment,
    timestamp: new Date().toISOString(),
  };
  
  feedbacks.push(newFeedback);
  
  res.status(201).json({
    success: true,
    data: newFeedback,
    message: 'Feedback submitted successfully',
  });
});

/**
 * Health Check Endpoint
 * GET /api/health
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'VelocityOS API is running',
    timestamp: new Date().toISOString(),
  });
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
