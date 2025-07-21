import { createClient } from "@/utils/supabase/client";

export interface OrgUserRow {
  id: string;
  name: string;
  email: string;
  uploads_limit: number;
  role: string;
  client_names:string[];
  uploads_used: number;
}

export interface ClientLink {
  client_id: string;
  client_name: string;
  client_email?: string;
  status: "Active" | "inActive";
  dbConnection?: string;
  
}

/**
 * Fetch all users in an org, including their role (from teams_table)
 * and usage (from user_usage_summary view).
 */
export async function getUsersForOrg(
  orgId: string
): Promise<OrgUserRow[]> {
  const supabase = createClient();

  // 1) Fetch profiles for this org
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("id, name, email, uploads_limit")
    .eq("org_id", orgId);
    
  if (profileErr) {
    throw new Error(profileErr.message);
  }

  // 2) Fetch roles from teams_table for these users
  const { data: teams, error: teamsErr } = await supabase
    .from("teams_table")
    .select("user_id, role")
    .eq("org_id", orgId);
  if (teamsErr) {
    throw new Error(teamsErr.message);
  }

  // 3) Fetch usage summary for these users (view has no org_id)
  const userIds = (profiles || []).map(p => p.id)
  let usageRows: { user_id: string; uploads_used: number }[] = []
  if (userIds.length) {
    const { data, error: usageErr } = await supabase
      .from("user_usage_summary")
      .select("user_id, uploads_used")
      .in("user_id", userIds)

    if (usageErr) {
      throw new Error(usageErr.message)
    }
    usageRows = data
  }

  // 4) Fetch client names for these users
  let clientRows: { user_id: string; client_name: string }[] = [];
  if (userIds.length) {
    const { data, error: clientErr } = await supabase
      .from("team_clients_table")
      .select("user_id, client_name")
      .in("user_id", userIds)
      .eq("status", "Active");
    if (clientErr) {
      throw new Error(clientErr.message);
    }
    clientRows = data;
  }

  // Build lookup maps
  const roleMap = new Map<string, string>();
  teams?.forEach((t: any) => {
    roleMap.set(t.user_id, t.role);
  });
  const usageMap = new Map<string, number>();
  usageRows?.forEach((u: any) => {
    usageMap.set(u.user_id, u.uploads_used);
  });

  const clientMap = new Map<string, Set<string>>();
  clientRows.forEach((c: any) => {
    const set = clientMap.get(c.user_id) || new Set<string>();
    set.add(c.client_name);
    clientMap.set(c.user_id, set);
  });

  // 4) Merge into OrgUserRow[]
  return (profiles || []).map((p) => {
    const uniqueClients = clientMap.get(p.id) || new Set();
    return {
      id:            p.id,
      name:          p.name,
      email:         p.email,
      uploads_limit: p.uploads_limit,
      role:          roleMap.get(p.id) || "",
      client_names:  [...uniqueClients],
      uploads_used:  usageMap.get(p.id) || 0,
    };
  });
}


export async function assignClientToUser(
  userId: string,
  orgId: string,
  client: ClientLink,
): Promise<void> {
  const supabase = createClient();

  const payload = {
    user_id:      userId,
    org_id:       orgId,
    client_id:    client.client_id,
    client_name:  client.client_name,
    client_email: client.client_email,
    dbConnection: client.dbConnection,
    status:       client.status,
  };

  const { error } = await supabase
    .from("team_clients_table")
    .insert(payload);


  if (error) {
    throw new Error(`Failed to assign client: ${error.message}`);
  }
}

export async function unassignClientFromUser(
  userId: string,
  orgId: string,
  client: ClientLink,
  ): Promise<void>{

  const supabase = createClient();

  const clientId = client.client_id
  const { error } = await supabase
  .from("team_clients_table")
  .delete()
  .eq("user_id", userId)
  .eq("client_id", clientId)
  .eq("org_id", orgId)
  
  if (error) throw new Error(error.message)
  }


  export async function allocateCreditsToUser(
    userId: string,
    orgId: string,
    credits: number,
  ): Promise<void> {
    const supabase = createClient();
  
    const payload = {
      id:      userId,
      org_id:       orgId,
      uploads_limit: credits,
      extractions_limit: credits,
    };
  
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .eq("org_id", orgId)
  
    if (error) {
      throw new Error(`Failed to assign client: ${error.message}`);
    }
  }