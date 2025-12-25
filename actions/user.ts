"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { userProfileSchema } from "@/lib/schemas";

export async function checkAuth() {
    const { userId } = await auth();
    if (!userId) return null;
    return userId;
}

export async function syncUser() {
    const user = await currentUser();
    if (!user) return null;

    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    });

    if (!existingUser) {
        await db.insert(users).values({
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
        });
    }

    return existingUser;
}

export async function updateUserProfile(data: { niche: string; expertise: string }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const result = userProfileSchema.safeParse(data);
    if (!result.success) {
        throw new Error("Invalid input: " + result.error.issues.map(e => e.message).join(", "));
    }

    const { niche, expertise } = result.data;

    await db.update(users)
        .set({
            niche,
            expertise,
        })
        .where(eq(users.id, userId));

    revalidatePath("/dashboard");
}
