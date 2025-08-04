// Add this to your service file (e.g., Invoice.service.ts)
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { LineItem } from '@/types/invoice' // Assuming this type exists
import { toast } from "sonner";

const supabase = createClient()

export interface InvoiceExtraction {
  id: string
  user_id: string
  org_id: string
  client_id: string
  file_path: string
  file_name: string
  file_id: string
  page_number: number
  invoice_headers: Record<string, string>
  invoice_lineitems: string[]
  status: "hold" | "duplicate" | "approved" | null
  created_at: string
  client_name: string | null;  // from view
  invoice_document?: { 
    id: string;
    file_name: string | null;
    file_id: string;
    page_count: number;
  };
}

export interface GroupedInvoice {
  id: string
  file_name: string
  file_path: string
  file_id: string
  client_name: string; 
  status: "hold" | "duplicate" | "approved" | null
  created_at: string
  page_count: number
  page_number: number
  pages: InvoiceExtraction[]
  invoice_headers: Record<string, string>
  invoice_lineitems: string[]
  statusCounts: {
    approved: number;
    hold:     number;
    duplicate: number;
    pending:   number;
  };
}

interface UseInvoicesParams {
  userId: string
  status: string | null
  dateRange: { from: Date; to: Date }
  searchTerm: string
  selectedClient: string
  page: number
  pageSize: number
}


// Define the payload for our mutation
interface UpdateStatusPayload {
  extractionId: string;
  invoiceDocumentId: string;
  userId: string;
  orgId: string;
  clientId: string;
  clientName: string | null;
  filePath: string;
  headers: Record<string, string | number | null>;
  lineItems: LineItem[];
  newStatus: 'hold' | 'duplicate' | 'approved';
}

// The new mutation hook
export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateStatusPayload) => {
      // Clean up line items: remove temporary UI properties like 'id', 'isNewRow' etc.
      const cleanLineItems = payload.lineItems
        .filter(item => !item.isAddButton && !item.isNewRow)
        .map(({ id, isNewRow, isAddButton, ...rest }) => rest);

      const { error } = await supabase.rpc('new_handle_invoice_status_change', {
        p_invoice_document_id: payload.invoiceDocumentId,
  p_user_id: payload.userId,
  p_org_id: payload.orgId,
  p_client_id: payload.clientId,
  p_client_name: payload.clientName,
  p_file_path: payload.filePath,
  p_invoice_headers: payload.headers,
  p_invoice_lineitems: cleanLineItems,
  p_new_status: payload.newStatus,
      })

      if (error) {
        // console.error("Error updating invoice status:", error)
        throw new Error(`Failed to update status: ${error.message}`)
      }

      return { success: true }
    },
    // After the mutation succeeds, invalidate relevant queries to refetch fresh data
    onSuccess: () => {
      // console.log("Invoice status updated successfully. Invalidating queries...");
      // Invalidate the main invoices list to reflect the status change in the table
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      // Invalidate the counts on the sidebar/dashboard
      queryClient.invalidateQueries({ queryKey: ['invoice-counts'] })
    },
    onError: (error) => {
      // You can add global error handling here, e.g., showing a toast notification
      console.error("Mutation failed:", error);
      toast.error("Failed to update invoice status. Please try again.");
    }
  })
}


// Group pages into invoices
const groupInvoicesByFile = (invoices: InvoiceExtraction[]): GroupedInvoice[] => {
  const map: Record<string, GroupedInvoice> = {};
  invoices.forEach(inv => {
    const name = inv.file_name;
    const fileID = inv.file_id;
    
    if (!fileID) return;
    if (!map[fileID]) {
      map[fileID] = {
        id: `group-${fileID}`,
        file_name: name,
        file_id: fileID,
        file_path: inv.file_path,
        client_name: inv.client_name || "no client",
        status: inv.status,
        created_at: inv.created_at,
        page_count: 0,
        page_number: inv.page_number,
        pages: [],
        statusCounts: { approved: 0, hold: 0, duplicate: 0, pending: 0 },
        invoice_headers: inv.invoice_headers,
        invoice_lineitems: inv.invoice_lineitems,
      };
    }
    map[fileID].pages.push(inv);
    map[fileID].page_count = map[fileID].pages.length;
    const st = inv.status ?? "pending";
    map[fileID].statusCounts[st as keyof typeof map[string]["statusCounts"]]++;
  });

  

  Object.values(map).forEach(group => {
    group.pages.sort((a, b) => (a.page_number ?? 0) - (b.page_number ?? 0));
    group.page_count = group.pages.length;
  });

  return Object.values(map)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
};

