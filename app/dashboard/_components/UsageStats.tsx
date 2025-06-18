// Name: V.Hemanathan
// Describe: This component is used to display the usage stats of the user.It uses supabase to fetch the data from the database
// Framework: Next.js -15.3.2 , supabase


"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient, fetchUserUsage } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";
import { useGlobalState } from "@/context/GlobalState";

export default function UsageStats() {
  const supabase: SupabaseClient = createClient();
  const { profile, loading } = useUserProfile();
  const {remining_space, setRemining_space} = useGlobalState();

  const [usageData, setUsage] = useState<{ uploads_used: number; extractions_used: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user_usage_summary row for this user:
  const refreshUsage = useCallback(async () => {
    if (!profile) return;
    const { data, error: fetchError } = await fetchUserUsage(profile.id);
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setUsage({
      uploads_used: data?.uploads_used ?? 0,
      extractions_used: data?.extractions_used ?? 0,
    });
    
    setRemining_space({
      uploads_used: data?.uploads_used ?? 0,
      extractions_used: data?.extractions_used ?? 0,
    });
   if( remining_space){}

  }, [profile]);

  useEffect(() => {
    if (!profile) return;

    // 1) Immediately fetch once on mount
    refreshUsage();

    // 2) Subscribe to invoice_documents INSERT/DELETE
    const docsChannel: RealtimeChannel = supabase
      .channel(`public:invoice_documents:user_id=eq.${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "invoice_documents",
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          // console.log("▶️ invoice_documents INSERT event received");
          refreshUsage();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "invoice_documents",
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          // console.log("▶️ invoice_documents DELETE event received");
          refreshUsage();
        }
      )
      .subscribe();

    // 3) Subscribe to invoice_extractions INSERT/DELETE
    const extsChannel: RealtimeChannel = supabase
      .channel(`public:invoice_extractions:user_id=eq.${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "invoice_extractions",
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          // console.log("▶️ invoice_extractions INSERT event received");
          refreshUsage();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "invoice_extractions",
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          // console.log("▶️ invoice_extractions DELETE event received");
          refreshUsage();
        }
      )
      .subscribe();

    // 4) Cleanup on unmount or if profile.id changes
    return () => {
      supabase.removeChannel(docsChannel);
      supabase.removeChannel(extsChannel);
    };
  }, [profile, refreshUsage, supabase]);

  if (loading || !profile) return null;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Determine limits...
  const uploadsLimit = profile.uploads_limit;
  const extractionsLimit = profile.extractions_limit;
  const uploadsUsed = usageData?.uploads_used ?? 0;
  const extractionsUsed = usageData?.extractions_used ?? 0;
  const uploadPercent = Math.min(100, Math.round((uploadsUsed / (uploadsLimit || 1)) * 100));
  const extractionPercent = Math.min(100, Math.round((extractionsUsed / (extractionsLimit || 1)) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Uploads</CardTitle>
          <CardDescription>
            {uploadsUsed} of {uploadsLimit === 9999 ? "∞" : uploadsLimit} used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={uploadPercent} className="h-2" />
          <div className="flex justify-between text-xs mt-1">
            <span>{uploadPercent}% used</span>
            <span>
              {uploadsLimit === 9999 ? "∞" : uploadsLimit - uploadsUsed} remaining
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extractions</CardTitle>
          <CardDescription>
            {extractionsUsed} of {extractionsLimit === 9999 ? "∞" : extractionsLimit} used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={extractionPercent} className="h-2" />
          <div className="flex justify-between text-xs mt-1">
            <span>{extractionPercent}% used</span>
            <span>
              {extractionsLimit === 9999 ? "∞" : extractionsLimit - extractionsUsed} remaining
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
