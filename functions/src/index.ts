import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import {z} from "zod";
import {GoogleGenerativeAI} from "@google/generative-ai";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
const logger = functions.logger;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "demo-key-not-configured"
);
const geminiModel = genAI.getGenerativeModel({model: "gemini-pro"});

// Create Express app
const app = express();

// Middleware
app.use(cors({origin: true}));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info("API Request", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
  });
  next();
});

// TypeScript Interfaces
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  googleWorkspaceId: string;
  workspaceDomain: string;
  role: "admin" | "user" | "viewer";
  permissions: string[];
  createdAt: admin.firestore.Timestamp;
  lastLogin: admin.firestore.Timestamp;
  settings: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tags: string[];
  status: "active" | "inactive" | "lead";
  assignedTo: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  metadata: Record<string, any>;
}

interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  timestamp: admin.firestore.Timestamp;
  data: Record<string, any>;
  source: "web" | "api" | "workspace";
}

interface Feedback {
  id: string;
  customerId: string;
  userId?: string;
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  category: string;
  timestamp: admin.firestore.Timestamp;
  resolved: boolean;
}

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "mixed";
  status: "draft" | "scheduled" | "running" | "completed";
  targetAudience: string[];
  content: string;
  scheduledAt?: admin.firestore.Timestamp;
  startedAt?: admin.firestore.Timestamp;
  completedAt?: admin.firestore.Timestamp;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
}

// Validation Schemas
const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["active", "inactive", "lead"]).default("lead"),
});

const feedbackSchema = z.object({
  customerId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  category: z.string().default("general"),
});

const campaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["email", "sms", "mixed"]),
  targetAudience: z.array(z.string()),
  content: z.string(),
});

// Error handling wrapper
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error("Request error", {
        error: error.message,
        stack: error.stack,
        path: req.path,
      });
      res.status(500).json({
        success: false,
        error: "Internal server error",
        message: error.message,
      });
    });
  };
};

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, {count: number; resetTime: number}>();
const RATE_LIMIT = 100; // requests per minute

const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string || "anonymous";
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, {
      count: 1,
      resetTime: now + 60000,
    });
    next();
  } else if (userLimit.count < RATE_LIMIT) {
    userLimit.count++;
    next();
  } else {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
    });
  }
};

app.use(rateLimitMiddleware);

// Basic health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({status: "ok", timestamp: Date.now()});
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "VelocityOS API",
    version: "1.0.0",
  });
});

// ===== API ENDPOINTS =====

// GET /api/analytics/dashboard
app.get("/analytics/dashboard",
  asyncHandler(async (req: Request, res: Response) => {
    const {startDate, endDate} = req.query;

    // Default to last 30 days
    const start = startDate ?
      new Date(startDate as string) :
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Query analytics events
    const eventsSnapshot = await db.collection("analytics_events")
      .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(start))
      .where("timestamp", "<=", admin.firestore.Timestamp.fromDate(end))
      .get();

    // Calculate metrics
    let totalRevenue = 0;
    const uniqueUsers = new Set<string>();
    let leadCount = 0;
    let customerCount = 0;

    eventsSnapshot.forEach((doc) => {
      const event = doc.data() as AnalyticsEvent;
      uniqueUsers.add(event.userId);

      if (event.eventType === "payment_completed") {
        totalRevenue += event.data.amount || 0;
      }
      if (event.eventType === "lead_created") {
        leadCount++;
      }
      if (event.eventType === "customer_converted") {
        customerCount++;
      }
    });

    // Get average feedback rating
    const feedbackSnapshot = await db.collection("feedback")
      .where("timestamp", ">=", admin.firestore.Timestamp.fromDate(start))
      .where("timestamp", "<=", admin.firestore.Timestamp.fromDate(end))
      .get();

    let totalRating = 0;
    let feedbackCount = 0;

    feedbackSnapshot.forEach((doc) => {
      const feedback = doc.data() as Feedback;
      totalRating += feedback.rating;
      feedbackCount++;
    });

    const averageSatisfaction = feedbackCount > 0 ?
      totalRating / feedbackCount : 0;
    const conversionRate = leadCount > 0 ?
      (customerCount / leadCount) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        revenue: totalRevenue,
        users: uniqueUsers.size,
        conversionRate: Math.round(conversionRate * 100) / 100,
        satisfaction: Math.round(averageSatisfaction * 100) / 100,
        charts: {
          period: {
            start: start.toISOString(),
            end: end.toISOString(),
          },
          totalEvents: eventsSnapshot.size,
          feedbackCount,
        },
      },
    });
  }));

