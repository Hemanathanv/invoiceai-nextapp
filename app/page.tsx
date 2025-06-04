// app/page.tsx
"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/Featuresection";
import HowItWorksSection from "@/components/home/HowitworkSection";
import TestimonialsSection from "@/components/home/TestimonialSection";
import FeedbackForm from "@/components/home/FeadbackForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Toaster } from "@/components/ui/sonner";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { profile, loading } = useUserProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".card1");
    console.log("cards", cards);
    cards?.forEach((card) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 80,
          scale: 0.95,
          duration: 0.8,
          animationTiming: 0.8,
          ease: "power3.out",
          rotate: -45, // Start with a slight rotation
          // Initial state for the animation
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          rotate: 0,
          // scrollTrigger: {
          //   trigger: card,
          //   start: "top 80%",
          //   end: "bottom 20%",
          //   toggleActions: "play reverse play reverse", // don't reverse until fully out
          //   markers: false,  
          // }
          scrollTrigger: {
            trigger: card,
            start: "top -14%",          // When top of card hits 80% of viewport
            end: "bottom -70%",         // When bottom of card hits 20% of viewport
            toggleActions: "play reverse play reverse", // onEnter, onLeave, onEnterBack, onLeaveBack
            markers: false,            // Set to true for debugging
          },
        }
      );
    });
  }, []);
  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <Toaster />{" "}
      {/* Already using the Toaster component in layout need to remove---BY Raiblan */}
      <HeroSection profile={profile} loading={loading} />
      {/* Always show features & “How It Works” */}
      <div className="flex w-full h-full flex-col md:felx-row lg:flex-row xl:flex-row 2xl:flex-row">
        <div className="card1">
          <FeaturesSection />
        </div>
        <div className="card1">
          <HowItWorksSection />
        </div>
      </div>
      {/* Only show testimonials and final CTA when not signed in */}
      {!loading && !profile && <TestimonialsSection />}
      {/* Always show Feedback form */}
      <FeedbackForm />
    </div>
  );
}
