"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { EditInvoiceDialog } from "@/app/admin/_components/invoices/edit-invoice-dialog"
import { createClient } from "@/utils/supabase/client"

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

// Token to rupee conversion rates
const INPUT_TOKEN_RATE = 0.002 // ₹0.002 per input token
const OUTPUT_TOKEN_RATE = 0.006 // ₹0.006 per output token



export function InvoicesTable() {
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
        .from("invoice_documents")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      console.log("Fetched invoices:", data)

      setInvoices(data || [])
    } catch (error) {
      console.error("Error fetching invoices:", error)
      // Fallback to sample data
      setInvoices([
        {
          id: "1",
          user_id: "user1",
          document_name: "Invoice_2023_001.pdf",
          input_tokens: 1500,
          output_tokens: 800,
          status: "processed",
          created_at: "2023-05-15T10:30:00Z",
          amount: 7.8,
        },
        {
          id: "2",
          user_id: "user2",
          document_name: "Receipt_Q2_2023.pdf",
          input_tokens: 2200,
          output_tokens: 1100,
          status: "pending",
          created_at: "2023-06-22T14:45:00Z",
          amount: 10.6,
        },
        {
          id: "3",
          user_id: "user1",
          document_name: "Statement_July_2023.pdf",
          input_tokens: 3000,
          output_tokens: 1500,
          status: "processed",
          created_at: "2023-07-10T09:15:00Z",
          amount: 15.0,
        },
        {
          id: "4",
          user_id: "user3",
          document_name: "Tax_Document_2023.pdf",
          input_tokens: 4500,
          output_tokens: 2200,
          status: "failed",
          created_at: "2023-08-05T16:20:00Z",
          amount: 22.2,
        },
        {
          id: "5",
          user_id: "user2",
          document_name: "Contract_2023_Q3.pdf",
          input_tokens: 5000,
          output_tokens: 2500,
          status: "processed",
          created_at: "2023-09-18T11:50:00Z",
          amount: 25.0,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsDialogOpen(true)
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const calculateCost = (inputTokens: number, outputTokens: number) => {
    const inputCost = inputTokens * INPUT_TOKEN_RATE
    const outputCost = outputTokens * OUTPUT_TOKEN_RATE
    return (inputCost + outputCost).toFixed(2)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Input Tokens</TableHead>
              <TableHead>Output Tokens</TableHead>
              <TableHead>Cost (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.document_name}</TableCell>
                  {/* <TableCell>{invoice.input_tokens.toLocaleString()}</TableCell>
                  <TableCell>{invoice.output_tokens.toLocaleString()}</TableCell> */}
                  <TableCell>₹{calculateCost(invoice.input_tokens, invoice.output_tokens)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "processed"
                          ? "default"
                          : invoice.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(invoice.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
