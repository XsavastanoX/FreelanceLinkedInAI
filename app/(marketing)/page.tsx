import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col gap-16 py-8 md:py-12">
            {/* Hero Section */}
            <section className="container flex flex-col items-center gap-4 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Craft Viral LinkedIn Posts <br className="hidden sm:inline" />
                    <span className="text-primary">In Seconds, Not Hours</span>
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    The AI-powered writing assistant specialized for freelance web developers.
                    Share your wins, tips, and expertise without the writer's block.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" asChild>
                        <Link href="/sign-up">Start Writing for Free</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#pricing">View Pricing</Link>
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container grid gap-8 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Niche Optimized</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Trained on top-performing posts from successful freelancers and web developers.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Multiple Tones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Choose from Professional, Storyteller, Controversial, or Educational tones to match your brand.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Engagement Ready</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Posts come with hooks, formatting, emojis, and hashtags designed to stop the scroll.
                    </CardContent>
                </Card>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="container flex flex-col items-center gap-6 py-8">
                <h2 className="text-3xl font-bold tracking-tight">Simple Pricing</h2>
                <div className="grid w-full gap-8 md:grid-cols-2 lg:w-2/3">
                    {/* Basic Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-baseline justify-between">
                                Basic
                                <span className="text-2xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <ul className="grid gap-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 100 Posts/month</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard Tones</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> History & Saved Posts</li>
                            </ul>
                            <Button asChild className="w-full">
                                <Link href="/sign-up">Get Basic</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-primary shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-baseline justify-between">
                                Pro
                                <span className="text-2xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <ul className="grid gap-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Posts</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced Tones (Viral, Etc)</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                            </ul>
                            <Button asChild className="w-full" variant="default">
                                <Link href="/sign-up">Get Pro</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
