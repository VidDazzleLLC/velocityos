import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, {Request, Response} from "express";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Basic health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({status: "ok", timestamp: Date.now()});
});

// API routes will be added here
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "VelocityOS API",
    version: "1.0.0",
  });
});

// Export the Express app as a Firebase Cloud Function
// This will be accessible at /api/** as configured in firebase.json
export const api = functions.https.onRequest(app);
