
// app/extractions/page.tsx  
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client";
import { Edit } from "lucide-react";
import InvoiceModalView from "./_components/InvoiceModalView";


interface ExtractionItem {
  name: string;
  description: string;
}

interface InvoiceDocument {
    id: string;
    user_id: string;
    file_name: string;
    image_base64: any;          // (not used here)
    invoice_extractions: Record<string, any> | null;
    created_at: string;
  }

const supabase = createClient();

export default function Extractions() {
    
    const [docs, setDocs] = useState<InvoiceDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);           // 0-based page index
    const [totalCount, setTotalCount] = useState<number>(0);
    const [selectedDoc, setSelectedDoc] = useState<InvoiceDocument | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const PAGE_SIZE = 20;

    useEffect(() => {
      const getUser = async () => {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      };
      getUser();
    }, []);

    const fetchPage = useCallback(async () => {
      if (!userId) return;
  
      setLoading(true);
  
      // Get total count of user's docs
      const { count, error: countError } = await supabase
        .from("invoice_extractions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
  
      if (countError) {
        console.error("Count fetch error:", countError.message);
        setLoading(false);
        return;
      }

      
    
        // Step 2: fetch rows for this page
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
    
        const { data, error: fetchError } = await supabase
          .from("invoice_extractions")
          .select("*")
          .order("created_at", { ascending: false })
          .eq("user_id", userId)
          .range(from, to);

    
        if (fetchError) {
          console.error("Error fetching documents:", fetchError);
          setDocs([]);
        } else {
          console.log("Fetched data:", data);
          setDocs(data || []);
        }
        setLoading(false);
      }, [userId,page]);
    
      // Re‐fetch whenever `page` changes
      useEffect(() => {
        fetchPage();
      }, [fetchPage]);

      useEffect(() => {
        if (!userId) return;
    
        // Compose a channel name (just for clarity; it can be any unique string)
        const channelName = `realtime:invoice_extractions:user=${userId}`;
    
        const channel = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "invoice_extractions",
              filter: `user_id=eq.${userId}`,
            },
            () => {
              fetchPage();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "invoice_extractions",
              filter: `user_id=eq.${userId}`,
            },
            () => {
              fetchPage();
            }
          )
          .on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "invoice_extractions",
              filter: `user_id=eq.${userId}`,
            },
            () => {
              fetchPage();
            }
          )
          .subscribe();
    
        // Clean up on unmount or when userId changes
        return () => {
          supabase.removeChannel(channel);
        };
      }, [userId, fetchPage, selectedDoc]);
      // Helper: extract “filename” from a full file_path string
      const extractFileName = (path: string) => {
        const parts = path.split("/");
        return parts[parts.length - 1];
      };
    
      // Handler: “Save as Excel”
      const handleSaveAsExcel = () => {
        if (!docs.length) {
          alert("No data to export.");
          return;
        }

      
    
        // Build a 2D array: first row is headers
        // We’ll include “File Name”, “View Invoice” (maybe as hyperlink), then each key from invoice_extractions.
        // For simplicity, we assume all rows share the same set of keys in invoice_extractions;
        // if not, you could union them first.
        // Here, we just take the first non-null invoice_extractions to build column headers.
    
        // 1) Determine all extraction keys present on any row in this page:
        const allKeys = new Set<string>();
        docs.forEach((doc) => {
          if (doc.invoice_extractions) {
            Object.keys(doc.invoice_extractions).forEach((k) => allKeys.add(k));
          }
        });
        const extractionKeys = Array.from(allKeys);
    
        // 2) Build header row:
        const headers = ["File Name", "View Invoice", ...extractionKeys];
    
        // 3) Build data rows:
        const rows = docs.map((doc) => {
          const fileName = extractFileName(doc.file_name);
          
          const row: (string | number)[] = [];
          row.push(fileName);
          
    
          extractionKeys.forEach((k) => {
            row.push(
              doc.invoice_extractions && doc.invoice_extractions[k] != null
                ? String(doc.invoice_extractions[k])
                : ""
            );
          });
    
          return row;
        });
    }
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        
    

        return (
            <>
            <div className="min-h-screen flex flex-col p-8 space-y-4">
              {/* ─── Top bar: Buttons on the right ──────────────────────────────── */}
              <div className="flex justify-end">
                <div className="space-x-2">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                    onClick={handleSaveAsExcel}
                  >
                    Save as Excel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
                  >
                    Send to Mail
                  </Button>
                </div>
              </div>
        
              {/* ─── Scrollable Table Container ───────────────────────────────────── */}
              <div className="flex-1 overflow-auto border">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 sticky top-0">
                      <th className="border px-4 py-2 text-left">File Name</th>
                      <th className="border px-4 py-2 text-left">Actions</th>
                      <th className="border px-4 py-2 text-left">Extractions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="border px-4 py-2 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : docs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="border px-4 py-2 text-center">
                          No documents found.
                        </td>
                      </tr>
                    ) : (
                      docs.map((doc, idx) => {
                        const fileName = extractFileName(doc.file_name);
                        // const viewUrl = `/dashboard/invoice/${doc.document_id}`;
        
                        // ── Horizontal layout for invoice_extractions ─────────────
                        let extractionTable = <span className="text-gray-500">—</span>;
                        
                        if (
                            Array.isArray(doc.invoice_extractions) &&
                            doc.invoice_extractions.length > 0
                          ) {
                            // 1. Gather all names, all descriptions
                            const names = doc.invoice_extractions.map((obj) => obj.name ?? "");
                            const descriptions = doc.invoice_extractions.map(
                              (obj) => obj.description ?? ""
                            );
                          
                            extractionTable = (
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr>
                                    {names.map((n, i) => (
                                      <th key={`h-${i}`} className="border px-2 py-1 text-left">
                                        {n}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {descriptions.map((d, i) => (
                                      <td key={`v-${i}`} className="border px-2 py-1">
                                        {d}
                                      </td>
                                    ))}
                                  </tr>
                                </tbody>
                              </table>
                            );
                          }else {
                            
                                extractionTable = (
                                  <div className="flex items-center justify-center py-4">
                                    <span className="animate-pulse text-gray-500">
                                      AI is processing…
                                    </span>
                                  </div>
                                );
                              
                          }
                          
                        return (
                          <tr
                            key={doc.id}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="border px-4 py-2">{fileName}</td>
                            <td className="border px-4 py-2">
                            
                                <Button size="sm" 
                                variant="outline"
                                onClick={() => setSelectedDoc(doc)}
                                >
                                  View Invoice
                                </Button>
               
                            </td>
                            <td className="border px-4 py-2">{extractionTable}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
        
              {/* ─── Bottom bar: Pagination on the right ──────────────────────────── */}
              <div className="flex justify-end space-x-2">
                <Button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  ← Prev
                </Button>
                <span className="self-center">
                  Page {page + 1} of {totalPages || 1}
                </span>
                <Button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  Next →
                </Button>
              </div>
            </div>

             {/* ─── Invoice Modal View ──────────────────────────── */}
             {selectedDoc && (
        <InvoiceModalView
          userid={userId!}
          fileName={selectedDoc.file_name}
          imageBase64={selectedDoc.image_base64}
          invoiceExtractions={
            Array.isArray(selectedDoc.invoice_extractions)
              ? selectedDoc.invoice_extractions
              : []
          }
          onClose={() => setSelectedDoc(null)}
          onSaveSuccess={(newArray) => {
            // Merge the updated `invoice_extractions` back into selectedDoc:
            setSelectedDoc((prev) => {
              if (!prev) return null;
              return { ...prev, invoice_extractions: newArray };
            });

            setDocs((prevDocs) =>
              prevDocs.map((d) =>
                d.id === selectedDoc.id
                  ? { ...d, invoice_extractions: newArray }
                  : d
              )
            );
          }}
          />
        )}

  </>
)}

        
