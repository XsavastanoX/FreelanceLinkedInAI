import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { GenerateForm } from "@/components/forms/generate-form";

export default async function GeneratePage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Post Generator</h2>
                <p className="text-muted-foreground">Turn your ideas into viral LinkedIn posts. ({user?.credits ?? 0} credits left)</p>
            </div>
            <GenerateForm credits={user?.credits ?? 0} />
        </div>
    );
}
