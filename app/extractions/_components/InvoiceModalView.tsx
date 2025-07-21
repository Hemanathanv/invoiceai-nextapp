// Name: V.Hemanathan
// Describe: This component is used to display the extractions of the user.It gets Real time data from supabase and displays it in a table format
// Framework: Next.js -15.3.2 

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
// import { createClient } from "@/utils/supabase/client";
import { ZoomableImage } from "./ZoomableImage";
import { ExtractionRecord } from "@/types/invoice";
import { invoice_extractions } from "../service/extraction.service";

// New field type for a single extracted data point
interface FieldEntry {
  key: string;
  value: string | number;
}

interface Props {
  userid: string;
  fileName: string;

  // Adjusted prop: array of extraction records
  invoiceExtractions: ExtractionRecord[];

  /** Called when the user clicks × to close the modal */
  onClose: () => void;
  onSaveSuccess: (newArray: ExtractionRecord[]) => void;
}

// const supabase = createClient();

const extractFileName = (path: string, userId?: string): string => {
  // 1) Split off any folders:
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



const InvoiceModalView: React.FC<Props> = ({
  userid,
  fileName,
  invoiceExtractions,
  onClose,
  onSaveSuccess,
}) => {

  const file_name = extractFileName(fileName, userid);

  // const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Ensure currentPageIndex is valid if invoiceExtractions changes
  useEffect(() => {
    if (currentPageIndex >= invoiceExtractions.length && invoiceExtractions.length > 0) {
      setCurrentPageIndex(invoiceExtractions.length - 1);
    } else if (invoiceExtractions.length === 0) {
      setCurrentPageIndex(0);
    }
  }, [invoiceExtractions, currentPageIndex]);
  
  // Extract the current record based on currentPageIndex
  const record: ExtractionRecord = invoiceExtractions[currentPageIndex] ?? {};

  // Turn object into array of { key, value }
  const initialFields: FieldEntry[] = Object.entries(record).map(
    ([key, value]) => ({ key, value: value as string | number }) // Cast value to string | number
  );

  // Editing state: which field key is being edited
  const [editKey, setEditKey] = useState<string | null>(null);

  // Local field values
  const [fields, setFields] = useState<FieldEntry[]>(initialFields);

  // Keep fields in sync if invoiceExtractions or currentPageIndex changes
  useEffect(() => {
    const currentRecord = invoiceExtractions[currentPageIndex] ?? {};
    const fresh = Object.entries(currentRecord).map(([k, v]) => ({ key: k, value: v as string | number })); // Cast value
    setFields(fresh);
    setEditKey(null);
  }, [invoiceExtractions, currentPageIndex]);

  const handleEditClick = (key: string) => {
    setEditKey(key);
  };

  const handleChange = (key: string, newValue: string) => {
    setFields(prev =>
      prev.map(f =>
        f.key === key ? { ...f, value: newValue } : f
      )
    );
  };

  const handleSave = async () => {
    // Build updated record from local fields state
    const updatedRecord: ExtractionRecord = {};
    fields.forEach(f => {
      updatedRecord[f.key] = f.value;
    });

    // Create a new extractions array with the updated record at the current position
    const updatedExtractions: ExtractionRecord[] = [...invoiceExtractions];
    if (updatedExtractions.length > currentPageIndex) {
      updatedExtractions[currentPageIndex] = updatedRecord;
    } else if (currentPageIndex === updatedExtractions.length) { // If adding a new record at the end
      updatedExtractions.push(updatedRecord);
    } else {
      // This case should ideally not happen if currentPageIndex is always valid
      // console.warn("Attempted to save to an invalid page index.");
      return;
    }

    // Supabase update
    const { error } = await invoice_extractions(
      userid,
      fileName,
      updatedExtractions
    )
    //   .from("invoice_extractions")
    //   .update({ invoice_extractions: updatedExtractions })
    //   .eq("user_id", userid)
    //   .eq("file_path", fileName)
    //   .single();

    if (error) {
      // console.error("Failed to save update:", error.message);
      return;
    }

    setEditKey(null);
    onSaveSuccess(updatedExtractions);
  };

  return (
    <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-auto relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold text-gray-700 hover:text-gray-900"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Header showing the fileName */}
        <div className="p-4 border-b text-xl font-bold text-center">{file_name}</div>

        <div className="flex flex-grow">
          {/* Left: invoice image or spinner */}
          <div className="w-1/2 p-4 flex  items-center justify-center bg-gray-50">
            {fileName ? (
              <ZoomableImage fileName={fileName}  />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-gray-500 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <p className="text-gray-500">Loading image…</p>
              </div>
            )}
          </div>

          {/* Right: dynamic editable table */}
          <div className="w-1/2 p-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Invoice Details</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">Field</th>
                  <th className="border px-2 py-1 text-left">Value</th>
                  <th className="border px-2 py-1 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map(({ key, value }) => (
                  <tr key={key}>
                    <td className="border px-2 py-1 font-medium">{key}</td>
                    <td className="border px-2 py-1">
                      {editKey === key ? (
                        <input
                          type="text"
                          value={String(value)}
                          onChange={e => handleChange(key, e.target.value)}
                          className="border p-1 w-full"
                        />
                      ) : (
                        value
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {editKey === key ? (
                        <Button size="sm" variant="outline" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(key)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoiceExtractions.length > 1 && (
              <div className="flex justify-end space-x-2 mt-4 text-sm">
                <Button
                  size="sm"
                  disabled={currentPageIndex === 0}
                  onClick={() => setCurrentPageIndex(p => Math.max(0, p - 1))}
                >
                  ← Prev
                </Button>
                <span className="self-center">
                  {currentPageIndex + 1} / {invoiceExtractions.length}
                </span>
                <Button
                  size="sm"
                  disabled={currentPageIndex + 1 >= invoiceExtractions.length}
                  onClick={() => setCurrentPageIndex(p => Math.min(invoiceExtractions.length - 1, p + 1))}
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModalView;
