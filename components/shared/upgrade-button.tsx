"use client";

import { createCheckoutSession } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

interface UpgradeButtonProps {
    priceId: string;
    children: React.ReactNode;
}

export function UpgradeButton({ priceId, children }: UpgradeButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpgrade = () => {
        startTransition(async () => {
            try {
                await createCheckoutSession(priceId);
            } catch (error) {
                alert("Failed to start checkout. Please try again.");
            }
        });
    };

    return (
        <Button onClick={handleUpgrade} disabled={isPending} className="w-full">
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </>
            ) : (
                children
            )}
        </Button>
    );
}
