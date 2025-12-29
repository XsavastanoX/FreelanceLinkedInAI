import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/forms/profile-form";
import { SubscriptionCard } from "@/components/subscription-card";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    let user;
    try {
        user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });
    } catch (error) {
        console.error("Error fetching user for settings:", error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            <ProfileForm
                initialNiche={user?.niche}
                initialExpertise={user?.expertise}
            />

            <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Subscription & Billing</h3>
                <SubscriptionCard
                    isPro={user?.subscriptionStatus === "active"}
                    credits={user?.credits ?? 0}
                />
            </div>
        </div>
    );
}
