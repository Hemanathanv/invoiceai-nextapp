"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface ExportPanelProps {
  selectedDocs: {
    file_name: string;
    invoice_headers: Record<string, unknown> | Record<string, unknown>[];
    invoice_lineitems: Record<string, unknown>[];
  }[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ selectedDocs }) => {
  const [includeFileName, setIncludeFileName] = useState<boolean>(false);

  const exportExcel = () => {
    const finalRows: Record<string, unknown>[] = [];
    selectedDocs.forEach(doc => {
      // Support invoice_headers as array or object
      const headers = Array.isArray(doc.invoice_headers) ? doc.invoice_headers[0] : doc.invoice_headers;
      if (!headers || !Array.isArray(doc.invoice_lineitems) || doc.invoice_lineitems.length === 0) return;
      doc.invoice_lineitems.forEach(lineitem => {
        finalRows.push({
          ...headers,
          ...lineitem,
          ...(includeFileName ? { file_name: doc.file_name } : {}),
        });
      });
    });
    if (finalRows.length === 0) {
      toast.info("No valid invoice data to export.");
      return;
    }
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(finalRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Invoices.xlsx");
  };

  return (
    <div className="p-4 space-y-4 border rounded-md gap-4 flex w-full justify-center bg-white shadow-md">
      <div className="flex flex-col gap-4 w-full">
        <div className="space-y-1">
          <Label>Export Selected Invoices</Label>
        </div>
        <div className="flex items-center gap-1">
          <Switch
            checked={includeFileName}
            onCheckedChange={(checked) => setIncludeFileName(!!checked)}
          />
          <Label htmlFor="fileNameCheck">Include file name?</Label>
        </div>
        <Button onClick={exportExcel} className="bg-green-500 hover:bg-green-600 text-white">
          Export
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;
