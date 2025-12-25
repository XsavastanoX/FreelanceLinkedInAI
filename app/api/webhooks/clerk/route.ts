import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

import { env } from "@/lib/env";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;



    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses } = evt.data;

        // Create user in database
        await db.insert(users).values({
            id: id,
            email: email_addresses[0].email_address,
            credits: 10, // Free tier credits
            subscriptionStatus: "inactive",
        });

        console.log(`User ${id} created in database`);
    }

    if (eventType === "user.updated") {
        const { id, email_addresses } = evt.data;

        // Update user email if changed
        await db
            .update(users)
            .set({
                email: email_addresses[0].email_address,
            })
            .where(eq(users.id, id));

        console.log(`User ${id} updated in database`);
    }

    return new Response("", { status: 200 });
}
