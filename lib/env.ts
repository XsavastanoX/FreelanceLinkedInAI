import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk Publishable Key is missing"),
    CLERK_SECRET_KEY: z.string().min(1, "Clerk Secret Key is missing"),
    OPENAI_API_KEY: z.string().min(1, "OpenAI API Key is missing"),
    STRIPE_SECRET_KEY: z.string().min(1, "Stripe Secret Key is missing"),
    STRIPE_PRICE_ID: z.string().min(1, "Stripe Price ID is missing"),
    CLERK_WEBHOOK_SECRET: z.string().min(1, "Clerk Webhook Secret is missing"),
    STRIPE_WEBHOOK_SECRET: z.string().min(1, "Stripe Webhook Secret is missing"),
    NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
