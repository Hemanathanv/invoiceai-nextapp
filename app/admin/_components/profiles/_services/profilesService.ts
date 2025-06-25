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
): Promise<{ data: Profile[]; total: number; error: Error | null }>{
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // 1) Base query with exact count
    let qb = supabase
      .from("profiles")
      .select(
        "id, email, name, subscription_tier, is_admin, created_at, uploads_limit, extractions_limit",
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

    // 3) Enrich each with usage stats
    const enriched = await Promise.all(
      (coreProfiles || []).map(async (p) => {
        const { data: usage, error: usageErr } = await fetchUserUsage(p.id);
        if (usageErr) console.error(`Usage fetch failed for ${p.id}:`, usageErr.message);
        return {
          ...p,
          uploads_used: usage?.uploads_used ?? 0,
          extractions_used: usage?.extractions_used ?? 0,
        };
      })
    );

    return { data: enriched, total: count ?? 0, error: null };
  } catch (err) {
    // console.error("fetchProfiles error:", err);
    return { data: [], total: 0, error: err as Error };
  }
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
  console.log("Updating profile:", id, updates.is_admin, updates.subscription_tier, updates.uploads_limit, updates.extractions_limit);
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

  return { success: true };
}