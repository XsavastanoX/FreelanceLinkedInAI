"use server";

import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generatePostSchema } from "@/lib/schemas";

export async function generatePost(topic: string, tone: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // validation
    const result = generatePostSchema.safeParse({ topic, tone });
    if (!result.success) {
        throw new Error("Invalid input: " + result.error.issues.map(e => e.message).join(", "));
    }

    const input = result.data;

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) throw new Error("User not found");

    // Allow if subscription is active OR has credits
    const isPro = user.subscriptionStatus === "active";
    if (!isPro && (user.credits ?? 0) <= 0) {
        throw new Error("No credits remaining. Please upgrade.");
    }

    // AI Generation
    const systemPrompt = `You are a professional LinkedIn ghostwriter for freelance web developers.
  Your goal is to write engaging, viral-worthy LinkedIn posts.
  
  User Profile:
  Niche: ${user.niche || "Web Development"}
  Expertise: ${user.expertise || "General"}
  
  Instructions:
  - Generate 5 distinct variations based on the user's topic.
  - Tone: ${input.tone}.
  - Use appropriate emojis and line breaks.
  - Include 3-5 relevant hashtags.
  - Return the response as a valid JSON array of strings. Do not include markdown code blocks around the JSON.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Topic: ${input.topic}` },
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        // Clean potential markdown code blocks
        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

        let variations: string[] = [];
        try {
            variations = JSON.parse(cleanContent);
        } catch (e) {
            // Fallback if not valid JSON (split by double newline or something, but best to force JSON)
            variations = [cleanContent];
        }

        // Decrement credits logic - only if not Pro
        if (!isPro) {
            await db.update(users).set({ credits: (user.credits || 0) - 1 }).where(eq(users.id, userId));
        }

        return variations;

    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to generate post");
    }
}

export async function savePost(content: string, topic: string, tone: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.insert(posts).values({
        userId,
        content,
        topic, // Note: We could validate these too if we wanted strictness, but they inevitably came from the form.
        tone,
    });

    revalidatePath("/dashboard/history");
}
