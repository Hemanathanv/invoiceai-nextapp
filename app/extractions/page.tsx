// Name: V.Hemanathan
// Describe: This component is used to display the extractions of the user.It gets Real time data from supabase and displays it in a table format
// Framework: Next.js -15.3.2 


"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import InvoiceModalView from "./_components/InvoiceModalView";
import ExtractionPager from "./_components/ExtractionPager";
import { ExtractionRecord } from "@/types/invoice";

interface InvoiceDocument {
  id: string;
  user_id: string;
  file_path: string;
  invoice_extractions: ExtractionRecord[];
  created_at: string;
}

const supabase = createClient();

export default function Extractions() {
  const [docs, setDocs] = useState<InvoiceDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // 0-based page index
  const [selectedDoc, setSelectedDoc] = useState<InvoiceDocument | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const PAGE_SIZE = 20;

  // 1) Get current user ID on mount
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  // 2) Fetch a page of documents whenever userId or page changes
  const fetchPage = useCallback(
    async (args: { userId: string; pageIndex: number }) => {
      const { userId, pageIndex } = args;
      setLoading(true);

      // Count isn't used for pagination UI in this version, so we skip storing it.
      const { error: countError } = await supabase
        .from("invoice_extractions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      if (countError) {
        console.error("Count fetch error:", countError.message);
        setLoading(false);
        return;
      }

      // Now fetch the rows for this page:
      const from = pageIndex * PAGE_SIZE;
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
        const normalized: InvoiceDocument[] = (data || []).map((row) => ({
          id: row.id,
          user_id: row.user_id,
          file_path: row.file_path,
          invoice_extractions: Array.isArray(row.invoice_extractions)
            ? row.invoice_extractions
            : [],
          created_at: row.created_at,
        }));
        setDocs(normalized);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (!userId) return;
    fetchPage({ userId, pageIndex: page });
  }, [userId, page, fetchPage]);

  // 3) Subscribe to real-time changes on invoice_extractions
  useEffect(() => {
    if (!userId) return;

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
          fetchPage({ userId, pageIndex: page });
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
          fetchPage({ userId, pageIndex: page });
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
          fetchPage({ userId, pageIndex: page });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, page, fetchPage]);

  // Helper: extract just the filename from a full path
  const extractFileName = (path: string, userId?: string): string => {
    // 1) Split off any folders:
    const parts = path.split("/");
    let name = parts[parts.length - 1];
  
    if (userId) {
      const prefix = `${userId}_`;
      if (name.startsWith(prefix)) {
        name = name.slice(prefix.length);
      }
    }
  
    return name;
  };

  // 4) Build CSV/Excel arrays on demand (no unused variables left)
  const handleSaveAsExcel = () => {
    if (!docs.length) {
      alert("No data to export.");
      return;
    }

    // todo

    // // Determine all extraction keys present on any row in this page:
    // const allKeys = new Set<string>();
    // docs.forEach((doc) => {
    //   doc.invoice_extractions.forEach((item) => allKeys.add(item.name));
    // });
    // const extractionKeys = Array.from(allKeys);

    // // Build header row and data rows
    // const headers = ["File Name", ...extractionKeys];
    // const rows: (string | number)[][] = docs.map((doc) => {
    //   const row: (string | number)[] = [extractFileName(doc.file_name)];
    //   const lookup: Record<string, string> = {};
    //   doc.invoice_extractions.forEach((item) => {
    //     lookup[item.name] = item.description;
    //   });
    //   extractionKeys.forEach((k) => {
    //     row.push(lookup[k] ?? "");
    //   });
    //   return row;
    // });

    // // (In a real impl you’d download or transform `headers` + `rows` into an XLSX/CSV file)
    // console.log("EXCEL HEADERS:", headers);
    // console.log("EXCEL ROWS:", rows);
  };

  // Figure out how many total pages (we don’t strictly need totalCount in state for this; rough calc)
  const totalPages = Math.ceil(docs.length / PAGE_SIZE) || 1;

  return (
    <>
      <div className="min-h-screen flex flex-col p-8 space-y-4">
        {/* ─── Top bar: Save/Email buttons ────────────────────────────── */}
        <div className="flex justify-end">
          <div className="space-x-2">
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
              onClick={handleSaveAsExcel}
            >
              Save as Excel
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90">
              Send to Mail
            </Button>
          </div>
        </div>

        {/* ─── Scrollable Table Container ──────────────────────────────── */}
        <div className="flex-1 overflow-auto border rounded">
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
                    Loading…
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
                  const fileName = extractFileName(doc.file_path, doc.user_id);
                  
                  // Build a small horizontal table of “name → description” for this row:
                  let extractionTable: React.ReactNode = (
                    <span className="text-gray-500">—</span>
                  );
                  
                  const flatItems: ExtractionRecord[] =
                    Array.isArray(doc.invoice_extractions)
                      ? doc.invoice_extractions
                      : [];

                  extractionTable = (
                    <ExtractionPager items={flatItems} pageSize={1} />
                  );
                  
                  if (doc.invoice_extractions.length === 0) {
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
                      className={
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }
                    >
                      <td className="border px-4 py-2">{fileName}</td>
                      <td className="border px-4 py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          View Invoice
                        </Button>
                      </td>
                      <td className="border px-4 py-2">
                        {extractionTable}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Controls ──────────────────────────────────────── */}
        <div className="flex justify-end space-x-2">
          <Button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            ← Prev
          </Button>
          <span className="self-center">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            disabled={page + 1 >= totalPages}
            onClick={() =>
              setPage((p) => Math.min(totalPages - 1, p + 1))
            }
          >
            Next →
          </Button>
        </div>
      </div>

      {/* ─── Invoice Detail Modal ────────────────────────────────────── */}
      {selectedDoc && (
        <InvoiceModalView
          userid={userId!}
          fileName={selectedDoc.file_path}
          invoiceExtractions={selectedDoc.invoice_extractions ?? []}
          onClose={() => setSelectedDoc(null)}
          onSaveSuccess={(updatedArray: ExtractionRecord[]) => {
            setSelectedDoc((prev) => {
              if (!prev) return null;
              return { ...prev, invoice_extractions: updatedArray };
            });
            // 2) Update the main docs[] array so the table reflects changes immediately
            setDocs((prevDocs) =>
              prevDocs.map((d) =>
                d.id === selectedDoc.id
                  ? { ...d, invoice_extractions: updatedArray }
                  : d
              )
            );
          }}
      />
      )}
    </>
  );
}
