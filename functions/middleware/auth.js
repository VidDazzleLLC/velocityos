const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Authentication middleware for Express routes
 * Verifies Firebase ID token from Authorization header
 */
async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized: No token provided',
      message: 'Please include a valid Firebase ID token in the Authorization header'
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid token',
      message: error.message
    });
  }
}

module.exports = { verifyAuth };
