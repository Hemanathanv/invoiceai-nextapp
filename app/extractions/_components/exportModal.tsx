"use client";

import React, {  useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fetchAvailableDate, fetchInvoiceDocsByDate } from "../service/extraction.service";
import { useProfile } from "@/context/GlobalState";
import * as XLSX from "xlsx";
import { DateRangePicker } from "@/components/ui/dateRangepicker";

type InvoiceExtraction = Record<string, null | string | number | boolean>;

type Document = {
  file_path: string;
  // created_at: string;
  invoice_extractions: InvoiceExtraction[];
};

type DateRange = {
  created_at:Date
}
// Define props
interface ExportPanelProps {
  userId: string | null; // User ID for export context
}
interface InvoiceDoc {
  // created_at: string;
  file_path: string;
  invoice_extractions: InvoiceExtraction[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ userId }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [includeFileName, setIncludeFileName] = useState<boolean>(false);
  const [invoiceList, setInvoiceList] = useState<InvoiceDoc[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [openSideView, setOpenSideView] = useState<boolean>(false);
  // const [avlStartDate, setAvlStartDate] = useState<Date | null>();
  // const [avlEndDate, setAvlEndDate] = useState<Date |null>();
  const [allowedDates, setAllowedDates] = useState<DateRange[] |null>();
 
  const  {profiles}  = useProfile();
  useEffect(() => {
    if (!profiles?.id) return;
    
    const fetchdate = async () => {
      const latest = await
      fetchAvailableDate(profiles.id);
      if (latest.data) {
        const dateRanges = Array.isArray(latest.data) ? latest.data.map((item: { created_at: Date }) => ({
          created_at: new Date(item.created_at),
        })) : [];
        setAllowedDates(dateRanges || []);
      } else {
        console.error("Failed to fetch allowed dates:", latest.error);
        setAllowedDates(null);
      }
      // setAvlStartDate(startDate? new Date(startDate) : null);
      // setAvlEndDate(endDate? new Date(endDate) : null);
      // console.log(avlStartDate, avlEndDate);
    };
    fetchdate();
  },[profiles?.id]);
  

  // ✅ Disable all dates NOT in allowedDates
  const disableIfNotIncluded = (date: Date) => {
    return !allowedDates?.some(
      (allowed) =>
        allowed.created_at.getDate() === date.getDate() &&
        allowed.created_at.getMonth() === date.getMonth() &&
        allowed.created_at.getFullYear() === date.getFullYear()
    )
  }
  const handleFetchList = async () => {
    console.log("Profile:", profiles?.id);
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    setOpenSideView(true);
    const start = new Date(`${format(startDate, "yyyy-MM-dd")}`);
    const end = new Date(`${format(endDate, "yyyy-MM-dd")}`);

    try {
      if (!userId) {
        throw new Error("User ID is required to fetch invoice documents.");
      }
      const response = await fetchInvoiceDocsByDate(userId, start, end);
      if (response.error) {
        throw new Error(`Failed to fetch documents: ${response.error.message}`);
      }
      if (response.data) {
        setInvoiceList(response.data.map((doc: InvoiceDoc) => ({
          ...doc,
          file_path: doc.file_path.replace("documents/" + (profiles?.id + "_" || ""), ""), // Normalize file paths
        })));
      }
      // setSelectedFiles(response.map((doc: InvoiceDoc) => doc.file_path));
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  const handleFileToggle = (filePath: string) => {
    setSelectedFiles((prev) =>
      prev.includes(filePath)
        ? prev.filter((f) => f !== filePath)
        : [...prev, filePath]
    );
  };
function findFile(fileName: string) {
  const foundFile = invoiceList.find((invoice) => invoice.file_path === fileName);
  return foundFile || null;
}
  const exportExcel =()=>
    {
  console.log("Selected Files:", selectedFiles);
const finalList:Document[]=[];
selectedFiles.forEach((filePath) => {
  console.log("Processing file:", filePath);
  const file = findFile(filePath);
  if (file) {
    finalList.push({
      file_path: file.file_path,
      invoice_extractions: file.invoice_extractions, // Provide a default or fetch the actual value
    });
  }
  // created_at: file?.created_at, // Provide a default or fetch the actual value
  // findFile(filePath);
});
  
  // const { includeFilePath = false, fileName = "Invoices.xlsx" } = options;

  // Create a workbook
  const workbook = XLSX.utils.book_new();
const finalRows: Record<string, unknown>[] = [];
  finalList.forEach((filePath:Document) => {
    if (!filePath?.invoice_extractions?.length) return;
  
    // Prepare rows: Each row is one entry in `invoice_extractions`, enriched with metadata
    const rows = filePath.invoice_extractions.map((entry) => ({
      ...entry,
      ...(includeFileName ? { file_path: filePath.file_path } : {}),
    }));
    // created_at: filePath.created_at,
  // console.log("Rows for file:", filePath, rows);
    // Convert to worksheet
    // const worksheet = XLSX.utils.json_to_sheet(rows);
    finalRows.push(...rows);
    // Sheet name: Use file_path or index
    // const sheetName = `Sheet${index + 1}`;
  });
    const worksheet = XLSX.utils.json_to_sheet(finalRows);

  const sheetName = `Sheet1`;
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Export the Excel file
  XLSX.writeFile(workbook, 'Invoices.xlsx');

}


  return (
    <div
      className={`p-4 space-y-4 border rounded-md gap-4 ease-in-out duration-900 transition-all ${openSideView ? "w-full" : "w-1/"} flex w-full justify-center bg-white shadow-md`}
    >
      {/* Start Date */}
      <div
        className={`felx  h-full ease-in-out duration-900 transition-all ${
          openSideView ? " gap-2.5   w-1/2" : " w-1/3 items-center justify-center"
        }`}
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="space-y-1">
            <Label>Select Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  {startDate
                    ? format(startDate, "dd MMM yyyy")
                    : "Pick a start date"}-    {endDate
                      ? format(endDate, "dd MMM yyyy")
                      : "Pick an end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
              <DateRangePicker
                mode="range"
                selected={
                  startDate
                    ? { from: startDate, to: endDate ?? undefined }
                    : undefined
                }
                onSelect={(range) => {
                  setStartDate(range?.from ?? null)
                  setEndDate(range?.to ?? null)
                }}
                disabled={disableIfNotIncluded}
                // disabled={{
                //   before: avlStartDate ?? new Date(2025, 10, 10),
                //   after: avlEndDate ?? new Date(2025, 10, 15),
                // }}
              />
               
              </PopoverContent>
            </Popover>
          
          </div>

        </div>

        {/* Fetch Button */}
        <Button
          onClick={handleFetchList}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Show documents
        </Button>
      </div>

      {/* {invoiceList.length > 0 && ( */}
        <div
          className={`flex  transition-all duration-900 ease-in-out ${
            openSideView
              ? "flex flex-col  w-full h-[250px] justify-between"
              : "flex w-0"
          }`}
          >
          {/* File List */}
          {/* {invoiceList.length > 0 && ( */}
          <>
          <div className={` ${openSideView ? "w-full  p-2 border rounded space-y-2 max-h-60 " : "w-0 overflow-hidden"} overflow-y-auto `}>
            {invoiceList.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`file-${index}`}
                  checked={selectedFiles.includes(doc.file_path)}
                  onCheckedChange={() => handleFileToggle(doc.file_path)}
                />
                <Label htmlFor={`file-${index}`} className="truncate">
                  {doc.file_path}
                </Label>
              </div>
            ))}
         

          {/* Export Button */}
         
          </div>
           
          <div className={`  ${openSideView ? "w-full  gap-4 mt-3" : "w-0 overflow-hidden"} flex justify-center `}>
            <Button onClick={exportExcel} className="">
              Export
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fileNameCheck"
                checked={includeFileName}
                onCheckedChange={(checked) => setIncludeFileName(!!checked)}
              />
              <Label htmlFor="fileNameCheck">Do you want a file name?</Label>
            </div>
          </div>
          </>
        </div>
    </div>
  );
};

export default ExportPanel;
