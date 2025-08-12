// services/export.service.ts
import { QueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { InvoiceRow, LineItemRecord } from "@/types/invoice";

export interface UseInvoicesParams {
    userId: string 
    status: string | null
    dateRange: { from: Date; to: Date }
    searchTerm: string
    selectedClient: string
    page: number
    pageSize: number
    isTeamsManager: boolean
  }


const supabase = createClient();

// Columns we will NEVER export or present in the UI (case-insensitive)
const DEFAULT_HIDDEN = new Set([
    "extraction_id",
    "file_id",
    "client_name",
    "status",
    "file_path",
    "client_id",
    "created_at",
    "page_number",
  ].map(s => s.toLowerCase()));
  
  /** existing constant */
  export const INVOICE_BASE_COLS = [
    "extraction_id",
    "file_name",
    "file_id",
    "client_id",
    "client_name",
    "created_at",
    "status",
    "page_number",
    "file_path",
  ];


function getDynamicValue(obj: InvoiceRow, key: string): string {
    const val = (obj as unknown as Record<string, unknown>)[key];
    return val == null ? "" : String(val);
  }

/** CSV utils */
function csvEscape(value: unknown) {
  const s = value == null ? "" : String(value);
  if (s.includes('"')) return `"${s.replace(/"/g, '""')}"`;
  if (s.includes(",") || s.includes("\n") || s.includes("\r")) return `"${s}"`;
  return s;
}

/** Safely parse a line item (string or object) and return normalized record */
function parseLineItem(li: unknown): LineItemRecord {
  if (li == null) return {};
  if (typeof li === "string") {
    try {
      const parsed = JSON.parse(li);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [k, v == null ? null : v]),
        ) as LineItemRecord;
      }
      // if parse yields primitive or array, return raw
      return { raw_lineitem: li };
    } catch {
      return { raw_lineitem: li };
    }
  }
  if (typeof li === "object" && !Array.isArray(li)) {
    return Object.fromEntries(
      Object.entries(li as Record<string, unknown>).map(([k, v]) => [k, v == null ? null : v]),
    ) as LineItemRecord;
  }
  // other primitives
  return { raw_lineitem: String(li) };
}


/** getInvoiceValue accepts typed InvoiceRow and known column names */
function getInvoiceValue(inv: InvoiceRow, col: string): string {
  switch (col) {
    case "extraction_id":
      return inv.id ?? "";
    case "file_name":
      return inv.invoice_document?.file_name ?? inv.file_path?.split("/").pop() ?? "";
    case "file_id":
      return inv.invoice_document?.file_id ?? inv.file_id ?? "";
    case "client_id":
      return inv.client_id ?? "";
    case "client_name":
      return inv.client_name ?? "";
    case "created_at":
      return inv.created_at ?? "";
    case "status":
      return inv.status ?? "";
    case "page_number":
      return String(inv.page_number ?? inv.invoice_document?.page_count ?? "");
    case "file_path":
      return inv.file_path ?? "";
    default:
      return getDynamicValue(inv, col);
  }
}

/**
 * Fetch invoices from supabase (client-side)
 */
