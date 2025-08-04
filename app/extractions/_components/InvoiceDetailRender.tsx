import { IDetailCellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

const InvoiceDetailRenderer: React.FC<IDetailCellRendererParams> = ({ data }) => {
  // invoice_headers: Record<string, any>
  const headers = data.invoice_headers || {};
  // invoice_lineitems: any[]
  const lineItems: any[] = data.invoice_lineitems || [];

  // turn headers into rows
  const headerRows = useMemo(
    () => Object.entries(headers).map(([key, val]) => ({ key, val })),
    [headers]
  );

  // build line‐item columns on the fly from first row
  const lineItemCols = useMemo(() => {
    if (lineItems.length === 0) return [];
    return Object.keys(lineItems[0])
      .filter((k) => k !== "id" && k !== "isNewRow")
      .map((field) => ({
        headerName: field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        field,
        flex: 1,
        sortable: true,
        filter: true,
      }));
  }, [lineItems]);

  return (
    <div className="p-4 bg-white space-y-6">
      {/* --- Headers Panel --- */}
      <div>
        <h4 className="font-semibold mb-2">Invoice Headers</h4>
        <div className="grid grid-cols-2 gap-4">
          {headerRows.map(({ key, val }) => (
            <div key={key} className="flex">
              <span className="font-medium w-32">{key}:</span>
              <span>{String(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Line Items Panel --- */}
      <div>
        <h4 className="font-semibold mb-2">
          Line Items <Badge variant="outline">{lineItems.length}</Badge>
        </h4>
        {lineItems.length > 0 ? (
          <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
            <AgGridReact
              rowData={lineItems}
              columnDefs={lineItemCols}
              defaultColDef={{ flex: 1, sortable: true, filter: true, resizable: true }}
            />
          </div>
        ) : (
          <p className="text-gray-500">No line items on this invoice.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailRenderer;
