"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { createClient, fetchUserUsage } from "@/utils/supabase/client";
import InvoiceModalView from "./_components/InvoiceModalView";
// import ExtractionPager from "./_components/ExtractionPager";
import { ExtractionRecord } from "@/types/invoice";
import { fetchInvoiceDocsByUser, fetchInvoiceDocsByInvoiceNumber } from "./service/extraction.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/useUserProfile";
import ExportModal from "./_components/exportModal";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface InvoiceDocument {
  file_name: string;
  id: string;
  user_id: string;
  file_paths: string[];
  file_path: string;
  invoice_headers: Record<string, string>;
  invoice_lineitems: ExtractionRecord[];
  created_at: string;
  invoice_number?: string;
}

const supabase = createClient();

export default function Extractions() {
  const [docs, setDocs] = useState<ExtractionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [selectedDoc, setSelectedDoc] = useState<InvoiceDocument | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [expanding, setExpanding] = useState<boolean>(false);
  const [openExposrtModal, setOpenExposrtModal] = useState(false);
  const PAGE_SIZE = 20;

  const [searchText, setSearchText] = useState("");
  const [mode, setMode] = useState<"file_name" | "invoice_number">("file_name");

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    fetchUser();
  }, []);

  const fetchPage = useCallback(
    async ({ userId, pageIndex }: { userId: string; pageIndex: number }) => {
      setLoading(true);
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      let data: ExtractionRecord[] = [];
      
      try {
        if (mode === "file_name") {
          data = await fetchInvoiceDocsByUser(userId, from, to);
        } else {
          data = await fetchInvoiceDocsByInvoiceNumber(userId, from, to);
        }

        if (!data) {
          setDocs([]);
        } else {
          console.log("doc data", data);
          setDocs(data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocs([]);
      }
      
      setLoading(false);
    },
    [mode]
  );

  useEffect(() => {
    if (userId) fetchPage({ userId, pageIndex: page });
  }, [userId, page, fetchPage]);

  useEffect(() => {
    if (!userId) return;
    const channelName = `realtime:invoice_extractions:user=${userId}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "invoice_extractions",
        filter: `user_id=eq.${userId}`,
      }, () => {
        fetchPage({ userId, pageIndex: page });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, page, fetchPage]);

  const extractFileName = (path: string, userId?: string): string => {
    const parts = path.split("/");
    let name = parts[parts.length - 1];
    if (userId && name.startsWith(`${userId}_`)) {
      name = name.slice(userId.length + 1);
    }
    return name;
  };
  
  const filteredDocs = docs.filter((doc) => {
    const searchValue = searchText.toLowerCase();
  
    if (mode === "file_name") {
      const fileName = extractFileName(doc.file_path, doc.user_id).toLowerCase();
      return fileName.includes(searchValue);
    }
  
    if (mode === "invoice_number") {
      const invoiceNumber = (doc as any).invoice_number || "";
      return String(invoiceNumber).toLowerCase().includes(searchValue);
    }
  
    return true;
  });

  const handleSaveAsExcel = () => {
    console.log("No documents to export");
    setOpenExposrtModal(true);
  };

  const { profile } = useUserProfile();
  const [totalDocs, setTotalDocs] = useState<number>(0);

  useEffect(() => {
    if (loading || !profile?.id) return;
    const fetchUsage = async () => {
      const { data, error } = await fetchUserUsage(profile.id);
      if (!error) setTotalDocs(data?.extractions_used ?? 0);
    };
    fetchUsage();
  }, [loading, profile]);

  const totalPages = Math.ceil(totalDocs / PAGE_SIZE) || 1;

  return (
    <>
      <Dialog open={openExposrtModal} onOpenChange={setOpenExposrtModal}>
        <DialogContent className="sm:max-w-[1024px]">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
          </DialogHeader>
          <ExportModal userId={userId} />
        </DialogContent>
      </Dialog>

      <div className="min-h-screen flex flex-col p-8 space-y-4">
        <div className="flex justify-end items-center">
         
          <div className="space-x-2">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500" onClick={handleSaveAsExcel}>
              Save as Excel
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-teal-500">
              Send to Mail
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-x-2">
          <div className={`flex flex-col justify-between overflow-hidden ${expanding ? "hidden" : "w-full md:w-1/4"} border rounded`}>
            <div>
              {/* Search */}
              <div className="flex p-2 space-x-2">
              <select
                className="border px-3 py-1 rounded text-sm"
                value={mode}
                onChange={e => setMode(e.target.value as "file_name" | "invoice_number")}
              >
                <option value="file_name">File Name</option>
                <option value="invoice_number">Invoice Number</option>
              </select>
                <input
                  className="w-full border px-2 py-1 rounded"
                  placeholder={`Search ${mode.replace("_", " ")}`}
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div> 

              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 sticky top-0">
                    <th className="border px-4 py-2 text-left">
                      {mode === "file_name" ? "File Name" : "Invoice Number"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={1} className="border px-4 py-2 text-center">Loading…</td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={1} className="border px-4 py-2 text-center">No documents found.</td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc, idx) => {
                      let displayName = "";
                      
                      if (mode === "file_name") {
                        displayName = (doc as any).file_name || "No File Name";
                      } else {
                        // When grouped by invoice number, use the invoice_number field
                        displayName = (doc as any).invoice_number || "No Invoice Number";
                      }
                      
                      return (
                        <tr key={doc.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td
                            className={`border px-4 py-2 cursor-pointer ${selectedDoc?.id === doc.id ? "bg-gray-200" : ""}`}
                            onClick={() => setSelectedDoc(doc as any)}
                          >
                            {displayName}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex w-full justify-between p-2 space-x-2">
              <Button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                ← Prev
              </Button>
              <span className="self-center">Page {page + 1} of {totalPages}</span>
              <Button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>
                Next →
              </Button>
            </div>
          </div>

          {/* Detail view */}
          <div className={`${expanding ? "w-full" : "w-full md:w-3/4"} overflow-auto border rounded`}>
            <div onClick={() => setExpanding(!expanding)} className="absolute z-10 p-1 bg-black text-white rounded">
              {expanding ? <ArrowRightIcon className="ml-2 h-4 w-4" /> : <ArrowLeftIcon className="mr-2 h-4 w-4" />}
            </div>
            {selectedDoc ? (
              <InvoiceModalView
                userid={userId!}
                file_paths={selectedDoc.file_paths}
                file_path={selectedDoc.file_path}
                fileName={selectedDoc.file_name}
                invoiceExtractions={selectedDoc.invoice_lineitems  ?? []}
                invoice_headers={selectedDoc.invoice_headers}  
                onSaveSuccess={(updatedArray: ExtractionRecord[]) => {
                  setSelectedDoc((prev) => prev ? { ...prev, invoice_extractions: updatedArray } : null);
                  setDocs((prevDocs) =>
                    prevDocs.map((d) =>
                      d.id === selectedDoc.id ? { ...d, invoice_extractions: updatedArray } : d
                    )
                  );
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full"><p>Select Invoice</p></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
