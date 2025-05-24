// app/page.tsx
"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/Featuresection";
import HowItWorksSection from "@/components/home/HowitworkSection";
import TestimonialsSection from "@/components/home/TestimonialSection";
import FeedbackForm from "@/components/home/FeadbackForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const { profile, loading } = useUserProfile();

  return (
    <div className="relative overflow-hidden">
      <Toaster />

      <HeroSection profile={profile} loading={loading} />

      {/* Always show features & “How It Works” */}
      <FeaturesSection />
      <HowItWorksSection />

      {/* Only show testimonials and final CTA when not signed in */}
      {!loading && !profile && <TestimonialsSection />}

      {/* Always show Feedback form */}
      <FeedbackForm />
    </div>
  );
}
