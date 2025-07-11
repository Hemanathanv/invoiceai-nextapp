import { ExtractionRecord } from "@/types/invoice";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export async function fetchInvoiceDocsByUser(
  userId: string,
  from: number,
  to: number
) {
  // Step 1: Fetch invoice_extractions
  const { data: extractions, error: extractionError } = await supabase
    .from("invoice_extractions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (extractionError) throw extractionError;
  if (!extractions || extractions.length === 0) return [];

  // Step 2: Fetch invoice_documents
  const { data: documents, error: docError } = await supabase
    .from("invoice_documents")
    .select("id, file_name, isPDF");
  if (docError) throw docError;

  // Step 3: Fetch documents_ref
  const { data: refs, error: refError } = await supabase
    .from("documents_ref")
    .select("file_name, file_paths");
  if (refError) throw refError;

  // Step 4: Group by file_name
  const groupedByFileName: Record<string, ExtractionRecord & { file_name: string; file_paths: string[]; invoice_lineitems: ExtractionRecord[] }> = {};

  for (const extraction of extractions) {
    const doc = documents.find((d) => d.id === extraction.invoice_document_id);
    const fileName = doc?.file_name;
    if (!fileName) continue;

    const isPDF = doc?.isPDF ?? false;
    const filePaths = isPDF
      ? refs.find((r) => r.file_name === fileName)?.file_paths ?? []
      : [];

    if (!groupedByFileName[fileName]) {
      // First time this file_name appears
      groupedByFileName[fileName] = {
        ...extraction,
        file_name: fileName,
        file_paths: filePaths,
        invoice_lineitems: [...(extraction.invoice_lineitems || [])],
      };
    } else {
      // Merge invoice_lineitems (avoid duplicates)
      const existing = groupedByFileName[fileName];
      const newItems = extraction.invoice_lineitems || [];

      const merged = [
        ...existing.invoice_lineitems,
        ...newItems.filter(
          (item: ExtractionRecord) =>
            !existing.invoice_lineitems.some((existingItem: ExtractionRecord) =>
              JSON.stringify(existingItem) === JSON.stringify(item)
            )
        ),
      ];

      groupedByFileName[fileName].invoice_lineitems = merged;
    }
  }

  // Return as array
  return Object.values(groupedByFileName);
}





  export async function fetchInvoiceDocsByDate(
    userId: string,
    startDateTime:string | Date,
    endDateTime:string | Date
  ) {
    
    return await supabase
    .from("invoice_extractions")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .gte("created_at", startDateTime) // example: 2024-06-20T00:00:00Z
    .lte("created_at", endDateTime);  // example: 2024-06-20T23:59:59Z
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

export async function fetchInvoiceDocsByInvoiceNumber(
  userId: string,
  from: number,
  to: number
) {
  // Step 1: Fetch invoice_extractions
  const { data: extractions, error: extractionError } = await supabase
    .from("invoice_extractions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (extractionError) throw extractionError;
  if (!extractions || extractions.length === 0) return [];

  // Step 2: Fetch invoice_documents
  const { data: documents, error: docError } = await supabase
    .from("invoice_documents")
    .select("id, file_name, isPDF");
  if (docError) throw docError;

  // Step 3: Fetch documents_ref
  const { data: refs, error: refError } = await supabase
    .from("documents_ref")
    .select("file_name, file_paths");
  if (refError) throw refError;

  // Step 4: Group by invoice number
  const groupedByInvoiceNumber: Record<string, ExtractionRecord & { invoice_number: string; file_name: string; file_paths: string[]; invoice_lineitems: ExtractionRecord[] }> = {};

  for (const extraction of extractions) {
    // Extract invoice number from invoice_headers
    const invoiceHeaders = extraction.invoice_headers || {};
    const invoiceNumber = invoiceHeaders["Invoice Number"] || invoiceHeaders["invoice_number"] || "";
    
    if (!invoiceNumber) continue;

    const doc = documents.find((d) => d.id === extraction.invoice_document_id);
    const fileName = doc?.file_name;
    if (!fileName) continue;

    const isPDF = doc?.isPDF ?? false;
    const filePaths = isPDF
      ? refs.find((r) => r.file_name === fileName)?.file_paths ?? []
      : [];

    if (!groupedByInvoiceNumber[invoiceNumber]) {
      // First time this invoice number appears
      groupedByInvoiceNumber[invoiceNumber] = {
        ...extraction,
        invoice_number: invoiceNumber,
        file_name: fileName,
        file_paths: filePaths,
        invoice_lineitems: [...(extraction.invoice_lineitems || [])],
      };
    } else {
      // Merge invoice_lineitems (avoid duplicates)
      const existing = groupedByInvoiceNumber[invoiceNumber];
      const newItems = extraction.invoice_lineitems || [];

      const merged = [
        ...existing.invoice_lineitems,
        ...newItems.filter(
          (item: ExtractionRecord) =>
            !existing.invoice_lineitems.some((existingItem: ExtractionRecord) =>
              JSON.stringify(existingItem) === JSON.stringify(item)
            )
        ),
      ];

      groupedByInvoiceNumber[invoiceNumber].invoice_lineitems = merged;
    }
  }

  // Return as array
  return Object.values(groupedByInvoiceNumber);
}
