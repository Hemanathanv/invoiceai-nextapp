import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Invoice {
  file_path: string;
  ai_job_status: string;
  created_at: string;
}

interface HistoryTabProps {
    profileId: string;
  }

export default function HistoryTab({ profileId }: HistoryTabProps)  {
  const supabase = createClient();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoice_documents")
        .select("file_path, ai_job_status, created_at")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else if (data) {
        setInvoices(data);
      }
      setLoading(false);
    }

    useEffect(() => {
        if (!profileId) return;
    
        // Initial load
        refreshHistory();
    
        // Subscribe to INSERT, DELETE, UPDATE events
        const channel: RealtimeChannel = supabase
          .channel(`public:invoice_documents:user_id=eq.${profileId}`)
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "invoice_documents", filter: `user_id=eq.${profileId}` },
            () => {
              // console.log("▶️ INSERT event received");
              refreshHistory();
            }
          )
          .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "invoice_documents", filter: `user_id=eq.${profileId}` },
            () => {
              // console.log("▶️ DELETE event received");
              refreshHistory();
            }
          )
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "invoice_documents", filter: `user_id=eq.${profileId}` },
            () => {
              console.log("▶️ UPDATE event received");
              refreshHistory();
            }
          )
          .subscribe();
    
        // 3) Cleanup on unmount or when profileId changes
        return () => {
          supabase.removeChannel(channel);
        };
      }, [profileId]);
      
  const renderStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "processing":
        return <Badge variant="outline">Processing</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={24} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">Error: {error}</div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-16 border rounded-md bg-muted/20">
        <h3 className="text-lg font-medium mb-2">No processing history yet</h3>
        <p className="text-muted-foreground mb-4">
          Upload and process documents to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[400px]">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {invoices.map((inv) => {
          // Strip 'documents/' prefix and leading profileId_ from path
          const rawPath = inv.file_path;
          const filename = rawPath.split("/").pop() || rawPath;
          const displayName = filename.replace(new RegExp(`^${profileId}_`), "");

          return (
            <TableRow key={rawPath}>
              <TableCell>{displayName}</TableCell>
              <TableCell>{renderStatus(inv.ai_job_status)}</TableCell>
              <TableCell>{new Date(inv.created_at).toLocaleString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}
