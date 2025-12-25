"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20 mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">Something went wrong!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
                {error.message || "An unexpected error occurred."}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">Try again</Button>
            </div>
        </div>
    );
}
