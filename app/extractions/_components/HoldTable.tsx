"use client"

import type React from "react"
import { useState, useMemo, useCallback, JSX, useRef } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef, GridReadyEvent, ICellRendererParams } from "ag-grid-community"
import { InlineInvoiceViewer } from "./InlineInvoiceViewer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronRight, ChevronDown, AlertTriangle, FileText } from "lucide-react"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community"

ModuleRegistry.registerModules([AllCommunityModule])

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { GroupedInvoice, useInvoices } from "../service/insert.service"
import { useFieldHeaders } from "../service/ZoomableImage.service"
import { InvoiceExtraction, InvoicePage, LineItem } from "@/types/invoice"

interface HoldTableProps {
  userId: string
  dateRange: { from: Date; to: Date }
  searchTerm: string
  selectedClient: string
  currentOrg: string
  subscriptionTier: string
  isTeamsManager: boolean
}

// Custom cell renderer for file name with hold indicator
const FileNameCellRenderer = (params: ICellRendererParams) => {
  const data = params.data as GroupedInvoice
  // console.log("FileNameCellRenderer data:", data)
  // const [isExpanded, setIsExpanded] = useState(false)
  const { expandedRows, toggleRow } = params.context! as {
    expandedRows: Set<string>,
    toggleRow:    (id: string) => void
  }

  const isExpanded = expandedRows.has(data.id)

  // const handleToggle = (e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   setIsExpanded(!isExpanded)
  // }

  const { hold } = data.statusCounts

  return (
    <div className="space-y-2">
      {/* Main file row */}
      <div className="flex items-center gap-2">
        {data.page_count > 0 && data.file_name.toLowerCase().endsWith(".pdf") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleRow(data.id)
            }}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        <FileText className="h-4 w-4 text-gray-500" />

        <span className="font-medium">{data.file_name}</span>

        {data.page_count > 0 && data.file_name.toLowerCase().endsWith(".pdf") && (
          <Badge variant="outline" className="text-xs">
            {data.page_count} pages Hold
          </Badge>
        )}

        
      </div>
      {/* ONLY show Hold at file‐level */}
      <div className="flex items-center gap-2 pl-6">
        {hold > 0 && data.file_name.toLowerCase().endsWith(".pdf") && (
          <Badge variant="destructive" className="text-xs">
            {hold} Hold
          </Badge>
        )}
        </div>

      {/* Expanded per‐page list */}
      {isExpanded && data.page_count > 0 && (
        <div className="ml-8 space-y-1 border-l-2 border-gray-200 pl-4">
          {data.pages
              .filter((page) => page.status === "hold")
              .map((page) => (
            <div
              key={page.id}
              className="flex items-center gap-2 py-1"
            >
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-600">
                Page {page.page_number}
              </span>

              {/* keep per-page status as before */}
              {StatusCellRenderer({
                value: page.status,
              } as ICellRendererParams)}

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  params.context?.onViewPage?.(page)
                }}
                className="h-6 w-6 p-0 ml-auto"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {data.pages.filter((page) => page.status === "hold").length === 0 && (
      <div className="text-sm text-gray-500 italic py-1">
        No pages on hold
      </div>
    )}
        </div>
      )}
    </div>
  )
}


