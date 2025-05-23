// app/extractions/_components/InvoiceModalView.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Image from 'next/image';
        
interface ExtractionItem {
  name: string;
  description: string;
}

interface Props {
  userid: string;
  fileName: string;

  /** A base64‐encoded PNG/JPEG string, without the `data:` prefix */
  imageBase64: string | null;


  invoiceExtractions: ExtractionItem[];

  /** Called when the user clicks × to close the modal */
  onClose: () => void;
  onSaveSuccess: (newArray: ExtractionItem[]) => void;
}

const supabase = createClient();

const InvoiceModalView: React.FC<Props> = ({
  userid,
  fileName,
  imageBase64,
  invoiceExtractions,
  onClose,
  onSaveSuccess,
}) => {
  // Which extraction “name” is currently being edited
  const [editKey, setEditKey] = useState<string | null>(null);

  // Temporary store for changed description text
  const [editedDescriptions, setEditedDescriptions] = useState<Record<string, string>>(
    {}
  );

  // Called when “Edit” is clicked on a particular extraction
  const handleEditClick = (key: string) => {
    setEditKey(key);
    setEditedDescriptions((prev) => ({
      ...prev,
      [key]: invoiceExtractions.find((e) => e.name === key)?.description || "",
    }));
  };

  // Update the text as the user types
  const handleChange = (key: string, value: string) => {
    setEditedDescriptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save the updated description for `key`
  const handleSave = async (key: string) => {
    // 1) Grab the new description string for this extraction
    const newDesc = editedDescriptions[key] ?? "";

    // 2) Build a brand‐new array by mapping over the old one:
    //    whenever item.name === key, swap in the new description;
    //    otherwise keep the old item unchanged.
    const updatedArray = invoiceExtractions.map((item) => {
      if (item.name === key) {
        return {
          ...item,
          description: newDesc,
        };
      }
      return item;
    });
    console.log("Updated array:", updatedArray)
    console.log("filename:", fileName)
    console.log("userid:", userid)
    // 3) Send the entire updatedArray back to Supabase:
    const { error } = await supabase
      .from("invoice_extractions")
      .update({ invoice_extractions: updatedArray })
      .eq("user_id", userid)
      .eq("file_name", fileName)
      .single();

    if (error) {
      console.error("Failed to save JSONB update:", error.message);
      return;
    }

    console.log(`Saved "${key}" → "${newDesc}"`);
    setEditKey(null);
    onSaveSuccess(updatedArray);
    // At this point, if the parent component is still showing invoiceExtractions
    // from its own state, you may wish to notify the parent to re‐fetch or re‐set
    // the new `invoiceExtractions` array. For example, you could call something
    // like `onSaveSuccess(updatedArray)` if you passed a callback prop.
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
        <div className="p-4 border-b text-xl font-bold text-center">{fileName}</div>

        {/* Main content: left = image, right = editable table */}
        <div className="flex flex-grow">
          {/* Left: invoice image (or loading spinner if null) */}
          <div className="w-1/2 p-4 flex items-center justify-center bg-gray-50">
            {imageBase64 ? (
          <img
                    width={100}
                        height={100}
                        src="/placeholder.svg"
                        alt="InvoiceExtract Logo"
                        className="h-full w-full object-contain"
                      />
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

          {/* Right: editable extraction table */}
          <div className="w-1/2 p-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Invoice Details</h3>
            <table className="w-full border-collapse">
              <thead>
                {/* <tr>
                  <th className="border px-2 py-1 text-left">Name</th>
                  <th className="border px-2 py-1 text-left">Description</th>
                  <th className="border px-2 py-1 text-left">Actions</th>
                </tr> */}
              </thead>
              <tbody>
                {invoiceExtractions.map((item) => {
                  const { name, description } = item;
                  return (
                    <tr key={name}>
                      <td className="border px-2 py-1">{name}</td>
                      <td className="border px-2 py-1">
                        {editKey === name ? (
                          <input
                            type="text"
                            value={editedDescriptions[name] ?? ""}
                            onChange={(e) => handleChange(name, e.target.value)}
                            className="border p-1 w-full"
                          />
                        ) : (
                          description
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        {editKey === name ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(name)}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(name)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {invoiceExtractions.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                <span className="animate-pulse text-gray-500">
                 AI is processing…
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModalView;
