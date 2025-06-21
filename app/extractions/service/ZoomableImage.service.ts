import { createClient } from "@/utils/supabase/client";
const extractFileName = (path: string) => path.split("/").pop()!;

const supabase = createClient();
  export async function getImageFromStrorage(
    fileName: string,) {
    return await supabase.storage
    .from("documents")
    .download(extractFileName(fileName));
  }