async function fetchInvoicesFromDb({ userId, status, dateRange, searchTerm, selectedClient }: UseInvoicesParams) {
  // console.log("Supabase query params:", {
  //   userId,
  //   status,
  //   dateRange: dateRange
  //     ? { from: dateRange.from.toISOString(), to: dateRange.to.toISOString() }
  //     : null,
  //   searchTerm,
  //   selectedClient,
  // });

  let q = supabase
    .from("invoice_approved")
    .select(
      `*,
      invoice_document:invoice_documents (
        id,
        file_name,
        file_id,
        page_count
      )`,  
      { count: "exact" }
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

    // if (status === null) q = q.is("status", null)
    //   else if (status) q = q.eq("status", status)
    
    if (searchTerm) q = q.ilike("file_path", `%${searchTerm}%`)
    if (dateRange) q = q.gte("created_at", dateRange.from.toISOString()).lte("created_at", dateRange.to.toISOString())
    
      if (selectedClient) {
        q = q.eq("client_id", selectedClient)
      }

  const { data} = await q;
  const raw = (data as InvoiceExtraction[]) || [];

  // Now map each extraction so we have top‑level file_name and client_name:
  return raw.map(inv => ({
    ...inv,
    file_name: inv.invoice_document?.file_name ?? inv.file_path.split("/").pop()!,
    file_id: inv.invoice_document?.file_id ?? "",
    page_number: inv.invoice_document?.page_count ?? 0
  }));
}


export function useInvoices(params: UseInvoicesParams) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const raw = await fetchInvoicesFromDb(params)
      const grouped = groupInvoicesByFile(raw)
      let filtered = grouped

      if (params.status !== null) {
        if (params.status === "hold") {
          filtered = grouped
            .filter(g => g.statusCounts.hold > 0)
            .map(g => {
              const pagesOnHold = g.pages.filter(p => p.status === "hold")
              return {
                ...g,
                pages: pagesOnHold,
                page_count: pagesOnHold.length,
                statusCounts: {
                  approved: 0,
                  duplicate: 0,
                  pending: 0,
                  hold: pagesOnHold.length,
                },
              }
            })
        }
        if (params.status === "approved") {
          filtered = grouped
            .filter(g => g.statusCounts.approved > 0)
            .map(g => {
              const approvedPages = g.pages.filter(p => p.status === "approved")
              return {
                ...g,
                pages: approvedPages,
                page_count: approvedPages.length,
                statusCounts: {
                  hold: 0,
                  duplicate: 0,
                  pending: 0,
                  approved: approvedPages.length,
                },
              }
            })
        }
        if (params.status === "duplicate") {
          filtered = grouped
            .filter(g => g.statusCounts.duplicate > 0)
            .map(g => {
              const dupPages = g.pages.filter(p => p.status === "duplicate")
              return {
                ...g,
                pages: dupPages,
                page_count: dupPages.length,
                statusCounts: {
                  hold: 0,
                  duplicate: dupPages.length,
                  pending: 0,
                  approved: 0,
                },
              }
            })
        }
        // You can add other status filters here if needed
      }

      const from = (params.page - 1) * params.pageSize
      const to = from + params.pageSize

      // Use filtered here, not grouped, to paginate the filtered results
      return {
        data: filtered.slice(from, to),
        total: filtered.length,
        page: params.page,
        pageSize: params.pageSize,
      }
    },
    staleTime: 30000,
  })
}
