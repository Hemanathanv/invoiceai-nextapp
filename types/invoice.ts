// Name: V.Hemanathan
// Describe: This file contains the types for the invoice extraction.used to standuardise the invoice extraction process.
// Framework: Next.js -15.3.2 

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