// POST /api/customer/create
app.post("/customer/create",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createCustomerSchema.parse(req.body);

    // Check email uniqueness
    const existingCustomer = await db.collection("customers")
      .where("email", "==", validatedData.email)
      .limit(1)
      .get();

    if (!existingCustomer.empty) {
      res.status(400).json({
        success: false,
        error: "Email already exists",
        message: "A customer with this email already exists",
      });
      return;
    }

    // Create customer document
    const customerRef = db.collection("customers").doc();
    const now = admin.firestore.Timestamp.now();

    const customer: Customer = {
      id: customerRef.id,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.company,
      tags: validatedData.tags,
      status: validatedData.status,
      assignedTo: req.headers["x-user-id"] as string || "system",
      createdAt: now,
      updatedAt: now,
      metadata: {},
    };

    await customerRef.set(customer);

    // Log analytics event
    await db.collection("analytics_events").add({
      userId: req.headers["x-user-id"] as string || "system",
      eventType: "customer_created",
      timestamp: now,
      data: {customerId: customer.id, email: customer.email},
      source: "api",
    });

    res.status(201).json({
      success: true,
      customer,
    });
  }));

// GET /api/customer/list
app.get("/customer/list",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      page = "1",
      pageSize = "30",
      q,
      status,
      tags,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);

    let query: admin.firestore.Query = db.collection("customers");

    // Apply filters
    if (status) {
      query = query.where("status", "==", status);
    }

    if (tags) {
      const tagArray = (tags as string).split(",");
      query = query.where("tags", "array-contains-any", tagArray);
    }

    // Apply sorting
    query = query.orderBy(
    sortBy as string,
    sortOrder === "asc" ? "asc" : "desc"
    );

    // Get total count (for pagination)
    const allDocs = await query.get();
    const total = allDocs.size;

    // Apply pagination
    query = query.limit(pageSizeNum);
    if (pageNum > 1) {
      const offset = (pageNum - 1) * pageSizeNum;
      const docsToSkip = await db.collection("customers")
        .orderBy(sortBy as string, sortOrder === "asc" ? "asc" : "desc")
        .limit(offset)
        .get();
      if (!docsToSkip.empty) {
        const lastDoc = docsToSkip.docs[docsToSkip.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    let customers = snapshot.docs.map((doc) => doc.data() as Customer);

    // Apply search filter (client-side for simplicity)
    if (q) {
      const searchTerm = (q as string).toLowerCase();
      customers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm))
      );
    }

    res.status(200).json({
      success: true,
      customers,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  }));

// POST /api/voc/feedback
app.post("/voc/feedback",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = feedbackSchema.parse(req.body);

    // Use Gemini AI for sentiment analysis
    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    let sentimentScore = 0.5;

    try {
      const prompt = `Analyze the sentiment of this customer 
feedback and provide:
1. Overall sentiment (positive, neutral, or negative)
2. Sentiment score from 0 to 1 
(0 = very negative, 0.5 = neutral, 1 = very positive)

Feedback: "${validatedData.comment}"

Respond in JSON format: 
{"sentiment": "positive|neutral|negative", "score": 0.X}`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        sentiment = analysis.sentiment;
        sentimentScore = analysis.score;
      }
    } catch (error) {
      logger.warn(
        "Gemini AI sentiment analysis failed, using defaults",
        {error}
      );
      // Fallback to simple rule-based sentiment
      if (validatedData.rating >= 4) {
        sentiment = "positive";
        sentimentScore = 0.8;
      } else if (validatedData.rating <= 2) {
        sentiment = "negative";
        sentimentScore = 0.2;
      }
    }

    // Create feedback document
    const feedbackRef = db.collection("feedback").doc();
    const now = admin.firestore.Timestamp.now();

    const feedback: Feedback = {
      id: feedbackRef.id,
      customerId: validatedData.customerId,
      userId: req.headers["x-user-id"] as string,
      rating: validatedData.rating,
      comment: validatedData.comment,
      sentiment,
      sentimentScore,
      category: validatedData.category,
      timestamp: now,
      resolved: false,
    };

    await feedbackRef.set(feedback);

    // Trigger alert for low ratings
    if (validatedData.rating < 3) {
      logger.warn("Low rating feedback received", {
        feedbackId: feedback.id,
        customerId: feedback.customerId,
        rating: feedback.rating,
      });
    }

    res.status(201).json({
      success: true,
      feedback,
      sentiment: {
        sentiment,
        sentimentScore,
      },
    });
  }));

