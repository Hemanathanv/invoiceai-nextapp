"use client";

import AnimatedLogo from "@/components/headercomponents/AnimatedLogo";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white text-black dark:bg-neutral-900 dark:text-white">
      <div className="flex flex-col items-center gap-4">
        <AnimatedLogo />
        <p className="text-sm text-black/60 dark:text-white/70">Loading…</p>
      </div>
    </div>
  );
}
