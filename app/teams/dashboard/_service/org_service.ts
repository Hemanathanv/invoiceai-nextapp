import { createClient } from "@/utils/supabase/client";

export async function insertOrgForUser({
    userId,
    orgName,
    orgId,
  }: {
    userId: string;
    orgName: string;
    orgId: string;
  }): Promise<void> {
    const supabase = createClient();
    // 1) Update profiles table (assumes columns: id, orgid)
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({ org_id: orgId })
      .eq("id", userId);
    if (profileErr) throw profileErr;
  
    // 2) Insert into authorized_tier (assumes columns: org_id, user_id)
    const { error: tierErr } = await supabase
      .from("teams_table")
      .update({ org_id: orgId, org_name: orgName })
      .eq("user_id", userId);
    if (tierErr) throw tierErr;
  }

export async function getOrgForUser(userId: string): Promise<{
    org_id: string;
    org_name: string;
  } | null> {
    const supabase = createClient();
  
    // Select the org_id and org_name where user_id matches
    const { data, error } = await supabase
      .from("teams_table")
      .select("org_id, org_name")
      .eq("user_id", userId)
      .single();
  
    if (error) {
      // handle not-found vs other errors
      if (error.code === "PGRST116") { // e.g. PostgREST “no rows found”
        return null;
      }
      throw error;
    }
  
    // data will be { org_id: string; org_name: string; }
    return data;
  }