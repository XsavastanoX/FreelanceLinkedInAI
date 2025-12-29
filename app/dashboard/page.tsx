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

    // Default values in case of DB failure
    let dbUser = null;
    let postCountValue = 0;

    try {
        // Sync user if not exists
        dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
        });

        if (!dbUser) {
            const email = user.emailAddresses[0]?.emailAddress;
            if (email) {
                await db.insert(users).values({
                    id: user.id,
                    email: email,
                });
                dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
            }
        }
    } catch (error) {
        console.error("Error syncing user to DB:", error);
    }

    try {
        const postCount = await db
            .select({ count: count(posts.id) })
            .from(posts)
            .where(eq(posts.userId, user.id));
        postCountValue = postCount[0]?.count ?? 0;
    } catch (error) {
        console.error("Error fetching post count:", error);
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                <div className="max-w-3xl space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">Welcome to FreelancePostAI</h1>
                    <p className="text-lg text-blue-100">
                        Generate high-converting LinkedIn posts tailored to your freelance niche in seconds.
                        Stop staring at a blank screen and start engaging your audience.
                    </p>
                    <div className="pt-2">
                        <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold border-0">
                            <Link href="/dashboard/generate">
                                <FileText className="mr-2 h-5 w-5" />
                                Start Creating Now
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{postCountValue}</div>
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <div className="bg-slate-100 p-3 rounded-full">
                                <FileText className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                No recent posts found. Start generating content to see your history here.
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/generate">Create Post</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Niche</p>
                                <p className="text-sm font-medium">{dbUser?.niche || "Not set"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expertise</p>
                                <p className="text-sm font-medium">{dbUser?.expertise || "Not set"}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/settings">Edit Profile Settings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