// POST /api/campaign/start
app.post("/campaign/start",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = campaignSchema.parse(req.body);

    // Create campaign document
    const campaignRef = db.collection("campaigns").doc();
    const now = admin.firestore.Timestamp.now();

    const campaign: Campaign = {
      id: campaignRef.id,
      name: validatedData.name,
      type: validatedData.type,
      status: "running",
      targetAudience: validatedData.targetAudience,
      content: validatedData.content,
      startedAt: now,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
      },
    };

    await campaignRef.set(campaign);

    let sent = 0;

    // Process email campaigns
    if (validatedData.type === "email" || validatedData.type === "mixed") {
      try {
      // In a real implementation, we would use Gmail API
      // For now, we'll simulate email sending
        logger.info("Sending emails for campaign", {
          campaignId: campaign.id,
          targetCount: validatedData.targetAudience.length,
        });

        // Simulate sending emails
        sent = validatedData.targetAudience.length;

        // Update campaign metrics
        await campaignRef.update({
          "metrics.sent": sent,
        });
      } catch (error) {
        logger.error("Error sending campaign emails", {error});
      }
    }

    // Process SMS campaigns
    if (validatedData.type === "sms" ||
        validatedData.type === "mixed") {
      logger.info(
        "SMS not implemented yet - placeholder for Twilio integration"
      );
    }

    res.status(201).json({
      success: true,
      campaign,
      sent,
    });
  }));

// POST /api/agent/restart
app.post("/agent/restart",
  asyncHandler(async (req: Request, res: Response) => {
    const {agentId} = req.body;

    if (!agentId) {
      res.status(400).json({
        success: false,
        error: "Missing agentId",
      });
      return;
    }

    const now = admin.firestore.Timestamp.now();

    // Update agent state
    const agentRef = db.collection("agents").doc(agentId);
    await agentRef.set({
      status: "active",
      lastActive: now,
      updatedAt: now,
    }, {merge: true});

    // Log lifecycle event
    await db.collection("analytics_events").add({
      userId: "system",
      eventType: "agent_restarted",
      timestamp: now,
      data: {agentId},
      source: "api",
    });

    res.status(200).json({
      success: true,
      agentId,
      status: "active",
      message: "Agent restarted successfully",
    });
  }));

// POST /api/gateway/dispatch
app.post("/gateway/dispatch",
  asyncHandler(async (req: Request, res: Response) => {
    const {service, method, params} = req.body;

    if (!service || !method) {
      res.status(400).json({
        success: false,
        error: "Missing service or method",
      });
      return;
    }

    const startTime = Date.now();

    // Route to appropriate service handler
    const result: any = {
      message: `Dispatched ${service}.${method}`,
      params,
    };

    // Log request/response
    logger.info("Gateway dispatch", {
      service,
      method,
      params,
    });

    const executionTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      result,
      executionTime,
    });
  }));

// AI-powered endpoints

