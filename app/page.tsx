"use client";

// Home page with DOMPurify injection and GSAP animations

import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/Featuresection";
import HowItWorksSection from "@/components/home/HowitworkSection";
import TestimonialsSection from "@/components/home/TestimonialSection";
import FeedbackForm from "@/components/home/FeadbackForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {
  const { data: profile, isLoading, isError, error } = useUserProfile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    if (isError ) {
      const message = (error as Error | null)?.message ?? "Something went wrong";
      toast.error(message);
    }

    // Injecting some dynamic HTML from backend or CMS (could be user input)
    const userInput = `
      <div class="cursor-area p-4 text-center">
        <script>alert('xss');</script>
      </div>
    `;

    // Sanitize user input using DOMPurify
    const safeHtml = DOMPurify.sanitize(userInput);
    setSanitizedHtml(safeHtml);

    // Scroll-triggered animations
    const cards1 = containerRef.current?.querySelectorAll(".card1");
    const cards2 = containerRef.current?.querySelectorAll(".card2");
    const cards3 = containerRef.current?.querySelectorAll(".card3");

    cards1?.forEach((card) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 80,
          scale: 0.95,
          rotate: -5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top -14%",
            end: "bottom -50%",
            toggleActions: "play reverse play reverse",
            markers: false,
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
          // rotateY: 10,
        },
        {
          opacity: 1,
          x: 0,
          // rotateY: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top -25%",
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
          // rotateY: 10,
        },
        {
          opacity: 1,
          x: 0,
          // rotateY: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top -25%",
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
      smooth: 1.2,
      effects: true,
    });

    // Custom cursor logic
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
      });
      smoother.kill();
    };
  }, [isError, error]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div ref={containerRef} className="relative overflow-hidden">
          {/* 👇 Injected dynamic HTML safely using DOMPurify */}
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

          <Toaster />
          <HeroSection profile={profile as Profile} loading={isLoading} />

          <div className="flex w-full h-full flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row">
            <div className="card3">
              <FeaturesSection />
            </div>
            <div className="card2">
              <HowItWorksSection />
            </div>
          </div>

          {!isLoading && !profile && (
            <div className="pb-40 card3">
              <TestimonialsSection />
            </div>
          )}

          {!isLoading && profile && (
          <div className="flex pb-40 justify-center items-center content-center">
            <FeedbackForm />
          </div>
          )}

          {/* 👇 Custom cursor */}
          <div
            id="custom-cursor"
            className="pointer-events-none fixed z-[9999] w-[100px] h-[100px] rounded-full bg-white mix-blend-difference opacity-0 transition-opacity duration-200 ease-in-out transform -translate-x-1/2 -translate-y-1/2 shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
