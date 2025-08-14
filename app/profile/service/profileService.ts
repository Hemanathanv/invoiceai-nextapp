"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const supabase = createClient();

export interface TeamsTable {
  org_name: string;
  role: string;
}
export interface TeamClientsTable {
  client_name: string;
  client_email: string;
  status: string;
  client_id: string;
}

export function useTeamsFromId(user_id: string, org_id: string) {
  return useQuery<{
    team: TeamsTable | null;
    clients: TeamClientsTable[] | null;
  }>({
    queryKey: ["teams_details", user_id, org_id],
    queryFn: async () => {
      const { data: team, error: teamError } = await supabase
        .from("teams_table")
        .select("org_name, role")
        .eq("user_id", user_id)
        .eq("org_id", org_id)
        .single();

      const { data: clients, error: clientsError } = await supabase
        .from("team_clients_table")
        .select("client_name, client_email,client_id, status")
        .eq("org_id", org_id);

      if (teamError || clientsError) {
        throw new Error(
          teamError?.message || clientsError?.message || "Failed to fetch team data"
        );
      }

      return { team, clients };
    },
    enabled: !!user_id && !!org_id, // ✅ controls query execution
    staleTime: Infinity,
  });
}

export function useUsageSummary(user_id: string) {
  return useQuery<{ uploads_used: number; extractions_used: number }>({
    queryKey: ["usage_summary", user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_usage_summary")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user_id, // ✅ controls query execution
  });
}

export function useUpdateProfileName(profileId: string, onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    const router = useRouter();
  
    return useMutation({
      mutationFn: async (newName: string) => {
        const { error } = await supabase
          .from("profiles")
          .update({ name: newName })
          .eq("id", profileId);
  
        if (error) {
          throw new Error(error.message);
        }
      },
      onSuccess: async () => {
        // Invalidate profile data so UI refreshes automatically
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        if (onSuccessCallback) onSuccessCallback();
        router.refresh();
        toast( "Profile updated successfully")
      }
    });
  }
