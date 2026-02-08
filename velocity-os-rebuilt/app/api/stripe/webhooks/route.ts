// velocity-os-rebuilt/app/api/stripe/webhooks/route.ts

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Stripe & Firebase Setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

// Types
type CheckoutSessionCompleted = Stripe.Checkout.Session & {
  metadata?: {
    orgId?: string;
    planId?: string;
    userId?: string;
    referralCode?: string;
  };
};

interface OrganizationDoc {
  name: string | null;
  ownerUserId: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  planId: string | null;
  createdAt: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
  credits: {
    aiTokens: number;
    emails: number;
    storageMb: number;
  };
  status: "active" | "trialing" | "past_due" | "canceled";
  source: "stripe_checkout";
}

// Helpers
async function getRawBody(req: Request): Promise<string> {
  const arrayBuffer = await req.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("utf8");
}

function getStripeSignature(): string {
  const sig = headers().get("stripe-signature");
  if (!sig) {
    throw new Error("Missing Stripe signature header");
  }
  return sig;
}

function constructStripeEvent(rawBody: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET env var");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}

function getInitialCreditsForPlan(planId: string | null): {
  aiTokens: number;
  emails: number;
  storageMb: number;
} {
  switch (planId) {
    case "founding_997":
      return {
        aiTokens: 1_000_000,
        emails: 100_000,
        storageMb: 50_000,
      };
    case "agency_reseller":
      return {
        aiTokens: 2_000_000,
        emails: 200_000,
        storageMb: 100_000,
      };
    case "velocityos_enterprise":
      return {
        aiTokens: 3_000_000,
        emails: 300_000,
        storageMb: 150_000,
      };
    default:
      return {
        aiTokens: 250_000,
        emails: 25_000,
        storageMb: 10_000,
      };
  }
}

async function handleCheckoutSessionCompleted(
  session: CheckoutSessionCompleted
): Promise<void> {
  const customerId = session.customer as string | null;
  const subscriptionId = session.subscription as string | null;

  if (!customerId) {
    console.error("[stripe:webhooks] Missing customer ID", {
      sessionId: session.id,
    });
    return;
  }

  const metadata = session.metadata || {};
  const orgIdFromMetadata = metadata.orgId || null;
  const planId = metadata.planId || null;
  const ownerUserId = metadata.userId || null;

  const credits = getInitialCreditsForPlan(planId);
  const now = admin.firestore.FieldValue.serverTimestamp();

  const orgRef = orgIdFromMetadata
    ? db.collection("organizations").doc(orgIdFromMetadata)
    : db.collection("organizations").doc();

  const orgDoc: OrganizationDoc = {
    name: session.customer_details?.name ?? null,
    ownerUserId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    planId,
    createdAt: now,
    updatedAt: now,
    credits,
    status: "active",
    source: "stripe_checkout",
  };

  console.log("[stripe:webhooks] Upserting organization", {
    sessionId: session.id,
    orgId: orgRef.id,
    customerId,
    subscriptionId,
    planId,
  });

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(orgRef);

    if (!snap.exists) {
      tx.set(orgRef, orgDoc);
    } else {
      const existing = snap.data() as Partial<OrganizationDoc>;
      const existingCredits = existing.credits || {
        aiTokens: 0,
        emails: 0,
        storageMb: 0,
      };

      tx.update(orgRef, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        planId,
        updatedAt: now,
        status: "active",
        credits: {
          aiTokens: existingCredits.aiTokens + credits.aiTokens,
          emails: existingCredits.emails + credits.emails,
          storageMb: existingCredits.storageMb + credits.storageMb,
        },
      });
    }
  });

  console.log("[stripe:webhooks] Organization upserted", {
    orgId: orgRef.id,
  });
}

// Main Webhook Handler
export async function POST(req: Request) {
  let rawBody: string;
  let signature: string;
  let event: Stripe.Event;

  try {
    rawBody = await getRawBody(req);
    signature = getStripeSignature();
  } catch (err: any) {
    console.error("[stripe:webhooks] Failed to read request", {
      error: err?.message || err,
    });
    return NextResponse.json(
      { error: "Bad Request: missing body or stripe-signature" },
      { status: 400 }
    );
  }

  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (err: any) {
    console.error("[stripe:webhooks] Signature verification failed", {
      error: err?.message || err,
    });
    return NextResponse.json(
      { error: `Webhook Error: ${err?.message ?? "Invalid signature"}` },
      { status: 400 }
    );
  }

  console.log("[stripe:webhooks] Received event", {
    id: event.id,
    type: event.type,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as CheckoutSessionCompleted;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      default: {
        console.log("[stripe:webhooks] Unhandled event type", { type: event.type });
      }
    }
  } catch (err: any) {
    console.error("[stripe:webhooks] Error handling event", {
      id: event.id,
      type: event.type,
      error: err?.message || err,
      stack: err?.stack,
    });

    return NextResponse.json(
      { error: "Internal error while processing webhook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export function GET() {
  return NextResponse.json(
    { message: "Stripe webhooks endpoint is alive" },
    { status: 200 }
  );
}
