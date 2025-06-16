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
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
import { useEffect, useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { profile, loading } = useUserProfile();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     
    const cards = containerRef.current?.querySelectorAll(".card1");
    const cards2 = containerRef.current?.querySelectorAll(".card2");
    const cards3 = containerRef.current?.querySelectorAll(".card3");

    cards?.forEach((card) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 80,
          scale: 0.95,
          duration: 0.6,
          animationTiming: 0.2,
          ease: "power3.out",
          rotate: -5, // Start with a slight rotation
          // Initial state for the animation
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          rotate: 0,
          scrollTrigger: {
            trigger: card,
            start: "top -14%",          // When top of card hits 80% of viewport
            end: "bottom -50%",         // When bottom of card hits 20% of viewport
            toggleActions: "play reverse play reverse", // onEnter, onLeave, onEnterBack, onLeaveBack
            markers: false,            // Set to true for debugging
          },
        }
      );
    });
    
cards2?.forEach((card) => {
  gsap.fromTo(
    card,
    {
      opacity: 0,
      x: 100,
      rotateY: 10,
    },
    {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
          start: "top -25%",          // When top of card hits 80% of viewport
            end: "bottom -90%",  
        toggleActions: "play reverse play reverse",
        markers: false,
      },
    }
  );
});
    
cards3?.forEach((card) => {
  gsap.fromTo(
    card,
    {
      opacity: 0,
      x: 100,
      rotatey: 10,
    },
    {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
          start: "top -25%",          // When top of card hits 80% of viewport
            end: "bottom -90%",  
        toggleActions: "play reverse play reverse",
        markers: false,
      },
    }
  );
});
const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.2, // Slower scroll
  effects: true,
});
const cursor = document.getElementById("custom-cursor");
const targetAreas = containerRef.current?.querySelectorAll(".cursor-area");

const moveCursor = (e: MouseEvent) => {
  if (cursor) {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  }
};

const showCursor = () => {
  if (cursor) cursor.style.opacity = "1";
};

const hideCursor = () => {
  if (cursor) cursor.style.opacity = "0";
};

targetAreas?.forEach((el) => {
  el.addEventListener("mouseenter", showCursor);
  el.addEventListener("mouseleave", hideCursor);
  el.addEventListener("mousemove", moveCursor as EventListener);
});

return () => {
  targetAreas?.forEach((el) => {
    el.removeEventListener("mouseenter", showCursor);
    el.removeEventListener("mouseleave", hideCursor);
    el.removeEventListener("mousemove", moveCursor as EventListener);
    smoother.kill();
  });
};

  }, []);
  return (
    <div id="smooth-wrapper">
  <div id="smooth-content">

    <div ref={containerRef} className="relative overflow-hidden">
      <Toaster />{" "}
      {/* Already using the Toaster component in layout need to remove---BY Raiblan */}
      <HeroSection profile={profile} loading={loading} />
      {/* Always show features & “How It Works” */}
      <div className="flex w-full h-full flex-col md:felx-row lg:flex-row xl:flex-row 2xl:flex-row">
        <div className="card3">
          <FeaturesSection />
        </div>
        <div className="card2">
          <HowItWorksSection />
        </div>
      </div>
      {/* Only show testimonials and final CTA when not signed in */}
      {!loading && !profile && <div className="card3"> <TestimonialsSection  /></div>}
      {/* Always show Feedback form */}
     <div className="flex pb-40 justify-center items-center content-center">
      <FeedbackForm />
     </div>
       <div
  id="custom-cursor"
  className="pointer-events-none fixed z-[9999] w-[100px] h-[100px] rounded-full bg-white mix-blend-difference opacity-0 transition-opacity duration-200 ease-in-out transform -translate-x-1/2 -translate-y-1/2 shadow-2xl"
/>
    </div>
    </div>
    </div>
  );
}