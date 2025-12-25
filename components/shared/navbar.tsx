import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { MobileSidebar } from "@/components/shared/mobile-sidebar";

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <SignedIn>
                        <MobileSidebar />
                    </SignedIn>
                    <Link href="/" className="flex items-center text-primary">
                        <span>FreelancePostAI</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Button variant="ghost" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <Button variant="ghost" asChild>
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </SignedOut>
                </div>
            </div>
        </nav>
    );
}