// POST /api/ai/email-analysis
app.post("/ai/email-analysis",
  asyncHandler(async (req: Request, res: Response) => {
    const {emailContent} = req.body;

    if (!emailContent) {
      res.status(400).json({
        success: false,
        error: "Missing emailContent",
      });
      return;
    }

    const prompt = `Analyze this email and provide:
1. Priority level (high, medium, low)
2. Category (support, sales, general)
3. Sentiment (positive, neutral, negative)
4. Suggested response

Email: "${emailContent}"

Respond in JSON format.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.status(200).json({
      success: true,
      analysis,
    });
  }));

// POST /api/ai/schedule-meeting
app.post("/ai/schedule-meeting",
  asyncHandler(async (req: Request, res: Response) => {
    const {attendees, duration, preferences} = req.body;

    const prompt = `Based on the following requirements, 
suggest 3 optimal meeting times:
- Attendees: ${attendees?.join(", ") || "Not specified"}
- Duration: ${duration || "30"} minutes
- Preferences: ${JSON.stringify(preferences || {})}

Provide times in the next 7 days during business hours 
(9 AM - 5 PM).`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    res.status(200).json({
      success: true,
      suggestions,
    });
  }));

// POST /api/ai/summarize-document
app.post("/ai/summarize-document",
  asyncHandler(async (req: Request, res: Response) => {
    const {documentContent} = req.body;

    if (!documentContent) {
      res.status(400).json({
        success: false,
        error: "Missing documentContent",
      });
      return;
    }

    const prompt = `Summarize this document in a concise 
executive summary format:

${documentContent}

Provide:
1. Key points (bullet list)
2. Executive summary (2-3 paragraphs)`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      summary,
    });
  }));

// POST /api/ai/segment-customers
app.post("/ai/segment-customers",
  asyncHandler(async (req: Request, res: Response) => {
  // Get all customers
    const snapshot = await db.collection("customers").limit(100).get();
    const customers = snapshot.docs.map((doc) => doc.data());

    const prompt = `Analyze these customer profiles and 
create intelligent segments:

${JSON.stringify(customers, null, 2)}

Provide:
1. Recommended segments (with criteria)
2. Customer distribution across segments
3. Targeted actions for each segment`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const segments = response.text();

    res.status(200).json({
      success: true,
      segments,
    });
  }));

// POST /api/ai/predict
app.post("/ai/predict",
  asyncHandler(async (req: Request, res: Response) => {
    const {type, historicalData} = req.body;

    if (!type) {
      res.status(400).json({
        success: false,
        error: "Missing prediction type",
      });
      return;
    }

    const prompt = `Provide ${type} predictions based on this 
historical data:

${JSON.stringify(historicalData || {}, null, 2)}

Include:
1. Forecast for next 30 days
2. Confidence level
3. Key factors influencing the prediction
4. Recommendations`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const prediction = response.text();

    res.status(200).json({
      success: true,
      type,
      prediction,
    });
  }));

// Export the Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);

// ===== BACKGROUND JOBS - Google Workspace Sync =====

// Gmail Sync (every 5 minutes)
export const syncGmail = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    logger.info("Starting Gmail sync");

    try {
      // Get all users
      const usersSnapshot = await db.collection("users").limit(10).get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;

        logger.info("Syncing Gmail for user", {userId: user.uid});

        // In a real implementation, we would:
        // 1. Use Gmail API to fetch new emails
        // 2. Analyze with Gemini AI
        // 3. Store in Firestore
        // 4. Trigger auto-responses

        // Placeholder for now
        await db.collection("analytics_events").add({
          userId: user.uid,
          eventType: "gmail_sync_completed",
          timestamp: admin.firestore.Timestamp.now(),
          data: {emailsProcessed: 0},
          source: "workspace",
        });
      }

      logger.info("Gmail sync completed");
    } catch (error) {
      logger.error("Gmail sync failed", {error});
    }

    return null;
  });

// Calendar Sync (every 10 minutes)
export const syncCalendar = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async (context) => {
    logger.info("Starting Calendar sync");

    try {
      const usersSnapshot = await db.collection("users").limit(10).get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;
        logger.info("Syncing Calendar for user", {userId: user.uid});

        // Placeholder for Calendar API integration
        await db.collection("analytics_events").add({
          userId: user.uid,
          eventType: "calendar_sync_completed",
          timestamp: admin.firestore.Timestamp.now(),
          data: {eventsProcessed: 0},
          source: "workspace",
        });
      }

      logger.info("Calendar sync completed");
    } catch (error) {
      logger.error("Calendar sync failed", {error});
    }

    return null;
  });

// Drive Sync (every 30 minutes)
export const syncDrive = functions.pubsub
  .schedule("every 30 minutes")
  .onRun(async (context) => {
    logger.info("Starting Drive sync");

    try {
      const usersSnapshot = await db.collection("users").limit(10).get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;
        logger.info("Syncing Drive for user", {userId: user.uid});

        // Placeholder for Drive API integration
        await db.collection("analytics_events").add({
          userId: user.uid,
          eventType: "drive_sync_completed",
          timestamp: admin.firestore.Timestamp.now(),
          data: {filesProcessed: 0},
          source: "workspace",
        });
      }

      logger.info("Drive sync completed");
    } catch (error) {
      logger.error("Drive sync failed", {error});
    }

    return null;
  });

// Contacts Sync (daily)
export const syncContacts = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    logger.info("Starting Contacts sync");

    try {
      const usersSnapshot = await db.collection("users").limit(10).get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;
        logger.info("Syncing Contacts for user", {userId: user.uid});

        // Placeholder for Contacts API integration
        await db.collection("analytics_events").add({
          userId: user.uid,
          eventType: "contacts_sync_completed",
          timestamp: admin.firestore.Timestamp.now(),
          data: {contactsProcessed: 0},
          source: "workspace",
        });
      }

      logger.info("Contacts sync completed");
    } catch (error) {
      logger.error("Contacts sync failed", {error});
    }

    return null;
  });
