"use client"

import { useEffect, useState } from "react"
// import { MoreHorizontal, Pencil } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// import { Badge } from "@/components/ui/badge"
import { EditInvoiceDialog } from "@/app/admin/_components/invoices/edit-invoice-dialog"
import { createClient } from "@/utils/supabase/client"
<<<<<<< HEAD
import { toast } from "sonner"
=======
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from 'ag-grid-react';
import { useProfile } from "@/context/GlobalState";
ModuleRegistry.registerModules([AllCommunityModule]);

>>>>>>> 7958ed1 (AG-grid)

type Invoice = {
  id: string
  user_id: string
  document_name: string
  input_tokens: number
  output_tokens: number
  status: string
  created_at: string
  amount: number
}


export function InvoicesTable() {
  const  {profiles}  = useProfile();
  const [rowData, setRowData] = useState<Invoice[]>([]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const INPUT_TOKEN_RATE = 0.10 
  const OUTPUT_TOKEN_RATE = 0.40 
  const TOKENS = 1000000;
  const [inrRate, setInrRate] = useState(0);

useEffect(() => {
  fetch("https://api.exchangerate.host/convert?from=USD&to=INR")
    .then(res => res.json())
    .then(data => setInrRate(data.result || 83.5)); // fallback to default
}, []);
  useEffect(() => {
    if (!profiles?.id) return;

    setColumnDefs([
      { field: "user_name",filter:true, headerName: "User Name" },
      { field: "total_input_tokens",filter:true, headerName: "Input Tokens" },
      { field: "total_output_tokens",filter:true, headerName: "Output Tokens" },
      {
        headerName: "Cost (₹)",
        field: "total_cost",
        valueGetter: (params) => {
          const input = Number(params.data.total_input_tokens) || 0;
          const output = Number(params.data.total_output_tokens) || 0;
    
          // Step 1: USD cost calculation
          const inputCostUSD = (input / TOKENS) * INPUT_TOKEN_RATE;
          const outputCostUSD = (output / TOKENS) * OUTPUT_TOKEN_RATE;
    
          const totalUSD = inputCostUSD + outputCostUSD;
    
          // Step 2: Convert USD to INR
          const totalINR = totalUSD * inrRate;
    
          return totalINR;
        },filter:true,
        valueFormatter: (params) => `₹${params.value.toFixed(2)}`
      },
    ]);
  }, [profiles?.id]);




  const supabase = createClient()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchInvoices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchInvoices() {
    try {
      setLoading(true)
      const { data, error } = await supabase
      .from("user_token_usage")
      .select("*")

      if (error) throw error
      console.log("Fetched invoices:", data)
      setRowData(data || []);
      setInvoices(data || [])
    } catch (error) {
      console.error("Error fetching invoices:", error)
      // Fallback to sample data
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  // const handleEditInvoice = (invoice: Invoice) => {
  //   setEditingInvoice(invoice)
  //   setIsDialogOpen(true)
  // }

  const handleSaveInvoice = async (updatedInvoice: Partial<Invoice>) => {
    try {
      if (!editingInvoice) return

      const {  error } = await supabase
        .from("invoice_documents")
        .update({
          input_tokens: updatedInvoice.input_tokens,
          output_tokens: updatedInvoice.output_tokens,
        })
        .eq("id", editingInvoice.id)
        .select()

      if (error) throw error

      // Update the invoices list with the updated invoice
      setInvoices(
        invoices.map((invoice) => (invoice.id === editingInvoice.id ? { ...invoice, ...updatedInvoice } : invoice)),
      )

      setIsDialogOpen(false)
      setEditingInvoice(null)
    } catch (error) {
      console.error("Error updating invoice:", error)
    }
  }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString()
  // }



  return (
    <>
    <div style={{ width: "100%", height: "100vh" }}>
      <AgGridReact loading={loading} rowData={rowData} columnDefs={columnDefs} />
    </div>
     

      <EditInvoiceDialog
        invoice={editingInvoice}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveInvoice}
        inputTokenRate={INPUT_TOKEN_RATE}
        outputTokenRate={OUTPUT_TOKEN_RATE}
      />
    </>
  )
}