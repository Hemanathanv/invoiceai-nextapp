"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

// export interface Profile {
//   id: string;
//   email: string;
//   name: string;
//   subscription_tier: "free" | "pro" | "enterprise" | "authorised" | string;
//   org_id: string;
//   is_admin: boolean;
//   uploads_used: number;
//   uploads_limit: number;
//   extractions_used: number;
//   extractions_limit: number;
// }

export function useUserProfile() {
  return useQuery<Profile | null>({
    queryKey: ["profile"], // cache key

    queryFn: async () => {
      const supabase = createClient();

      // 1) Get authenticated user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return null;
      }

      // 2) Fetch profile row
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      return data as Profile;
    },

    // ✅ Keeps data fresh but doesn't refetch unnecessarily
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: true
  });
}
