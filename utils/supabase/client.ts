// Name: V.Hemanathan
// Describe: This file contains the client side supabase client.
// Framework: Next.js -15.3.2 , supabase

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function fetchUserUsage(userId: string): Promise<{
  data?: { uploads_used: number; extractions_used: number };
  error?: { message: string };
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_usage_summary")
    .select("uploads_used, extractions_used")
    .eq("user_id", userId)
    .single();

  if (error) {
    return { error: { message: error.message } };
  }
  // `data` now has shape { uploads_used: number; extractions_used: number }
  return { data };
}