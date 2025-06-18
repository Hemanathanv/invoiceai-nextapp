import { createClient, fetchUserUsage } from "@/utils/supabase/client";


/**
 * Fetch profiles by email search & subscription filter.
 * @param emailQuery  substring to search in email (case‑insensitive)
 * @param subscription one of ["Free","Pro","Enterprise","Authorised"]
 */
export async function fetchProfiles(
  emailQuery: string,
  subscription: string,
  page: number,
  limit: number
): Promise<{ data: ProfileWithRole[]; total: number; error: Error | null }> {
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // 1) Base query with exact count
    let qb = supabase
      .from("profiles")
      .select(
        `
          id,
          email,
          name,
          subscription_tier,
          is_admin,
          created_at,
          uploads_limit,
          extractions_limit
        `,
        { count: "exact" }
      );

    if (emailQuery.trim()) {
      qb = qb.ilike("email", `%${emailQuery.trim()}%`);
    }
    if (subscription !== "all") {
      qb = qb.eq("subscription_tier", subscription);
    }

    // 2) Apply ordering and range
    const { data: coreProfiles, count, error: coreError } = await qb
      .order("created_at", { ascending: false })
      .range(from, to);

    if (coreError) {
      return { data: [], total: 0, error: coreError };
    }

    const profiles = coreProfiles || [];

    // 3) If any are Authorised, bulk‑fetch their roles
    let authorisedRolesMap: Record<string, string> = {};
    if (subscription === "Teams" || profiles.some(p => p.subscription_tier === "Teams")) {
      const authorisedIds = profiles
        .filter(p => p.subscription_tier === "Teams")
        .map(p => p.id);

      if (authorisedIds.length) {
        const { data: authRows, error: authErr } = await supabase
          .from("teams_table")
          .select("user_id, role")
          .in("user_id", authorisedIds);

        if (!authErr && authRows) {
          /* build a lookup of user_id → role */
          authRows.forEach(r => {
            authorisedRolesMap[r.user_id] = r.role;
          });
        }
      }
    }

    // 4) Enrich with usage + role
    const enriched = await Promise.all(
      profiles.map(async (p) => {
        // usage stats
        const { data: usage, error: usageErr } = await fetchUserUsage(p.id);
        if (usageErr) console.error(`Usage fetch failed for ${p.id}:`, usageErr.message);

        return {
          ...p,
          uploads_used: usage?.uploads_used ?? 0,
          extractions_used: usage?.extractions_used ?? 0,
          // only for Authorised tier
          role: p.subscription_tier === "Teams"
            ? authorisedRolesMap[p.id] || "unassigned"
            : undefined
        };
      })
    );

    return { data: enriched, total: count ?? 0, error: null };
  } catch (err: unknown) {
    console.error("fetchProfiles error:", err);
    return { data: [], total: 0, error: err as Error };
  }
}

/** Extend your Profile type to include optional `role` */
export interface ProfileWithRole extends Profile {
  uploads_used: number;
  extractions_used: number;
  role?: string; // populated only for Authorised-tier users
}


/**
 * Updates a profile by ID with given fields.
 * @param id - Profile ID
 * @param updates - Fields to update (uploads_limit, extractions_limit, etc.)
 */
export async function saveProfile(
  id: string,
  updates: Partial<Pick<Profile, "is_admin" |"subscription_tier" |"uploads_limit" | "extractions_limit" >>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  // console.log("Updating profile:", id, updates.is_admin, updates.subscription_tier, updates.uploads_limit, updates.extractions_limit);
  const { error} = await supabase
    .from("profiles")
    .update({
      is_admin: updates.is_admin,
      subscription_tier: updates.subscription_tier,
      uploads_limit: updates.uploads_limit,
      extractions_limit: updates.extractions_limit,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error?.message };
  }

  if (updates.subscription_tier === "Teams") {
    const { error: upsertError } = await supabase
      .from("authorised_tier")
      .upsert(
        {
          user_id: id,
          role: "manager",                       // initial manager
        },
        { onConflict: "id" }                // avoid dupes
      );

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }
  }


  return { success: true };
}