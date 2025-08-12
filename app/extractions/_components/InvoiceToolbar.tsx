"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "./DateRangePicker"
import { ClientCombobox } from "./ClientCombobox"
import { Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConnectionAction } from "@/types/invoice"

interface InvoiceToolbarProps {
  dateRange: { from: Date; to: Date }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedClient?: string
  onClientChange?: (client: string) => void
  pendingCount: number
  action?: ConnectionAction
}

export function InvoiceToolbar({
  dateRange,
  onDateRangeChange,
  searchTerm,
  onSearchChange,
  selectedClient,
  onClientChange,
  pendingCount,
  action
}: InvoiceToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4 flex-1">
          <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
          {onClientChange && selectedClient !== undefined && (
          <ClientCombobox value={selectedClient} onChange={onClientChange} />
             )}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by file name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {action?.kind === "zoho" && (
<Button variant="default" onClick={action.onClick}>Send to Zoho Books</Button>
)}
{action?.kind === "excel" && (
            <Button variant="outline" onClick={action.onClick}>
              <Download className="h-4 w-4 mr-2" />
              Export (.csv)
            </Button>
          )}

        <Badge className="bg-red-600 text-white rounded-full px-3 py-1 text-sm">Pending: {pendingCount}</Badge>
      </div>
    </div>
  )
}
