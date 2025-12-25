import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(), // Clerk User ID
    email: text("email").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    subscriptionStatus: text("subscription_status").default("inactive"),
    credits: integer("credits").default(10), // Free tier credits
    niche: text("niche"),
    expertise: text("expertise"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    content: text("content").notNull(),
    topic: text("topic"),
    tone: text("tone"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    status: text("status").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
});
