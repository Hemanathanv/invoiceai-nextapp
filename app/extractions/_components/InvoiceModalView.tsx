"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ZoomableImage } from "./ZoomableImage";
import { ExtractionRecord } from "@/types/invoice";
import { AgGridReact } from "ag-grid-react";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Eye, EyeOff, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getInvoiceFields } from "@/app/dashboard/_components/_services/invoiceFieldsService";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { ICellRendererParams } from 'ag-grid-community';
import type { GridApi } from 'ag-grid-community';

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
  fileName: string;
  file_path: string;
  file_paths: string[];
  invoiceExtractions: ExtractionRecord[];
  invoice_headers: Record<string, string>;
  onSaveSuccess: (newArray: ExtractionRecord[]) => void;
}

const InvoiceInlineView: React.FC<Props> = ({
  fileName,
  file_path,
  file_paths,
  invoiceExtractions,
  invoice_headers,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  const [showImage, setShowImage] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [editableRows, setEditableRows] = useState<ExtractionRecord[]>([]);
  const [headerRecord, setHeaderRecord] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [standardFields, setStandardFields] = useState<FieldArray[]>([]);
  const [undoStack, setUndoStack] = useState<{ row: ExtractionRecord, index: number }[]>([]);
  const [redoStack, setRedoStack] = useState<{ row: ExtractionRecord, index: number }[]>([]);
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

  const initialLoad = useRef(true);
  const prevFilePath = useRef(file_path);
  // Assign stable unique IDs to rows only once per data load
  useEffect(() => {
    const record: ExtractionRecord = invoiceExtractions[currentPageIndex] ?? {};
    const freshFields = Object.entries(record).map(([k, v]) => ({
      key: k,
      value: v as string | number,
    }));
    setFields(freshFields);

    // Only update editableRows on initial load or when file_path changes
    if (initialLoad.current || prevFilePath.current !== file_path) {
      setEditableRows(
        invoiceExtractions.map((row, idx) => ({
          ...row,
          id: row.id ? String(row.id) : `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 8)}`
        }))
      );
      initialLoad.current = false;
      prevFilePath.current = file_path;
    }

    setHeaderRecord(invoice_headers ?? {});
  }, [invoiceExtractions, invoice_headers, file_path, currentPageIndex]);

  // Remove by id, not index, and store removed row and index for undo
  const handleRemoveRow = (rowId: string) => {
    setEditableRows((prev) => {
      const index = prev.findIndex((row) => row.id === rowId);
      if (index === -1) return prev;
      const row = prev[index];
      setUndoStack((stack) => [...stack, { row, index }]);
      setRedoStack([]);
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((stack) => stack.slice(0, -1));
    setRedoStack((stack) => [...stack, last]);
    setEditableRows((prev) => {
      const newRows = [...prev];
      newRows.splice(last.index, 0, last.row);
      return newRows;
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack((stack) => stack.slice(0, -1));
    setUndoStack((stack) => [...stack, last]);
    setEditableRows((prev) => prev.filter((row) => row.id !== last.row.id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, editableRows]);

  // Minimal RemoveButtonRenderer for test
  const RemoveButtonRenderer = (props: ICellRendererParams & { context: { handleRemoveRow: (id: string) => void } }) => {
    return (
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => props.context.handleRemoveRow(props.data.id)}
        title="Remove row"
        aria-label="Remove row"
      >
        <Trash2 style={{ width: 20, height: 20, color: 'red' }} />
      </button>
    );
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: '',
        field: 'remove',
        cellRenderer: 'removeButtonRenderer',
        editable: false,
        filter: false,
        width: 48,
        pinned: 'left' as const,
      },
      ...fields.map(field => ({
        filter: true,
        headerName: field.key,
        field: field.key,
        editable: true,
      })),
    ],
    [fields]
  );

  const handleAddRow = () => {
    if (gridApiRef.current) {
      gridApiRef.current.stopEditing();
    }
    const emptyRow: ExtractionRecord = {};
    fields.forEach(field => {
      emptyRow[field.key] = "";
    });
    // Assign a unique id to the new row
    emptyRow.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setEditableRows(prev => {
      const newRows = [...prev, emptyRow];
      setTimeout(() => {
        if (gridApiRef.current && fields.length > 0) {
          const rowIndex = newRows.length - 1;
          const colKey = fields[0].key;
          gridApiRef.current.ensureIndexVisible(rowIndex, 'middle');
          gridApiRef.current.setFocusedCell(rowIndex, colKey);
          gridApiRef.current.startEditingCell({
            rowIndex,
            colKey,
          });
        }
      }, 0);
      return newRows;
    });
  };

  const toggleImage = () => {
    if (showImage && !showTable) return;
    setShowImage(!showImage);
  };

  const toggleTable = () => {
    if (showTable && !showImage) return;
    setShowTable(!showTable);
  };

  // Add keyboard navigation for image switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (file_paths.length <= 1) return;
      const active = document.activeElement;
      // Prevent image navigation if focus is inside ag-Grid or any input/textarea
      if (
        active &&
        (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          (active.closest && active.closest('.ag-root'))
        )
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        setSelectedFile((prev) => {
          const idx = file_paths.indexOf(prev);
          return file_paths[Math.max(idx - 1, 0)];
        });
      } else if (e.key === 'ArrowRight') {
        setSelectedFile((prev) => {
          const idx = file_paths.indexOf(prev);
          return file_paths[Math.min(idx + 1, file_paths.length - 1)];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file_paths]);

  const gridApiRef = useRef<GridApi | null>(null);

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

      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {showImage && (
          <div className={`${showTable ? "lg:w-1/2" : "w-full"} transition-all h-full`}>
            <div className="relative w-full h-full p-4 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center h-full">
              {fileName ? (
                <>
                  {/* Overlayed arrow buttons */}
                  {file_paths.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-10">
                      <button
                        className={`
                          flex items-center justify-center
                          w-11 h-11
                          rounded-full
                          bg-white/80
                          shadow-xl border border-gray-200
                          backdrop-blur
                          transition-all duration-200
                          pointer-events-auto
                          ${currentIndex === 0
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:scale-110 hover:shadow-2xl'}
                        `}
                        onClick={() => setSelectedFile(file_paths[Math.max(currentIndex - 1, 0)])}
                        disabled={currentIndex === 0}
                        aria-label="Previous image"
                        style={{ pointerEvents: currentIndex === 0 ? 'none' : 'auto' }}
                      >
                        <ArrowLeft className={`w-7 h-7 ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                      <button
                        className={`
                          flex items-center justify-center
                          w-11 h-11
                          rounded-full
                          bg-white/80
                          shadow-xl border border-gray-200
                          backdrop-blur
                          transition-all duration-200
                          pointer-events-auto
                          ${currentIndex === file_paths.length - 1
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:scale-110 hover:shadow-2xl'}
                        `}
                        onClick={() => setSelectedFile(file_paths[Math.min(currentIndex + 1, file_paths.length - 1)])}
                        disabled={currentIndex === file_paths.length - 1}
                        aria-label="Next image"
                        style={{ pointerEvents: currentIndex === file_paths.length - 1 ? 'none' : 'auto' }}
                      >
                        <ArrowRight className={`w-7 h-7 ${currentIndex === file_paths.length - 1 ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                    </div>
                  )}
                  <div className="flex-1 flex items-center justify-center h-full">
                    <ZoomableImage fileName={selectedFile} />
                  </div>
                  {/* Optionally, show image index at the bottom center */}
                  {file_paths.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/70 rounded px-2 py-1 text-xs text-gray-600">
                      {currentIndex + 1} of {file_paths.length}
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
          <div className={`${showImage ? "lg:w-1/2" : "w-full"} transition-all h-full`}>
            <div className="backdrop-blur-md bg-white/60 border border-gray-300 shadow-lg rounded-xl p-4 transition duration-300 flex flex-col h-full">
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


                <div className="flex-1 flex flex-col h-full">
                  <div className="ag-theme-alpine rounded-lg flex-1 h-full" style={{ width: "100%" }}>
                    <AgGridReact
                      rowData={editableRows}
                      columnDefs={columnDefs}
                      getRowId={params => String(params.data.id)}
                      context={{ handleRemoveRow }}
                      components={{ removeButtonRenderer: RemoveButtonRenderer }}
                      stopEditingWhenCellsLoseFocus={true}
                      suppressClickEdit={false}
                      singleClickEdit={true}
                      domLayout="normal"
                      onGridReady={params => { gridApiRef.current = params.api; }}
                    />
                  </div>
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
