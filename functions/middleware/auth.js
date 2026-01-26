const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Authentication middleware for Express routes
 * Verifies Firebase ID token from Authorization header
 * Includes comprehensive error handling for production use
 */
async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'No Authorization header provided',
      code: 'NO_AUTH_HEADER'
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authorization header must use Bearer scheme',
      code: 'INVALID_AUTH_SCHEME'
    });
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'No token provided in Authorization header',
      code: 'NO_TOKEN'
    });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if token is expired (additional safety check)
    const now = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < now) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    // Attach user info to request
    req.user = decodedToken;
    
    // Log successful authentication (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Authenticated user: ${decodedToken.email || decodedToken.uid}`);
    }
    
    next();
  } catch (error) {
    console.error('Token verification failed:', {
      error: error.code,
      message: error.message,
      path: req.path,
    });
    
    // Handle specific Firebase Auth errors
    let errorMessage = 'Invalid or expired token';
    let errorCode = 'INVALID_TOKEN';

    if (error.code === 'auth/id-token-expired') {
      errorMessage = 'Token has expired. Please sign in again';
      errorCode = 'TOKEN_EXPIRED';
    } else if (error.code === 'auth/id-token-revoked') {
      errorMessage = 'Token has been revoked. Please sign in again';
      errorCode = 'TOKEN_REVOKED';
    } else if (error.code === 'auth/argument-error') {
      errorMessage = 'Malformed token. Please sign in again';
      errorCode = 'MALFORMED_TOKEN';
    } else if (error.code === 'auth/invalid-id-token') {
      errorMessage = 'Invalid token format. Please sign in again';
      errorCode = 'INVALID_TOKEN_FORMAT';
    }
    
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: errorMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

module.exports = { verifyAuth };
