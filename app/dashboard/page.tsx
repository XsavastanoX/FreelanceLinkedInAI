import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    // Sync user if not exists
    let dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    });

    if (!dbUser) {
        await db.insert(users).values({
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
        });
        dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
    }


    const postCount = await db
        .select({ count: count(posts.id) })
        .from(posts)
        .where(eq(posts.userId, user.id));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <Button asChild>
                    <Link href="/dashboard/generate">Create New Post</Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{postCount[0]?.count ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Generated so far</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dbUser?.credits ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Upgrade for unlimited</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">No posts generated yet.</p>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Niche</p>
                            <p className="text-sm text-muted-foreground">{dbUser?.niche || "Not set"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Expertise</p>
                            <p className="text-sm text-muted-foreground">{dbUser?.expertise || "Not set"}</p>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/settings">Edit Profile</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
