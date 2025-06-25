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
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

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
  const [invoiceListCopy, setInvoiceListCopy] = useState<InvoiceDoc[]>([]);
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
        const dateRanges = Array.isArray(latest.data)
        ? latest.data.map((item: { created_at: string }) => {
            const date = new Date(item.created_at)
            date.setUTCHours(0, 0, 0, 0) // or 23,59,59,0 for end of day
            return { created_at: date }
          })
        : []
        setAllowedDates(dateRanges );
      } else {
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
    const dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
    return !allowedDates?.some((allowed) => {
      const allowedUTC = new Date(Date.UTC(
        allowed.created_at.getFullYear(),
        allowed.created_at.getMonth(),
        allowed.created_at.getDate()
      ));
      return allowedUTC.getTime() === dateUTC.getTime();
    });
  };
// Helper function to get date range info
  function getDateRangeInfo(startDate: Date, endDate: Date) {
    // 1. Local selected date strings
    const selectedStartLocal = startDate.toLocaleDateString('en-CA'); // yyyy-mm-dd
    const selectedEndLocal = endDate.toLocaleDateString('en-CA');
  
    // 2. UTC timestamps for filtering
    const startUtcIso = new Date(Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0, 0, 0
    )).toISOString();
  
    const endUtcIso = new Date(Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23, 59, 59
    )).toISOString();
  
    return {
      selectedStartLocal,  // e.g. "2025-06-20"
      selectedEndLocal,    // e.g. "2025-06-23"
      startUtcIso,         // e.g. "2025-06-20T00:00:00.000Z"
      endUtcIso            // e.g. "2025-06-23T23:59:59.000Z"
    };
  }
  const handleFetchList = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    setSelectedFiles([]); // Reset selected files
    const result = getDateRangeInfo(startDate, endDate);
    try {
      if (!userId) {
        throw new Error("User ID is required to fetch invoice documents.");
      }
      const response = await fetchInvoiceDocsByDate(userId, result.startUtcIso, result.endUtcIso);
      if (response.error) {
        throw new Error(`Failed to fetch documents: ${response.error.message}`);
      }
      if (response.data.length> 0) {
        setOpenSideView(true);
       const list = response.data.map((doc: InvoiceDoc) => ({
         ...doc,
         file_path: doc.file_path.replace("documents/" + (profiles?.id + "_" || ""), ""), // Normalize file paths
       }))
        setInvoiceList(list);
        setInvoiceListCopy(list);
      }
      else {
        toast.info("No documents found for the selected date range.");
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
  function filterinvoiceList(searchInput: string) {
    const trimmed = searchInput.trim().toLowerCase();
    if (trimmed === "") {
      // Reset to full list
      setInvoiceList(invoiceListCopy);
      return;
    }
  
    const filtered = invoiceListCopy.filter((invoice) =>
      invoice.file_path.toLowerCase().includes(trimmed)
    );
  
    setInvoiceList(filtered);
  }

function findFile(fileName: string) {
  const foundFile = invoiceList.find((invoice) => invoice.file_path === fileName);
  return foundFile || null;
}
  const exportExcel =()=>
    {
const finalList:Document[]=[];
selectedFiles.forEach((filePath) => {
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
                            const from = range?.from ?? null
                            const to = range?.to ?? null
                          
                            setStartDate(from)
                            setEndDate(to)                            
                          }}
                          disabled={disableIfNotIncluded}
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
              ? "flex flex-col  w-full h-[250px]"
              : "flex w-0"
          }`}
          >
          {/* File List */}
          {/* {invoiceList.length > 0 && ( */}
          <>
          <div className={`  ${openSideView ? "w-full  gap-4 -mt-15 mb-3" : "w-0 overflow-hidden"} flex justify-end`}>
            <div className="flex items-center gap-1">
            <Switch
                      checked={includeFileName}
                      onCheckedChange={(checked) => setIncludeFileName(!!checked)}
                    />
              <Label htmlFor="fileNameCheck">Include file name?</Label>
            </div>
            <Button onClick={exportExcel} className="">
              Export
            </Button>
          </div>
          <div className=" flex ps-2 gap-0.5">
          <Checkbox className="flex mt-1 h-5 w-5"
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedFiles(invoiceListCopy.map((doc) => doc.file_path));
              } else {
                setSelectedFiles([]);
              }
            }}
          />
          <input
  id="searchInput"
  type="text"
  placeholder="Search"
  className={`${openSideView ? 'w-full p-2 border rounded' : 'w-0 overflow-hidden'} h-8`}
  onKeyUp={(e) => {
    filterinvoiceList((e.target as HTMLInputElement).value);
  }}
/>
</div>
          <div className={` ${openSideView ? "w-full  p-2 border rounded space-y-2 max-h-64 " : "w-0 overflow-hidden"} overflow-y-auto `}>
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
          </div>
           
          
          </>
        </div>
    </div>
  );
};

export default ExportPanel;
