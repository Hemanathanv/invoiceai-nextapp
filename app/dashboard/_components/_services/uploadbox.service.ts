import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface InsertInvoiceDocumentParams {
    userId: string;
    filePath: string;
    standardFields: object;
    customFields: object;
    orgID: string | null;
    clientID: string | null;
    file_name: string;
    isPDF: boolean;
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
    file_name,
    isPDF
  }: InsertInvoiceDocumentParams): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("invoice_documents").insert([
      {
        user_id: userId,
        file_path: filePath,
        standard_fields: standardFields,
        custom_fields: customFields,
        org_id: orgID,
        client_id: clientID,
        file_name: file_name,
        isPDF: isPDF
      },
    ]);
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true };
  }