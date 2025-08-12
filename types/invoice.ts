// Name: V.Hemanathan
// Describe: This file contains the types for the invoice extraction.used to standuardise the invoice extraction process.
// Framework: Next.js -15.3.2 

export interface InvoiceDocument {
  id: string;
  file_name: string | null;
  file_id: string;
  page_count: number | null;
}

export interface InvoiceExtraction {
  id: string
  user_id: string
  org_id: string
  client_id: string
  file_path: string
  invoice_headers: Record<string, any>
  invoice_lineitems: string[]
  status: "hold" | "duplicate" | "approved" | null
  created_at: string

  invoice_document?: InvoiceDocument | null;
}

export interface InvoiceApproved {
  id: string
  invoice_document_id: string
  status: boolean
  export_status: string
  created_at: string
}

export type InvoiceStatus = "ai-results" | "hold" | "duplicate" | "approved"

export interface LineItem {
  id?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface InvoicePage extends InvoiceExtraction {
  file_name: string
  file_id: string
  page_number: number
  client_name: string | null
}


export type HeadersMap = Record<string, string>

export type ConnectionAction =
| { kind: "none" }
| { kind: "excel"; onClick: () => void }
| { kind: "zoho"; onClick: () => void }


export interface InvoiceRow {
  id: string;
  user_id: string;
  org_id?: string | null;
  client_id?: string | null;
  file_path?: string | null;
  invoice_headers?: Record<string, unknown> | null;
  invoice_lineitems?: Array<string | Record<string, unknown>> | null;
  status?: "hold" | "duplicate" | "approved" | null;
  created_at?: string | null;
  invoice_document?: InvoiceDocument | null;
  // derived fields used in UI
  file_name?: string;
  file_id?: string;
  page_number?: number;
  client_name?: string | null;
}

/** Normalized line item object */
export type LineItemRecord = Record<string, string | number | boolean | null>;