// Custom cell renderer for hold status
const StatusCellRenderer = (params: ICellRendererParams) => {
  const status = params.value as 'hold' | 'duplicate' | 'approved' | null

  if (!status) {
    return <Badge variant="secondary">Pending</Badge>
  }


  const statusConfig: Record<
    'hold' | 'duplicate' | 'approved',
    { variant: Parameters<typeof Badge>[0]['variant']; className?: string; label: string }
  >  = {
    hold: { variant: "destructive" as const, label: "Hold" },
    duplicate: {
      variant: 'outline',
      className: 'border-orange-500 text-orange-500',
      label: 'Duplicate',
    },
    approved: {
      variant: 'outline',
      className: 'border-green-500 text-green-500',
      label: 'Approved',
    },
  }

  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

const MixedStatusRenderer = (params: ICellRendererParams) => {
  const { statusCounts, page_count } = params.data as GroupedInvoice;
  const { approved, hold, duplicate } = statusCounts;
  const pending = page_count - (approved + hold + duplicate);

  // build up badges in display order
  const badges: JSX.Element[] = [];
  if (pending > 0) {
    badges.push(
      <Badge key="pending" variant="secondary" className="text-xs">
        {pending} Pending
      </Badge>
    );
  }
  if (approved > 0) {
    badges.push(
      <Badge key="approved" variant="outline" className="border-green-500 text-green-500 text-xs">
        {approved} Approved
      </Badge>
    );
  }
  if (hold > 0) {
    badges.push(
      <Badge key="hold" variant="destructive" className="text-xs">
        {hold} Hold
      </Badge>
    );
  }
  if (duplicate > 0) {
    badges.push(
      <Badge
        key="duplicate"
        variant="outline"
        className="border-orange-500 text-orange-500 text-xs"
      >
        {duplicate} Duplicate
      </Badge>
    );
  }

  return <div className="flex flex-wrap gap-1">{badges}</div>;
};

// Custom cell renderer for hold actions
const ActionsCellRenderer = (params: ICellRendererParams) => {
  const data = params.data as GroupedInvoice

  const onholdPages = data.pages.filter((p) => p.status === "hold")

  // if nothing is on hold, don't render any action
  if (onholdPages.length === 0) {
    return null
  }

  // the page we’ll jump to when clicking “view”
  const firstHoldPage = onholdPages[0]

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (params.context?.onViewInvoice) {
      params.context.onViewInvoice(firstHoldPage)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={handleViewClick} className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>
      {/* <Button variant="outline" size="sm" className="text-xs bg-transparent">
        Release
      </Button>
      <Button variant="default" size="sm" className="text-xs">
        Approve
      </Button> */}
    </div>
  )
}


export function HoldTable({
  userId,
  dateRange,
  searchTerm,
  selectedClient,
  currentOrg,
  subscriptionTier,
  isTeamsManager
}: HoldTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoicePage | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { data: fields, isLoading: fieldsLoading } = useFieldHeaders(selectedClient);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const gridRef = useRef<AgGridReact>(null)
  const pageSize = 25

  const {
    data: invoices,
    isLoading,
    error,
  } = useInvoices({
    userId,
    status : "hold",
    dateRange,
    searchTerm,
    selectedClient,
    page: currentPage,
    pageSize,
    isTeamsManager
  })


  const holdOnlyInvoices = useMemo(() => {
    if (!invoices?.data) return [];
    return invoices.data.map((group) => {
      const holdPages = group.pages.filter((p) => p.status === "hold");
      return {
        ...group,
        pages:             holdPages,
        page_count:        holdPages.length,
        statusCounts: {
          hold:      holdPages.length,
          approved:  0,
          duplicate: 0,
        },
        invoice_lineitems: holdPages.flatMap((p) => p.invoice_lineitems ?? []),
      };
    });
  }, [invoices?.data]);

  const usedHeaderNames = useMemo(() => {
    const names = new Set<string>()
    for (const grp of holdOnlyInvoices) {
      // each grp.pages is already just the hold pages
      for (const page of grp.pages) {
        // if your page object has page.invoice_headers:
        for (const [key, val] of Object.entries(page.invoice_headers ?? {})) {
          if (val != null && `${val}`.trim() !== "") {
            names.add(key)
          }
        }
      }
    }
    return names
  }, [holdOnlyInvoices])

  

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    // schedule a grid redraw on the very next tick:
    requestAnimationFrame(() => {
      gridRef.current?.api.redrawRows()
    })
  }, [])
  
  

  const columnDefs: ColDef[] = useMemo(() => {
    if (!fields) {
      // no metadata yet, just show File Name + Status + Date
      return [
        // 1) File Name
        {
          headerName: "File Name",
          field:      "file_name",
          flex:       2.5,
          sortable:   true,
          filter:     true,
          cellRenderer: FileNameCellRenderer,
          autoHeight:   true,
        },
        // 4) Status
        {
          headerName: "Status",
          field:      "status",
          flex:       1,
          sortable:   true,
          filter:     true,
          cellRenderer: MixedStatusRenderer,
        },
        // 5) Hold Date
        {
          headerName: "Hold Date",
          field:      "created_at",
          flex:       1.5,
          sortable:   true,
          filter:     "agDateColumnFilter",
          valueFormatter: (p) =>
            p.value ? format(new Date(p.value), "MMM dd, yyyy HH:mm") : "",
        },
        {
          headerName: "Actions",
          field: "actions",
          width: 200,
          sortable: false,
          filter: false,
          cellRenderer: ActionsCellRenderer,
          pinned: "right",
        },
      ];
    }
  
    // 1) File Name
    const fileNameCol: ColDef = {
      headerName:   "File Name",
      field:        "file_name",
      flex:         2.5,
      sortable:     true,
      filter:       true,
      cellRenderer: FileNameCellRenderer,
      autoHeight:   true,
    };
  
    // 2) Header columns (in your metadata order, filtered to only used keys)
    const headerOrder = fields.headers.map((h) => h.name);
    const headerCols: ColDef[] = headerOrder
      .filter((name) => usedHeaderNames.has(name))
      .map((name) => ({
        headerName:  name,
        field:       `invoice_headers.${name}`,
        flex:        1,
        sortable:    true,
        filter:      true,
        valueGetter: (params) =>
          (params.data.pages as InvoiceExtraction[])
            .map((page) => page.invoice_headers?.[name] ?? "")
            .filter((v) => v.trim() !== "")
            .join(", "),
      }));
    

// Single "Line Items" column:
const lineItemCols: ColDef[] = fields.lineitem_headers.map((li) => ({
  headerName: li.name,
  field: li.name,
  flex: 1,
  sortable: true,
  filter: true,
  valueGetter: (params): (string | number)[] => {
    const lineItems = params.data.invoice_lineitems as LineItem[] | undefined;
    if (!lineItems) return [];

    return lineItems
      .map((item: LineItem) => item[li.name as keyof LineItem])
      .filter((val): val is string | number => val !== null && val !== undefined && val !== "");
  },
  cellRenderer: (params: ICellRendererParams) => {
    const values = params.value as (string | number)[];
    if (!Array.isArray(values) || values.length === 0) return null;

    return (
      <ul className="list-disc ml-4 max-h-40 overflow-auto">
        {values.map((val: string | number, idx: number) => (
          <li key={idx} className="truncate text-xs">{val}</li>
        ))}
      </ul>
    );
  },
}));
    // 3) Line‑item columns (in your metadata order)
    // const lineItemCols: ColDef[] = [{
    //   headerName: 'Line Items',
    //   field: 'invoice_lineitems',
    //   flex: 1,
    //   cellRenderer: LineItemsMiniTableRenderer,
    // }]
  
    // 4) Status
    const statusCol: ColDef = {
      headerName:   "Status",
      field:        "status",
      flex:         1,
      sortable:     true,
      filter:       true,
      cellRenderer: MixedStatusRenderer,
    };
  
    // 5) Hold Date
    const dateCol: ColDef = {
      headerName:   "Hold Date",
      field:        "created_at",
      flex:         1.5,
      sortable:     true,
      filter:       "agDateColumnFilter",
      valueFormatter: (p) =>
        p.value ? format(new Date(p.value), "MMM dd, yyyy HH:mm") : "",
    };

    const actionsCol: ColDef = {
      headerName:   "Actions",
      field:        "actions",
      width:        200,
      sortable:     false,
      filter:       false,
      cellRenderer: ActionsCellRenderer,
      pinned:       "right",
    }
  
    return [
      fileNameCol,
      ...headerCols,
      ...lineItemCols,
      statusCol,
      dateCol,
      actionsCol
    ];
  }, [fields, usedHeaderNames]);
  

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      cellStyle: {
        borderRight:  '1px solid rgba(0,0,0,0.12)',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
      }
    }),
    [],
  )


  const handleViewInvoice = useCallback((page:  InvoicePage) => {
    setSelectedInvoice(page)
  }, [])

  const handleViewPage = useCallback((page: InvoicePage) => {
    setSelectedInvoice(page)
  }, [])

  const handleCloseViewer = useCallback(() => {
    setSelectedInvoice(null)
  }, [])

  const handleNavigateInvoice = useCallback(
    (direction: "prev" | "next") => {
      if (!selectedInvoice || !invoices?.data) return

      const allPages: InvoicePage[] = []
      invoices.data.forEach((group: GroupedInvoice) => {
        allPages.push(...group.pages)
      })

      const currentIndex = allPages.findIndex((page) => page.id === selectedInvoice.id)
      if (currentIndex === -1) return

      if (direction === "prev" && currentIndex > 0) {
        setSelectedInvoice(allPages[currentIndex - 1])
      } else if (direction === "next" && currentIndex < allPages.length - 1) {
        setSelectedInvoice(allPages[currentIndex + 1])
      }
    },
    [selectedInvoice, invoices?.data],
  )

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }, [])

  const gridContext = useMemo(() => ({
  onViewPage:     handleViewPage,
  onViewInvoice:  handleViewInvoice,
  expandedRows,
  toggleRow,
}), [
  handleViewPage,
  handleViewInvoice,
  expandedRows,
  toggleRow,
])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading hold invoices: {error.message}</p>
      </div>
    )
  }

  if (!invoices?.data?.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏸️</div>
        <p className="text-gray-500">No invoices on hold</p>
        <p className="text-sm text-gray-400 mt-2">Invoices requiring attention will appear here</p>
      </div>
    )
  }

  if (selectedInvoice  &&
    (subscriptionTier === "Teams" && selectedClient))
   {
    // Find all pages for navigation
    const allPages: InvoiceExtraction[] = []
    invoices.data.forEach((group: GroupedInvoice) => {
      allPages.push(...group.pages)
    })

    const currentIndex = allPages.findIndex((page) => page.id === selectedInvoice.id)

    return (
      <InlineInvoiceViewer
        fieldId = {selectedClient}
        invoice={selectedInvoice}
        onClose={handleCloseViewer}
        onNavigate={handleNavigateInvoice}
        canNavigatePrev={currentIndex > 0}
        canNavigateNext={currentIndex < allPages.length - 1}
        currentIndex={currentIndex + 1}
        totalCount={allPages.length}
        currentOrg={currentOrg}
      />
    )
  } else if (selectedInvoice && subscriptionTier !== "Teams") {
     // Find all pages for navigation
     const allPages: InvoiceExtraction[] = []
     invoices.data.forEach((group: GroupedInvoice) => {
       allPages.push(...group.pages)
     })
 
     const currentIndex = allPages.findIndex((page) => page.id === selectedInvoice.id)
 
     return (
       <InlineInvoiceViewer
         fieldId = {userId}
         invoice={selectedInvoice}
         onClose={handleCloseViewer}
         onNavigate={handleNavigateInvoice}
         canNavigatePrev={currentIndex > 0}
         canNavigateNext={currentIndex < allPages.length - 1}
         currentIndex={currentIndex + 1}
         totalCount={allPages.length}
         currentOrg={currentOrg}
       />
     )
    }

  return (
    <div className="space-y-4">
      <div className="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
        <AgGridReact
          ref = {gridRef}
          rowData={holdOnlyInvoices}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          theme="legacy"
          context={gridContext}
          rowHeight={60}
          headerHeight={45}
          animateRows={true}
          domLayout="normal"
        />
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, invoices.total)} of{" "}
          {invoices.total} files
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * pageSize >= invoices.total}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
