// Name: V.Hemanathan
// Describe: This hook is used to get the user profile from supabase.
// Framework: Next.js -15.3.2 


"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Profile {
  id: string;
  email: string;
  name: string;
  subscription_tier: "free" | "pro" | "enterprise" | "authorised"|string;
  org_id: string;
  is_admin: boolean;
  uploads_used: number;
  uploads_limit: number;
  extractions_used: number;
  extractions_limit: number;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();

      // 1) verify token and get auth user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // 2) fetch the “profiles” row
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const userProfile = data as Profile | null;

      if (profileError || !userProfile) {
        setProfile(null);
      } else {
        setProfile(userProfile);
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  return { profile, loading };
}
