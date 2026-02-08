// velocity-os-rebuilt/app/api/stripe/create-checkout-session/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

// Real Stripe Price IDs from products created
const PLAN_PRICE_MAP: Record<
  string,
  { subscriptionPriceId: string; meteredPriceId?: string }
> = {
  velocityos_starter: {
    subscriptionPriceId: "price_1SySdRCG4fwlWp6y3cmiScxV",
  },
  founding_997: {
    subscriptionPriceId: "price_1SySacCG4fwlWp6yoqf4ell5",
  },
  agency_reseller: {
    subscriptionPriceId: "price_1SySbSCG4fwlWp6ySCmnNV4c",
  },
  velocityos_enterprise: {
    subscriptionPriceId: "price_1SyScJCG4fwlWp6yYRC6DDeC",
  },
};

interface CreateCheckoutSessionBody {
  email?: string;
  companyName?: string;
  planId?: string;
  orgId?: string;
}

function validateBody(body: CreateCheckoutSessionBody) {
  const errors: string[] = [];

  if (!body.email) errors.push("email is required");
  if (!body.companyName) errors.push("companyName is required");
  if (!body.planId) errors.push("planId is required");

  if (body.planId && !PLAN_PRICE_MAP[body.planId]) {
    errors.push(`Unknown planId: ${body.planId}`);
  }

  return errors;
}

async function getUserIdFromSession(): Promise<string | undefined> {
  // TODO: Integrate with your auth system (next-auth, Firebase Auth, etc.)
  // const session = await getServerSession(authOptions);
  // return session?.user?.id as string | undefined;
  return undefined;
}

export async function POST(req: NextRequest) {
  let body: CreateCheckoutSessionBody;

  try {
    body = (await req.json()) as CreateCheckoutSessionBody;
  } catch (err: any) {
    console.error("[stripe:create-checkout-session] Invalid JSON body", {
      error: err?.message || err,
    });
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const validationErrors = validateBody(body);
  if (validationErrors.length > 0) {
    console.warn("[stripe:create-checkout-session] Validation errors", {
      errors: validationErrors,
      body,
    });
    return NextResponse.json(
      { error: "Invalid request", details: validationErrors },
      { status: 400 }
    );
  }

  const { email, companyName, planId, orgId } = body;
  const priceConfig = PLAN_PRICE_MAP[planId!];

  let userId: string | undefined;
  try {
    userId = await getUserIdFromSession();
  } catch (err: any) {
    console.error("[stripe:create-checkout-session] Failed to load session", {
      error: err?.message || err,
    });
  }

  const origin =
    req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

  const successUrl = `${origin}/enrollment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/enrollment/cancel`;

  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: priceConfig.subscriptionPriceId,
        quantity: 1,
      },
    ];

    if (priceConfig.meteredPriceId) {
      lineItems.push({
        price: priceConfig.meteredPriceId,
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId: planId!,
        companyName: companyName!,
        userId: userId ?? "",
        orgId: orgId ?? "",
      },
      allow_promotion_codes: true,
    });

    console.log("[stripe:create-checkout-session] Created session", {
      sessionId: session.id,
      email,
      planId,
      orgId,
      userId,
    });

    return NextResponse.json(
      { url: session.url },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[stripe:create-checkout-session] Stripe API error", {
      error: err?.message || err,
      stack: err?.stack,
      body,
    });

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        message: err?.message ?? "Stripe API error",
      },
      { status: 500 }
    );
  }
}
