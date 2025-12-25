import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { env } from "@/lib/env";


export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return new NextResponse("Webhook error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;

        if (!session?.metadata?.userId) {
            return new NextResponse("User id is required", { status: 400 });
        }

        // Update user subscription status
        await db.update(users)
            .set({
                stripeCustomerId: session.customer as string,
                subscriptionStatus: "active",
                // For MVP, assuming Basic adds 100 credits, Pro adds Unlimited (e.g. 9999).
                // Logic should be more robust in real app based on price ID
                credits: 100
            })
            .where(eq(users.id, session.metadata.userId));

        // Insert subscription record
        await db.insert(subscriptions).values({
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // In real app, look up user by customer ID and renew credits
        // await db.update(users).set({ ... }).where(...)
    }

    return new NextResponse(null, { status: 200 });
}
