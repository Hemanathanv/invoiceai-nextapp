"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, X } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useImagePublicUrl } from "../service/ZoomableImage.service"

interface InvoiceViewerProps {
  invoice: any
  isOpen: boolean
  onClose: () => void
}

export function InvoiceViewer({ invoice, isOpen, onClose }: InvoiceViewerProps) {
  const [lineItems, setLineItems] = useState(invoice.invoice_lineitems || [])
  // const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const {
    data: publicUrl,
    isLoading: imageLoading,
    error: imageError,
  } = useImagePublicUrl(invoice.file_path)


  const updateLineItem = (index: number, field: string, value: string) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
    // TODO: Implement save to database
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[95vh] max-w-none">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle>Invoice: {invoice.file_path?.split("/").pop() || "Unknown"}</DrawerTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>

        <div className="flex h-full overflow-hidden">
          {/* Left Panel - Image Preview */}
          <div className="w-1/2 p-6 border-r bg-gray-50 flex items-center justify-center">
          {imageLoading ? (
  <div className="flex-1 flex items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
  </div>
) : imageError || !publicUrl ? (
  <div className="flex-1 flex items-center justify-center text-red-500">
    <AlertCircle className="h-6 w-6 mr-2" />
    <span>Error loading image</span>
  </div>
) : (
              <div className="max-w-full max-h-full overflow-auto">
                <Image
                  src={publicUrl || "/placeholder.svg"}
                  alt="Invoice"
                  width={800}
                  height={1000}
                  className="object-contain"
                  crossOrigin="anonymous"
                />
              </div>

            )}
          </div>

          {/* Right Panel - Data */}
          <div className="w-1/2 p-6 overflow-auto">
            <Accordion type="multiple" defaultValue={["headers", "lineitems"]} className="w-full">
              {/* Invoice Headers */}
              <AccordionItem value="headers">
                <AccordionTrigger className="text-lg font-semibold">Invoice Headers</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {invoice.invoice_headers &&
                      Object.entries(invoice.invoice_headers).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-4 items-center">
                          <Label className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</Label>
                          <div className="col-span-2">
                            <Input value={String(value || "")} readOnly className="bg-gray-50" />
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Invoice Line Items */}
              <AccordionItem value="lineitems">
                <AccordionTrigger className="text-lg font-semibold">Invoice Line Items</AccordionTrigger>
                <AccordionContent>
                  {lineItems && lineItems.length > 0 ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lineItems.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  value={item.description || ""}
                                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                                  className="border-none p-1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.quantity || ""}
                                  onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                                  className="border-none p-1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.unit_price || ""}
                                  onChange={(e) => updateLineItem(index, "unit_price", e.target.value)}
                                  className="border-none p-1"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.total || ""}
                                  onChange={(e) => updateLineItem(index, "total", e.target.value)}
                                  className="border-none p-1"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">No line items available</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
