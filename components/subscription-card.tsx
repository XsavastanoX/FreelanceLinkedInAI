"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Sparkles } from "lucide-react";
import { useTransition } from "react";
import { createStripeSession } from "@/actions/subscription";

interface SubscriptionCardProps {
    isPro: boolean;
    credits: number;
}

export function SubscriptionCard({ isPro, credits }: SubscriptionCardProps) {
    const [isPending, startTransition] = useTransition();

    const handleManageSubscription = () => {
        startTransition(async () => {
            try {
                const { url } = await createStripeSession();
                if (url) {
                    window.location.href = url;
                } else {
                    alert("Failed to create session");
                }
            } catch (error) {
                console.error(error);
                alert("Something went wrong. Please check your configuration.");
            }
        });
    };

    return (
        <Card className="border-purple-500/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle>Subscription</CardTitle>
                        {isPro ? (
                            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">Pro Plan</Badge>
                        ) : (
                            <Badge variant="outline">Free Plan</Badge>
                        )}
                    </div>
                </div>
                <CardDescription>
                    Manage your plan and billing details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Credits Remaining
                        </label>
                        <p className="text-sm text-muted-foreground">
                            {isPro ? "Unlimited" : `${credits} credits this month`}
                        </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-purple-500" />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleManageSubscription}
                    disabled={isPending}
                    className="w-full sm:w-auto"
                    variant={isPro ? "outline" : "default"}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
