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
  export async function fetchInvoiceDocsByDate(
    userId: string,
    startDateTime:Date,
    endDateTime:Date
  ) {
    return await supabase
    .from("invoice_extractions")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .gte("created_at", startDateTime.toISOString()) // example: 2024-06-20T00:00:00Z
    .lte("created_at", endDateTime.toISOString());  // example: 2024-06-20T23:59:59Z
  }
  export async function invoice_extractions(
    userid: string,
    fileName: string,
    updatedExtractions:  string | number | null | undefined | object[] | boolean | null[] | undefined[] | boolean[] | string[] | number[] | object[] | boolean[] | null[] | undefined[] | boolean[] | string[][] | number[][] | object[][] | boolean[][] | null[][] | undefined[][] | boolean[][] | string[][] | number[][] | object[][] | boolean[][] | null[][] | undefined[][],
  ) {
    return await  supabase
    .from("invoice_extractions")
    .update({ invoice_extractions: updatedExtractions })
    .eq("user_id", userid)
    .eq("file_path", fileName)
    .single();
  }
  export async function fetchAvailableDate(
    userId: string,
  ) {
    return await supabase
    .from("invoice_extractions")
    .select("created_at")
    .order("created_at", { ascending: false })
    .eq("user_id", userId)  // example: 2024-06-20T23:59:59Z

  }
