"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";

const STRIPE_PRICE_ID = env.STRIPE_PRICE_ID;

export async function createStripeSession() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!dbUser) throw new Error("User not found in database");

    // returnUrl is where user comes back to
    const returnUrl = env.NEXT_PUBLIC_APP_URL + "/dashboard/settings";

    // 1. If user has a stripeCustomerId, check if they are already subscribed (or we just open portal)
    if (dbUser.stripeCustomerId && dbUser.subscriptionStatus === "active") {
        // Open Customer Portal
        const session = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: returnUrl,
        });
        return { url: session.url };
    }

    // 2. Otherwise create a Checkout Session
    // If we don't have a customer ID yet, Stripe will create one during checkout (or we create one here)
    // Be careful with duplicate customers if we don't save it. For this MVP, we rely on email matching or Stripe creates new.
    // Better practice: Create customer if missing.

    let customerId = dbUser.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.emailAddresses[0].emailAddress,
            metadata: {
                userId: userId,
            },
        });
        customerId = customer.id;

        await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: STRIPE_PRICE_ID,
                quantity: 1,
            },
        ],
        success_url: returnUrl + "?success=true",
        cancel_url: returnUrl + "?canceled=true",
        metadata: {
            userId: userId,
        },
    });

    return { url: session.url };
}
