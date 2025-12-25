import { z } from "zod";

export const generatePostSchema = z.object({
    topic: z.string().min(5, "Topic must be at least 5 characters").max(200, "Topic must be less than 200 characters"),
    tone: z.enum(["professional", "casual", "humorous", "controversial", "educational"]),
});

export const userProfileSchema = z.object({
    niche: z.string().min(2, "Niche must be at least 2 characters").max(50, "Niche must be less than 50 characters"),
    expertise: z.string().min(2, "Expertise must be at least 2 characters").max(50, "Expertise must be less than 50 characters"),
});

export type GeneratePostValues = z.infer<typeof generatePostSchema>;
export type UserProfileValues = z.infer<typeof userProfileSchema>;
