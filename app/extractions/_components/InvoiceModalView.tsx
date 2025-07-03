"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ZoomableImage } from "./ZoomableImage";
import { ExtractionRecord } from "@/types/invoice";
import { invoice_extractions } from "../service/extraction.service";
import { AgGridReact } from "ag-grid-react";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Eye, EyeOff, Save, Plus } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

interface FieldEntry {
  key: string;
  value: string | number;
}

interface Props {
  userid: string;
  fileName: string;
  invoiceExtractions: ExtractionRecord[];
  onSaveSuccess: (newArray: ExtractionRecord[]) => void;
}

const extractFileName = (path: string, userId?: string): string => {
  const parts = path.split("/");
  let name = parts[parts.length - 1];
  if (userId) {
    const prefix = `${userId}_`;
    if (name.startsWith(prefix)) {
      name = name.slice(prefix.length);
    }
  }
  return name;
};

const InvoiceInlineView: React.FC<Props> = ({
  userid,
  fileName,
  invoiceExtractions,
  onSaveSuccess,
}) => {
  const file_name = extractFileName(fileName, userid);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [showImage, setShowImage] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [editableRows, setEditableRows] = useState<ExtractionRecord[]>([]);

  useEffect(() => {
    if (currentPageIndex >= invoiceExtractions.length && invoiceExtractions.length > 0) {
      setCurrentPageIndex(invoiceExtractions.length - 1);
    } else if (invoiceExtractions.length === 0) {
      setCurrentPageIndex(0);
    }
  }, [invoiceExtractions, currentPageIndex]);

  useEffect(() => {
    const record: ExtractionRecord = invoiceExtractions[currentPageIndex] ?? {};
    const freshFields = Object.entries(record).map(([k, v]) => ({
      key: k,
      value: v as string | number,
    }));
    setFields(freshFields);
    setEditableRows(invoiceExtractions); // Initial state
  }, [invoiceExtractions, currentPageIndex]);

  const columnDefs = useMemo(
    () =>
      fields.map(field => ({
        filter: true,
        headerName: field.key,
        field: field.key,
        editable: true,
      })),
    [fields]
  );

  const handleAddRow = () => {
    const emptyRow: ExtractionRecord = {};
    fields.forEach(field => {
      emptyRow[field.key] = "";
    });
    setEditableRows(prev => [...prev, emptyRow]);
  };

  const handleSave = async () => {
    if (!gridApi) return;

    const rowCount = gridApi.getDisplayedRowCount();
    const updatedExtractions: ExtractionRecord[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = gridApi.getDisplayedRowAtIndex(i)?.data;
      if (!row) continue;

      const isEmpty = Object.values(row).every(val => val === "" || val === null);
      if (isEmpty) continue;

      updatedExtractions.push(row);
    }

    const { error } = await invoice_extractions(userid, fileName, updatedExtractions);
    if (error) {
      console.error("Failed to save update:", error.message);
      return;
    }

    onSaveSuccess(updatedExtractions);
  };

  const toggleImage = () => {
    if (showImage && !showTable) return;
    setShowImage(!showImage);
  };

  const toggleTable = () => {
    if (showTable && !showImage) return;
    setShowTable(!showTable);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-6">
      <div className="flex w-full flex-row items-center justify-center">
      <h2 title={file_name} className="cursor-help w-full text-2xl font-bold text-center mb-6 text-blue-800 truncate max-w-full overflow-hidden whitespace-nowrap">
        {file_name}
      </h2>

        {/* Toggle buttons */}
        <div className="flex w-full justify-end gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={toggleImage}
            disabled={showImage && !showTable}
            className="flex items-center gap-2"
          >
            {showImage ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showImage ? "Hide Image" : "Show Image"}
          </Button>
          <Button
            variant="ghost"
            onClick={toggleTable}
            disabled={showTable && !showImage}
            className="flex items-center gap-2"
          >
            {showTable ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showTable ? "Hide Table" : "Show Table"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Section */}
        {showImage && (
          <div className={`${showTable ? "lg:w-1/2" : "w-full"} transition-all`}>
            <div className="w-full p-4 bg-white rounded-3xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition duration-300">
              {fileName ? (
                <ZoomableImage fileName={fileName} />
              ) : (
                <p className="text-gray-500 text-center">Loading image…</p>
              )}
            </div>
          </div>
        )}

        {/* Table Section */}
        {showTable && (
          <div className={`${showImage ? "lg:w-1/2" : "w-full"} transition-all`}>
            <div className="backdrop-blur-md bg-white/60 border border-gray-300 shadow-lg rounded-xl p-4 transition duration-300">
              <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">Invoice Details</h3>
              <div className="ag-theme-alpine rounded-lg overflow-hidden" style={{ width: "100%" }}>
                <AgGridReact
                  rowData={editableRows}
                  columnDefs={columnDefs}
                  domLayout="autoHeight"
                  onGridReady={params => setGridApi(params.api)}
                  stopEditingWhenCellsLoseFocus={true}
                  suppressClickEdit={false}
                  singleClickEdit={true}
                />
              </div>

              {/* Add Row Button */}
              <div className="flex justify-end mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddRow}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save
        </button>
      </div>
    </div>
  );
};

export default InvoiceInlineView;
