import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


  export async function fetchInvoiceDocsByUser(
    userId: string,
    from: number,
    to: number
  ) {
    return await supabase
      .from("invoice_extractions")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", userId)
      .range(from, to);
  }