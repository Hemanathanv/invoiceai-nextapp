import { createClient, fetchUserUsage } from "@/utils/supabase/client";


/**
 * Fetch profiles by email search & subscription filter.
 * @param emailQuery  substring to search in email (case‑insensitive)
 * @param subscription one of ["Free","Pro","Enterprise","Authorised"]
 */
export async function fetchProfiles(
  emailQuery: string,
  subscription: string
): Promise<{ data: Profile[]; error: Error | null }> {
  const supabase = createClient();
  try {
  let query = supabase
      .from("profiles")
      .select(
        "id, email, name, subscription_tier, is_admin, created_at, uploads_limit, extractions_limit"
      );

    if (emailQuery.trim()) {
      query = query.ilike("email", `%${emailQuery.trim()}%`);
    }
    if (subscription !== "all") {
      query = query.eq("subscription_tier", subscription);
    }
    const { data: coreProfiles, error: coreError } = await query.order(
      "created_at",
      { ascending: false }
    );
    if (coreError) {
      return { data: [], error: coreError };
    }

    // 2) Enrich usage per profile
    const enriched = await Promise.all(
      (coreProfiles || []).map(async (p) => {
        const { data: usage, error: usageError } = await fetchUserUsage(p.id);
        if (usageError) console.error(`Usage fetch failed for ${p.id}:`, usageError.message);
        return {
          ...p,
          uploads_used: usage?.uploads_used ?? 0,
          extractions_used: usage?.extractions_used ?? 0,
        };
      })
    );

    return { data: enriched, error: null };
  } catch (err: any) {
    console.error("fetchProfiles error:", err);
    return { data: [], error: err };
  }
}