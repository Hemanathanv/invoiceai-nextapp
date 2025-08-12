"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

export interface ClientOption {
  value: string
  label: string
}

export interface InvoiceExtraction {
  id: string
  user_id: string
  user_name: string
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
  user_name?: string | null;
}

interface UseInvoicesParams {
  userId: string
  status: string | null
  dateRange: { from: Date; to: Date }
  searchTerm: string
  selectedClient: string
  page: number
  pageSize: number
  isTeamsManager: boolean
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



async function fetchInvoicesFromDb({ userId, status, dateRange, searchTerm, selectedClient, isTeamsManager }: UseInvoicesParams) {
  // console.log("Supabase query params:", {
  //   userId,
  //   status,
  //   dateRange: dateRange
  //     ? { from: dateRange.from.toISOString(), to: dateRange.to.toISOString() }
  //     : null,
  //   searchTerm,
  //   selectedClient,
  // });

  const source = isTeamsManager
? (status === "approved" ? "invoice_approved_with_user" : "invoice_extractions_with_user")
: (status === "approved" ? "invoice_approved" : "invoice_extractions");

  let q = supabase
    .from(source)
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
    .order("created_at", { ascending: false });


    if (isTeamsManager) {
      // no user_id eq; rely on client-side client filter + RLS
      if (selectedClient) q = q.eq("client_id", selectedClient);
      // optionally also constrain by org if available in your client state
      // q = q.eq("org_id", currentOrgId);
    } else {
      q = q.eq("user_id", userId);
    }
    

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
    page_number: inv.invoice_document?.page_count ?? 0,
    user_name: inv.user_name ?? null
  }));
}


export function useInvoices(params: UseInvoicesParams) {
  
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const raw = await fetchInvoicesFromDb(params)
      const grouped = groupInvoicesByFile(raw)
      const groupedWithUser = grouped.map(g => {
        const names = Array.from(
        new Set(g.pages.map(p => p.user_name).filter(Boolean))
        ) as string[]
        return { ...g, user_name: names.join(", ") || null }
        })

      let filtered = groupedWithUser
      if (params.status !== null) {
        // map null to 'pending', otherwise use the exact key
        const statusKey = (params.status || "pending") as
          | "pending"
          | "approved"
          | "hold"
          | "duplicate"

        filtered = groupedWithUser.filter(g => g.statusCounts[statusKey] > 0)
      }

      const from = (params.page - 1) * params.pageSize
      const to = from + params.pageSize
      
      return { data: filtered.slice(from, to),
        total: filtered.length, page: params.page, pageSize: params.pageSize }
    },
    staleTime: 30000,
  })
}

export function useInvoiceCounts(
  userId: string,
  selectedClient: string,
  isTeamsManager: boolean,
  currentOrgId?: string
  ) {
  return useQuery({
  // include manager flag, client, and org in the key so cache separates correctly
  queryKey: ["invoice-counts", { userId, isTeamsManager, selectedClient, currentOrgId }],
  queryFn: async () => {
  // Managers: read from the “with_user” views so user_name is available if needed
  // Non-managers: base tables are fine
  const sources = isTeamsManager
  ? { extractions: "invoice_extractions_with_user", approved: "invoice_approved_with_user" }
  : { extractions: "invoice_extractions", approved: "invoice_approved" };
  
    // Build one query base (we’ll reuse filters for both)
    const buildBase = (table: string) => {
      let q = supabase.from(table).select("*", { count: "exact" });
  
      if (isTeamsManager) {
        // Manager view: constrain by client (and optionally org)
        if (selectedClient) q = q.eq("client_id", selectedClient);
        if (currentOrgId)   q = q.eq("org_id", currentOrgId);
      } else {
        // Non-manager: user scoped
        q = q.eq("user_id", userId);
      }
      return q;
    };
  
    // Fetch extractions (includes null/hold/duplicate/approved) and approved separately
    // If your schema stores all statuses in invoice_extractions, one fetch is enough.
    // Here we read only from invoice_extractions and count by status.
    const { data, error } = await buildBase(sources.extractions);
    if (error) throw error;
  
    const rows = (data as InvoiceExtraction[]) || [];
  
    return {
      aiResults: rows.filter(r => r.status === null).length,
      hold:      rows.filter(r => r.status === "hold").length,
      duplicate: rows.filter(r => r.status === "duplicate").length,
      approved:  rows.filter(r => r.status === "approved").length,
    };
  },
  staleTime: 60000,
  });
  }

export function useOrgNameFromId(user_id: string) {
  return useQuery<{org_name: string, org_id: string, role: string} | null, Error>({
    queryKey: ["user_by_userId", user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams_table")
        .select("org_name, org_id, role")
        .eq("user_id", user_id)
        .single()
      if (error) throw error
      return {org_name: data.org_name ?? " ", org_id: data.org_id ?? " ", role: data.role ?? " "}
    },
    enabled: Boolean(user_id),
    staleTime: Infinity,
  })
}

export function useClientsFromOrg(orgId: string){
  return useQuery<ClientOption[], Error>({
    queryKey: ["clients", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_clients_table")
        .select("client_id, client_name")
        .eq("org_id", orgId)
      if (error) throw error

      // map into { value, label }
      const uniqueMap = new Map<string, string>()
      data.forEach(row => {
        if (!uniqueMap.has(row.client_id)) {
          uniqueMap.set(row.client_id, row.client_name)
        }
      })

      // Convert map to array of { value, label }
      return Array.from(uniqueMap.entries()).map(([client_id, client_name]) => ({
        value: client_id,
        label: client_name,
      }))
    },
    enabled: Boolean(orgId),
    placeholderData: [],
    staleTime: 1000 * 60 * 5,    // cache 5 minutes
  })

}

