import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface InsertInvoiceDocumentParams {
    userId: string;
    filePath: string;
    standardFields: object;
    customFields: object;
    orgID: string | null;
    clientID: string | null;
    client_name: string | null;
    file_name: string;
    isPDF: boolean;
    file_id: string | null;
    page_count: number;
  }

export const uploadFile = async (
    storagePath: string,
    blob: Blob
  ): Promise<object |string | null> => {
    const { data: uploadData, error: uploadError }= await supabase.storage.from("documents").upload(storagePath, blob);
    
    if (uploadError) {
      // console.error("Upload failed:", uploadError);
      return uploadError;
    }
  
    return uploadData;
  };
  
  
  export async function insertInvoiceDocument({
    userId,
    filePath,
    standardFields,
    customFields,
    orgID,
    clientID,
    client_name,
    file_name,
    isPDF,
    file_id,
    page_count
  }: InsertInvoiceDocumentParams): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("invoice_documents").insert([
      {
        user_id: userId,
        file_path: filePath,
        standard_fields: standardFields,
        custom_fields: customFields,
        org_id: orgID,
        client_id: clientID,
        client_name: client_name,
        file_name: file_name,
        isPDF: isPDF,
        file_id: file_id,
        page_count: page_count,
      },
    ]);
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true };
  }