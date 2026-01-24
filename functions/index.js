const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { verifyAuth } = require('./middleware/auth');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Public health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VelocityOS API'
  });
});

// Apply authentication middleware to all /api routes except health check
// TODO: Add rate limiting to prevent brute force attacks on authentication
app.use('/api', (req, res, next) => {
  // Skip auth for health check
  if (req.path === '/health') {
    return next();
  }
  return verifyAuth(req, res, next);
});

// Protected API routes
app.get('/api/user', (req, res) => {
  res.json({
    user: {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.email_verified,
    }
  });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    message: 'Welcome to the dashboard',
    user: req.user.email,
    data: {
      // TODO: Add actual dashboard data
      stats: {
        customers: 0,
        activeCampaigns: 0,
        pendingTasks: 0,
      }
    }
  });
});

app.get('/api/customers', (req, res) => {
  res.json({
    customers: [],
    // TODO: Fetch from Firestore
  });
});

app.post('/api/customers', (req, res) => {
  // TODO: Create customer in Firestore
  res.json({
    success: true,
    message: 'Customer created',
    customer: req.body,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
