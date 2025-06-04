// app/pricing/page.tsx
"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import PricingCard from "@/app/pricing/_components/PricingCard";
// import Link from "next/link";

export default function PricingPage() {
  // 1) Grab the current user's profile (loading and subscription_tier)
  const { profile, loading } = useUserProfile();

  // 2) While we're still fetching, render nothing (or a spinner if you prefer)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-500">Loading plans…</span>
      </div>
    );
  }

  // 3) Helper to decide if THIS card is the user's current plan
  const isCurrentPlan = (tier: string) => {
    return tier === profile?.subscription_tier;
  };

  // 4) For each plan, pick button text + disabled flag
  const getButtonProps = (tier: string, defaultText: string) => {
    if (profile && isCurrentPlan(tier)) {
      
      return { buttonText: "Current Plan", disabled: true };
    } 
    console.log("profile", tier);
    return { buttonText: defaultText, disabled: false };

  };

  // 5) Define feature lists (unchanged)
  const freeFeatures = [
    { text: "Up to 5 document uploads", included: true },
    { text: "5 extraction requests per day", included: true },
    { text: "Standard field extraction", included: true },
    { text: "Custom field extraction", included: true },
  ];

  const proFeatures = [
    { text: "Up to 100 document uploads", included: true },
    { text: "1000 extraction requests per day", included: true },
    { text: "Standard field extraction", included: true },
    { text: "Custom field extraction", included: true },
    { text: "Priority support", included: true },
  ];

  const enterpriseFeatures = [
    { text: "Unlimited document uploads", included: true },
    { text: "Unlimited extraction requests", included: true },
    { text: "Standard field extraction", included: true },
    { text: "Custom field extraction", included: true },
    { text: "Dedicated support", included: true },
  ];

  const authorisedFeatures = [
    { text: "Only for Authorised Users", included: true },
    { text: "Unlimited Usage", included: true },
    { text: "Standard field extraction", included: true },
    { text: "Custom field extraction", included: true },
  ];

  // 6) Render all cards, injecting our dynamic button props
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ─────────── Free Plan ─────────── */}
            <PricingCard
              title="Free"
              description="Perfect for trying out the platform"
              price="0"
              features={freeFeatures}
              tier="Free"
              {...getButtonProps("Free", "Get Started")}
            />

            {/* ─────────── Pro Plan ─────────── */}
            <PricingCard
              title="Pro"
              description="For businesses processing multiple invoices"
              price="49"
              features={proFeatures}
              popular={true}
              tier="Pro"
              {...getButtonProps("Pro", "Upgrade to Pro")}
            />

            {/* ─────────── Enterprise Plan ─────────── */}
            <PricingCard
              title="Enterprise"
              description="For organizations with high-volume needs"
              price={null}
              features={enterpriseFeatures}
              tier="Enterprise"
              {...getButtonProps("Enterprise", "Contact Sales")}
            />
          </div>

          {/* If you also want an “Authorised Users” card: */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <PricingCard
              title="Authorised Users"
              description="Special plan for authorised users"
              price={null}
              features={authorisedFeatures}
              tier="Authorised"
              {...getButtonProps("Authorised", "Contact Sales")}
            />
          </div>

          <div className="mt-16 bg-accent rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">
                  What happens when I reach my usage limit?
                </h3>
                <p className="text-muted-foreground">
                  You’ll be notified when you’re approaching your limits. You can
                  upgrade your plan at any time to increase your limits.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You’ll
                  continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What file formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support PDF documents and various image formats including
                  JPG, PNG, and TIFF.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, we use industry‐standard encryption and security practices
                  to protect your data. All files are processed securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
