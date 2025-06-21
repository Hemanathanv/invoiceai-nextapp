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