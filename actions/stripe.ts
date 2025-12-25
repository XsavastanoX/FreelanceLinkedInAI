"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export async function createCheckoutSession(priceId: string) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return redirect("/sign-in");
    }

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!dbUser) {
        throw new Error("User not found");
    }

    let customerId = dbUser.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.emailAddresses[0].emailAddress,
            metadata: {
                userId,
            },
        });
        customerId = customer.id;
        await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
        metadata: {
            userId,
        },
    });

    if (!checkoutSession.url) throw new Error("Failed to create checkout session");

    redirect(checkoutSession.url);
}
