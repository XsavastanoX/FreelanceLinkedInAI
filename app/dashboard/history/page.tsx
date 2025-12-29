import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function HistoryPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    let userPosts: any[] = [];
    try {
        userPosts = await db.query.posts.findMany({
            where: eq(posts.userId, userId),
            orderBy: [desc(posts.createdAt)],
        });
    } catch (error) {
        console.error("Error fetching history:", error);
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">History</h2>
                <p className="text-muted-foreground">Your saved posts.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userPosts.length === 0 ? (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No saved posts yet.</p>
                    </div>
                ) : (
                    userPosts.map((post) => (
                        <Card key={post.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="outline">{post.tone}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(post.createdAt!).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-base line-clamp-1 mt-2">{post.topic}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="whitespace-pre-wrap text-sm line-clamp-6 text-muted-foreground">
                                    {post.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