export async function fetchInvoicesFromDb(params: UseInvoicesParams) {
  const { userId, status, dateRange, searchTerm, selectedClient } = params;

  let q = supabase
    .from("invoice_approved")
    .select(`*, invoice_document:invoice_documents(id, file_name, file_id, page_count)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (searchTerm) q = q.ilike("file_path", `%${searchTerm}%`);
  if (dateRange) {
    q = q.gte("created_at", dateRange.from.toISOString()).lte("created_at", dateRange.to.toISOString());
  }
  if (selectedClient) q = q.eq("client_id", selectedClient);

  if (status !== undefined) {
    if (status === null) q = q.is("status", null);
    else q = q.eq("status", status);
  }

  const { data, error } = await q;
  if (error) throw error;
  const raw = (data || []) as any[];

  return raw.map(inv => ({
    ...inv,
    file_name: inv.invoice_document?.file_name ?? inv.file_path?.split("/").pop() ?? "",
    file_id: inv.invoice_document?.file_id ?? inv.file_id ?? "",
    page_number: inv.page_number ?? inv.invoice_document?.page_count ?? 1
  }));
}



/**
 * Build the full list of available export columns from rows.
 * This version will filter out any column that is in DEFAULT_HIDDEN.
 */
export function buildAvailableColumns(rows: InvoiceRow[]) {
    // Case-insensitive first-seen maps (keep original casing)
    const headerMap = new Map<string, string>();   // lower -> original
    const lineItemMap = new Map<string, string>(); // lower -> original
  
    for (const inv of rows) {
      const headers = inv.invoice_headers ?? {}
      if (headers && typeof headers === "object") {
        Object.keys(headers).forEach(k => {
          const low = k.toLowerCase()
          if (!headerMap.has(low)) headerMap.set(low, k)
        })
      }
      const items = inv.invoice_lineitems ?? []
      for (const li of items) {
        try {
          const obj = typeof li === "string" ? JSON.parse(li) : li
          if (obj && typeof obj === "object") {
            Object.keys(obj).forEach(k => {
              const low = k.toLowerCase()
              if (!lineItemMap.has(low)) lineItemMap.set(low, k)
            })
          }
        } catch {
          const low = "raw_lineitem"
          if (!lineItemMap.has(low)) lineItemMap.set(low, "raw_lineitem")
        }
      }
    }
  
    const headerKeysRaw = Array.from(headerMap.values())   // original casing
    const lineColsRaw = Array.from(lineItemMap.values())
  
    // Build takenLower set from invoice base cols + line item keys (case-insensitive)
    const takenLower = new Set<string>(INVOICE_BASE_COLS.map(c => c.toLowerCase()))
    lineColsRaw.forEach(l => takenLower.add(l.toLowerCase()))
  
    // Resolve header collisions (append _hdr if needed), but REMEMBER: later we will remove hidden columns
    const headerDisplayMap: Record<string, string> = {}
    const headerColsResolved: string[] = headerKeysRaw.map(orig => {
      // skip entirely if orig (case-insensitive) is hidden
      if (DEFAULT_HIDDEN.has(orig.toLowerCase())) return null as unknown as string
  
      let candidate = orig
      let low = candidate.toLowerCase()
      if (!takenLower.has(low) && !Object.prototype.hasOwnProperty.call(headerDisplayMap, candidate)) {
        takenLower.add(low)
        headerDisplayMap[candidate] = orig
        return candidate
      }
  
      let i = 0
      let attempt = `${orig}_hdr`
      while (takenLower.has(attempt.toLowerCase())) {
        i += 1
        attempt = `${orig}_hdr${i}`
      }
      takenLower.add(attempt.toLowerCase())
      headerDisplayMap[attempt] = orig
      return attempt
    }).filter(Boolean) // remove any nulls created due to DEFAULT_HIDDEN
  
    // Filter line item columns: remove any that are hidden (case-insensitive)
    const lineCols = lineColsRaw.filter(c => !DEFAULT_HIDDEN.has(c.toLowerCase()))
  
    // Also filter invoice base columns so any base in DEFAULT_HIDDEN is excluded
    const invoiceBaseVisible = INVOICE_BASE_COLS.filter(c => !DEFAULT_HIDDEN.has(c.toLowerCase()))
  
    const allColumns = [...invoiceBaseVisible, ...headerColsResolved, ...lineCols]
  
    return { 
      allColumns, 
      headerCols: headerColsResolved, 
      lineCols, 
      headerKeys: Array.from(headerMap.values()), 
      headerDisplayMap 
    }
  }
  
  /**
   * Build CSV from rows, optionally restricting to selectedColumns.
   * This enforces DEFAULT_HIDDEN removal — hidden columns will never be included.
   */
  export function buildCsvFromRows(
    rows: InvoiceRow[],
    selectedColumns?: string[],
    headerDisplayMap?: Record<string,string>
  ) {
    const avail = buildAvailableColumns(rows);
    const allColumns = avail.allColumns;
    const hdrMap = headerDisplayMap ?? avail.headerDisplayMap;
  
    let cols = Array.isArray(selectedColumns) && selectedColumns.length > 0
      ? allColumns.filter(c => selectedColumns.includes(c))
      : allColumns.slice();
  
    cols = cols.filter(c => !DEFAULT_HIDDEN.has(c.toLowerCase()));
  
    const csvLines: string[] = [];
    csvLines.push(cols.map(csvEscape).join(","));
  
    for (const inv of rows) {
      const items = inv.invoice_lineitems ?? [];
  
      const invoiceOrHeaderVal = (col: string) => {
        if (INVOICE_BASE_COLS.includes(col)) {
          if (DEFAULT_HIDDEN.has(col.toLowerCase())) return "";
          return getInvoiceValue(inv, col);
        }
        if (hdrMap && hdrMap[col]) {
          const origKey = hdrMap[col];
          if (DEFAULT_HIDDEN.has(origKey.toLowerCase())) return "";
          return (inv.invoice_headers && (inv.invoice_headers as Record<string, unknown>)[origKey] != null)
            ? (inv.invoice_headers as Record<string, unknown>)[origKey]
            : "";
        }
        return null;
      };
  
      if (items.length === 0) {
        const rowVals = cols.map(c => {
          const iv = invoiceOrHeaderVal(c);
          if (iv !== null) return csvEscape(iv);
          return "";
        });
        csvLines.push(rowVals.join(","));
        continue;
      }
  
      for (const li of items) {
        const obj: LineItemRecord = parseLineItem(li);
  
        const rowVals = cols.map(c => {
          const iv = invoiceOrHeaderVal(c);
          if (iv !== null) return csvEscape(iv);
          return csvEscape(obj[c] ?? "");
        });
        csvLines.push(rowVals.join(","));
      }
    }
  
    const csv = csvLines.join("\r\n");
    const filename = `invoices_export_${Date.now()}.csv`;
    return { csv, filename };
  }
  
  
  /**
   * exportCSV: fetch rows (via queryClient), and then build CSV using selectedColumns (but hidden columns removed).
   */
  export async function exportCSV(params: UseInvoicesParams, queryClient: QueryClient, selectedColumns?: string[]) {
    const key = ["invoices", params]
    const rows = await queryClient.fetchQuery({
      queryKey: key,
      queryFn: () => fetchInvoicesFromDb(params),
      staleTime: 30_000,
    })

    const approvedRows = rows.filter(inv => inv.status === "approved");
  
    // Build available columns to get canonical set & headerDisplayMap
    const { allColumns, headerDisplayMap } = buildAvailableColumns(approvedRows)
  
    // If selectedColumns supplied, only keep those that are in allColumns and not hidden
    const finalSelected = Array.isArray(selectedColumns) && selectedColumns.length > 0
      ? selectedColumns.filter(c => allColumns.includes(c) && !DEFAULT_HIDDEN.has(c.toLowerCase()))
      : allColumns
  
    const { csv, filename } = buildCsvFromRows(approvedRows, finalSelected, headerDisplayMap)
  
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
