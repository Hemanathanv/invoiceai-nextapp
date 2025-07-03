import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface InsertInvoiceDocumentParams {
    userId: string;
    filePath: string;
    standardFields: object;
    customFields: object;
    isPDF:boolean;
    file_name:string; 
  }
interface InsertDocumentRef {
  file_name: string;
  file_paths: object;
}
export const uploadFile = async (
    storagePath: string,
    blob: Blob
  ): Promise<object |string | null> => {
    const { data: uploadData, error: uploadError }= await supabase.storage.from("documents").upload(storagePath, blob);
    
    if (uploadError) {
      console.error("Upload failed:", uploadError);
      return uploadError;
    }
  
    return uploadData;
  };
  
  
  export async function insertDocumentRef({
    file_name, 
    file_paths,
  }: InsertDocumentRef): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("documents_ref").insert([
      {
        file_name,  file_paths  
      },
    ]);
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true };
  }
  
  export async function insertInvoiceDocument({
    userId,
    filePath,
    standardFields,
    customFields,
    file_name, 
    isPDF=false
  }: InsertInvoiceDocumentParams): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("invoice_documents").insert([
      {
        user_id: userId,
        file_path: filePath,
        standard_fields: standardFields,
        custom_fields: customFields,
        file_name,
        isPDF  
      },
    ]);
  
    if (error) {
      return { success: false, error: error.message };
    }
  
    return { success: true };
  }