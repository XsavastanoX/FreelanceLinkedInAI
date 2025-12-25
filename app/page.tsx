import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, DollarSign } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600" />
            <span className="text-lg font-bold tracking-tight">FreelancePostAI</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-white text-black hover:bg-zinc-200">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
          <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 py-1.5 px-3 text-sm text-zinc-400 mb-8 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
              <span>Powered by GPT-4o</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
              Viral LinkedIn Posts for <br /> Freelance Developers
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Stop staring at a blank screen. Generate engagement-optimized posts tailored to your niche in seconds.
              Build your personal brand while you build code.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-white hover:from-purple-500 hover:to-blue-500 border-0">
                  Start Generating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-zinc-950">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Instant Inspiration</h3>
                <p className="text-zinc-400">Never run out of ideas. Turn a single achievement or thought into 5 distinct post variations.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="mb-2 text-xl font-bold">Multiple Tones</h3>
                <p className="text-zinc-400">Whether you want to be Professional, Storytelling, or share a Hot Take, we have a mode for that.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Client Magnet</h3>
                <p className="text-zinc-400">Consistent posting attracts leads. We make consistency effortless so you can focus on work.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-zinc-400">Start for free, upgrade for power.</p>
            </div>

            <div className="grid gap-8 max-w-4xl mx-auto md:grid-cols-2">
              {/* Free Tier */}
              <div className="rounded-3xl border border-white/10 p-8 ring-1 ring-white/10">
                <h3 className="text-lg font-semibold leading-8 text-white">Starter</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-400">Perfect for trying it out.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">Free</span>
                </p>
                <Link href="/sign-up">
                  <Button variant="outline" className="mt-6 w-full text-white border-white/20 hover:bg-white/10 hover:text-white">
                    Get Started
                  </Button>
                </Link>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-300">
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> 10 Credits / Month</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> Basic Tones</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> Save History</li>
                </ul>
              </div>

              {/* Pro Tier */}
              <div className="relative rounded-3xl border border-purple-500/60 bg-white/5 p-8 ring-1 ring-purple-500/60">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                  Most Popular
                </div>
                <h3 className="text-lg font-semibold leading-8 text-white">Professional</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-400">For serious personal branding.</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">$19</span>
                  <span className="text-sm font-semibold leading-6 text-zinc-400">/month</span>
                </p>
                <Link href="/dashboard/settings">
                  <Button className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white">
                    Subscribe Now
                  </Button>
                </Link>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-300">
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> Unlimited Credits</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> All Tones & Styles</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> Priority Support</li>
                  <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-400" /> Early Access Features</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 bg-black">
          <div className="container mx-auto px-6 text-center text-zinc-500">
            <p>&copy; {new Date().getFullYear()} FreelancePostAI. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
