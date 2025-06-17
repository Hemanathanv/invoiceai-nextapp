// Name: V.Hemanathan
// Describe: This component is used to display the hero section.It is used in the main home page.
// Framework: Next.js -15.3.2


"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Profile } from "@/hooks/useUserProfile";

interface HeroSectionProps {
  profile: Profile | null;
  loading: boolean;
}

export default function HeroSection({ profile, loading }: HeroSectionProps) {
  // While loading, we can show nothing or a placeholder. Often you’d display a spinner,
  // but since Home also shows other sections below, we’ll just return null here.
  if (loading) return null;

  return (
    <section className="relative w-sceen h-screen overflow-hidden bg-white">
      <div className="flex justify-center content-center items-center w-full h-full relative z-10 text-center">
        {profile ? (
          // ─── Signed‐in Hero ───
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-4">
              Welcome back, <span className="text-purple-600">{profile.name}</span>!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              You’re on the “{profile.subscription_tier}” plan.
            </p>
            <div className="flex justify-center gap-4">
              {profile.subscription_tier === "Free" ? (
                <>
                <Link href="/pricing" passHref>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                  >
                    Upgrade to Pro
                  </Button>
                </Link>
                <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  variant="outline"
                >
                  View Dashboard
                </Button>
              </Link>
              </>
              ) : (
                <Button size="lg" variant="outline" disabled>
                  You’re on {profile.subscription_tier.charAt(0).toUpperCase() +
                    profile.subscription_tier.slice(1)}
                </Button>
              )}
            </div>
          </div>
        ) : (
          // ─── Logged‐out Hero ───
          <div>
            <h1 className="max-w-3xl mx-auto text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Extract invoice data{" "}
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                automatically
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Save hours of manual data entry with our AI-powered invoice
              extraction platform. Process invoices, receipts, and documents
              in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login" passHref>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                >
                  Try for Free
                </Button>
              </Link>
              <Link href="/pricing" passHref>
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Abstract background circles (shared) */}
      <div className="absolute -top-96 -left-60 w-[800px] h-[800px] bg-purple-300 blur-3xl opacity-30 rounded-full rotate-45 animate-pulse-gentle" />
      <div className="absolute -bottom-96 -right-60 w-[900px] h-[900px] bg-blue-300 blur-3xl opacity-30 rounded-full rotate-45 animate-pulse-gentle" />
    </section>
  );
}