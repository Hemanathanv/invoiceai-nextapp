// components/dashboard/UsageStats.tsx
"use client";

import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UsageStats() {
  const { profile, loading } = useUserProfile();

  // While loading or if no profile, render nothing here (no hooks skipped)
  if (loading || !profile) {
    return null;
  }

  // Derive limits based on subscription_tier
  let uploadsLimit: number;
  let extractionsLimit: number;

  switch (profile.subscription_tier.toLowerCase()) {
    case "free":
      uploadsLimit = 5;
      extractionsLimit = 5;
      break;
    case "pro":
      uploadsLimit = 100;
      extractionsLimit = 1000;
      break;
    default:
      // enterprise or authorised
      uploadsLimit = 9999;
      extractionsLimit = 9999;
      break;
  }

  // For now: assume zero used (replace with real usage when available)
  const uploadsUsed = 0;
  const extractionsUsed = 0;

  const uploadPercent = Math.round((uploadsUsed / uploadsLimit) * 100);
  const extractionPercent = Math.round((extractionsUsed / extractionsLimit) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Document Uploads</CardTitle>
          <CardDescription>
            {uploadsUsed} of {uploadsLimit === 9999 ? "∞" : uploadsLimit} used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={uploadPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{uploadPercent}% used</span>
              <span>
                {uploadsLimit === 9999
                  ? "∞ available"
                  : uploadsLimit - uploadsUsed}{" "}
                remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Extractions</CardTitle>
          <CardDescription>
            {extractionsUsed} of {extractionsLimit === 9999 ? "∞" : extractionsLimit} used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={extractionPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{extractionPercent}% used</span>
              <span>
                {extractionsLimit === 9999
                  ? "∞ available"
                  : extractionsLimit - extractionsUsed}{" "}
                remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
