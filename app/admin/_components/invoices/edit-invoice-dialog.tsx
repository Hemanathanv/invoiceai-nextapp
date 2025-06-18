"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

interface EditInvoiceDialogProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedInvoice: Partial<Invoice>) => void
  inputTokenRate: number
  outputTokenRate: number
}

export function EditInvoiceDialog({
  invoice,
  open,
  onOpenChange,
  onSave,
  inputTokenRate,
  outputTokenRate,
}: EditInvoiceDialogProps) {
  const [inputTokens, setInputTokens] = useState(0)
  const [outputTokens, setOutputTokens] = useState(0)

  useEffect(() => {
    if (invoice) {
      setInputTokens(invoice.input_tokens)
      setOutputTokens(invoice.output_tokens)
    }
  }, [invoice])

  const calculateCost = () => {
    const inputCost = inputTokens * inputTokenRate
    const outputCost = outputTokens * outputTokenRate
    return (inputCost + outputCost).toFixed(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      input_tokens: inputTokens,
      output_tokens: outputTokens,
    })
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>Update the token counts for {invoice.document_name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document" className="text-right">
                Document
              </Label>
              <Input id="document" value={invoice.document_name} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="input-tokens" className="text-right">
                Input Tokens
              </Label>
              <Input
                id="input-tokens"
                type="number"
                value={inputTokens}
                onChange={(e) => setInputTokens(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="output-tokens" className="text-right">
                Output Tokens
              </Label>
              <Input
                id="output-tokens"
                type="number"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Cost</Label>
              <div className="col-span-3 text-lg font-semibold">₹{calculateCost()}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Input tokens: ₹{inputTokenRate} per token</p>
              <p>Output tokens: ₹{outputTokenRate} per token</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
