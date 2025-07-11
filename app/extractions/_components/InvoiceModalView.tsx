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
import { getInvoiceFields } from "@/app/dashboard/_components/_services/invoiceFieldsService";
import { useUserProfile } from "@/hooks/useUserProfile";

ModuleRegistry.registerModules([AllCommunityModule]);
export interface FieldArray {
  name: string;
  description: string;
}

interface FieldEntry {
  key: string;
  value: string | number;
}

interface Props {
  userid: string;
  fileName: string;
  file_path: string;
  file_paths: string[];
  invoiceExtractions: ExtractionRecord[];
  invoice_headers: Record<string, string>;
  onSaveSuccess: (newArray: ExtractionRecord[]) => void;
}

const InvoiceInlineView: React.FC<Props> = ({
  userid,
  fileName,
  file_path,
  file_paths,
  invoiceExtractions,
  invoice_headers,
  onSaveSuccess,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  const [gridApi, setGridApi] = useState<any>(null);
  const [showImage, setShowImage] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [editableRows, setEditableRows] = useState<ExtractionRecord[]>([]);
  const [headerRecord, setHeaderRecord] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [standardFields, setStandardFields] = useState<FieldArray[]>([]);
  const { profile } = useUserProfile();
  const userId = profile?.id || "";
  useEffect(() => {
    if (!userId) return;
    getInvoiceFields(userId).then((data) => {
      if (data) {
        setStandardFields(data.standard_fields);
      } 
    });
  }, [userId]);
  // ✅ FIX: Set selectedFile from prop ONCE
  useEffect(() => {
    setSelectedFile(file_paths.length> 1 ? file_paths[0] : file_path);
  }, [file_path]);

  const currentIndex = file_paths.indexOf(selectedFile);

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
    setEditableRows(invoiceExtractions);
    setHeaderRecord(invoice_headers ?? {});
  }, [invoiceExtractions, invoice_headers, currentPageIndex]);

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
      <div className="flex flex-row items-center justify-center">
        <h2
          title={fileName}
          className="cursor-help w-full text-2xl font-bold text-center mb-6 text-blue-800 truncate max-w-full overflow-hidden whitespace-nowrap"
        >
          {fileName}
        </h2>

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
        {showImage && (
          <div className={`${showTable ? "lg:w-1/2" : "w-full"} transition-all`}>
            <div className="w-full p-4 bg-white rounded-3xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition duration-300">
              {fileName ? (
                <>
                  <ZoomableImage fileName={selectedFile} />

                  {file_paths.length > 1 && (
  <div className="flex justify-between items-center mt-4 px-2">
    <Button
      onClick={() =>
        setSelectedFile(file_paths[Math.max(currentIndex - 1, 0)])
      }
      disabled={currentIndex === 0}
    >
      ← Prev
    </Button>

    <span className="text-sm text-gray-600 self-center">
      {currentIndex + 1} of {file_paths.length}
    </span>

    <Button
      onClick={() =>
        setSelectedFile(file_paths[Math.min(currentIndex + 1, file_paths.length - 1)])
      }
      disabled={currentIndex === file_paths.length - 1}
    >
      Next →
    </Button>
  </div>
)}
                </>
              ) : (
                <p className="text-gray-500 text-center">Loading image…</p>
              )}
            </div>
          </div>
        )}

        {showTable && (
          <div className={`${showImage ? "lg:w-1/2" : "w-full"} transition-all`}>
            <div className="backdrop-blur-md bg-white/60 border border-gray-300 shadow-lg rounded-xl p-4 transition duration-300">
              <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">Invoice Details</h3>

              {headerRecord && Object.entries(headerRecord).length > 0 && (
  <div className="grid grid-cols-2 gap-4 mb-6">
    {standardFields
      .filter((field) => field.name in headerRecord)
      .map((field) => {
        const value = headerRecord[field.name] ?? "";
        return (
          <div key={field.name} className="flex flex-col">
            <label className="font-semibold text-gray-600">{field.name}</label>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                setHeaderRecord((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder={field.name}
            />
          </div>
        );
      })}
  </div>
)}


                <div
                  className="ag-theme-alpine rounded-lg"
                  style={{ width: "100%", height: "450px" }} // fixed height here
                >
                  <AgGridReact
                    rowData={editableRows}
                    columnDefs={columnDefs}
                    onGridReady={(params) => setGridApi(params.api)}
                    stopEditingWhenCellsLoseFocus={true}
                    suppressClickEdit={false}
                    singleClickEdit={true}
                    domLayout="normal" // or remove this line
                  />
                </div>

              <div className="flex justify-end mt-3">
                <Button size="sm" variant="outline" onClick={handleAddRow} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Row
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        {/* Save button can be added back if needed */}
      </div>
    </div>
  );
};

export default InvoiceInlineView;
