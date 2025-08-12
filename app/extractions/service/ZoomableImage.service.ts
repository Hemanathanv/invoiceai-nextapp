// // service/ZoomableImage.service.ts

// service/ZoomableImage.service.ts
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const supabase = createClient();


/** low‑level fetcher, no React in here */
export async function getImagePublicUrl(fullPath: string): Promise<string> {
  // strip off “documents/” if you store it that way
  const key = fullPath.replace(/^documents\//, "");
  const { data } = supabase
    .storage
    .from("documents")
    .getPublicUrl(key);

  if (!data) {
    return "/placeholder.svg";
  }
  return data.publicUrl;
}

/**
 * React‑Query hook
 * - key: ['image-url', fullPath]
 * - fetcher: calls getImagePublicUrl
 * - options: only run if fullPath truthy, cache for 1 hr
 */
export function useImagePublicUrl(fullPath: string) {
  return useQuery({
    queryKey: ["image-url", fullPath],
    queryFn: () => getImagePublicUrl(fullPath),
    enabled: Boolean(fullPath),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

async function fetchFieldHeaders(userId: string) {
  const { data, error } = await supabase
    .from("invoice_fields")
    .select("standard_fields, custom_fields")
    .eq("id", userId)
    .single()

  if (error) throw error
  return {
    headers: data.standard_fields  as { name: string; source: string; description: string }[],
    lineitem_headers: data.custom_fields as { name: string; description: string }[],
  }
}

export function useFieldHeaders(userId: string) {
  return useQuery<{
    headers: { name: string; source: string; description: string }[];
    lineitem_headers: { name: string; description: string }[];
  }, Error>({
    queryKey: ["invoice-field-headers", userId],
    queryFn: () => fetchFieldHeaders(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 60,
  })
}







// import { createClient } from "@/utils/supabase/client";
// const supabase = createClient();

// export async function getImagePublicUrl(fullPath: string): Promise<string> {
//   // If your file_path is stored as "documents/2025‑07‑22_foo.png",
//   // strip the leading "documents/" so Supabase sees only "2025‑07‑22_foo.png"
//   const key = fullPath.replace(/^documents\//, "");

//   const {
//     data
//   } = supabase
//     .storage
//     .from("documents")
//     .getPublicUrl(key);

//   if (!data) {
//     console.error("Storage.getPublicUrl error:");
//     return "/placeholder.svg";
//   }
//   return data.publicUrl;
// }




// import { createClient } from "@/utils/supabase/client";

// const supabase = createClient();

// /**
//  * Given a full storage path (e.g. "invoices/2024/INV-0001.pdf"), returns helpers for
//  * either downloading the file or obtaining a public URL.
//  */
// export function getImageFromStorage(path: string) {
//   const bucket = supabase.storage.from("documents");

//   return {
//     /**
//      * Generates a public URL for embedding in an <img> or <Image />.
//      * If you’re using a private bucket, you may need to sign a URL instead.
//      */
//     getPublicUrl: (): string => {
//       const { data} = bucket.getPublicUrl(path);
//       if (!data) {
//         // console.error("getPublicUrl error:", error);
//         return ""; // fallback or throw
//       }
//       return data.publicUrl;
//     },

//     /**
//      * Downloads the raw file as a Blob.
//      */
//     download: async (): Promise<Blob> => {
//       const { data, error } = await bucket.download(path);
//       if (error || !data) {
//         throw error ?? new Error("No data returned from storage download");
//       }
//       return data;
//     },
//   };
// }
