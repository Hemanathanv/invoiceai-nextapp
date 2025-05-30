// components/dashboard/UploadBox.tsx
"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Upload, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getTotal } from "@/utils/supabase/storage";
import { createClient } from "@/utils/supabase/client";
import { fetchUserUsage } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";


interface FieldConfig {
  invoiceNumber: boolean;
  date: boolean;
  totalAmount: boolean;
  taxNumber: boolean;
  customFields: { name: string; description: string }[];
}

const supabase = createClient()





export default function UploadBox() {
  const { profile, loading } = useUserProfile();
  
  // const { toast } = useToast();
  const MAX_SELECTION = 500; 
  const MAX_STORAGE_SIZE = 1073741824;
  let remaining_space = 0;

  // Always call hooks at top level
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [extractionFields, setExtractionFields] = useState<FieldConfig>({
    invoiceNumber: true,
    date: true,
    totalAmount: true,
    taxNumber: true,
    customFields: [],
  });
  const [newField, setNewField] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [total, setTotal] = useState<number | null>(null);
  const [totalsize_error, setError] = useState<string | null>(null);
  const [usageData, setUsage] = useState<{uploads_used: number; extractions_used: number } | null>(null);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const totalSize = await getTotal();
        setTotal(totalSize);
      } catch (err) {
        setError('Failed to fetch total size');
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      if (profile) {
        const { data: usageData, error } = await fetchUserUsage(profile.id);

        if (error) {
          setError(error.message)
          return null;
        }
        if (usageData) {
          setUsage(usageData);
        }

      }
    };
    fetchUsage();
  }, [profile]);

  
  // While profile is loading or missing, render nothing
  if (loading || !profile) {
    return null;
  }



  if (total !== null) {
    remaining_space = MAX_STORAGE_SIZE - total;
    console.log(`Remaining storage: ${remaining_space} bytes`);
  }else if (totalsize_error !== null) {
    toast("Error fetching total size", {
      description: String(totalsize_error),
    });
  }
  


  // Derive upload limit from subscription_tier
  let uploadsLimit: number;
  switch (profile.subscription_tier.toLowerCase()) {
    case "free":
      uploadsLimit = profile.uploads_limit;
      break;
    case "pro":
      uploadsLimit = profile.uploads_limit;
      break;
    default:
      uploadsLimit = profile.uploads_limit; // enterprise or authorised
      break;
  }

  const uploadsUsed = usageData?.uploads_used || 0;
  const extractionsUsed = usageData?.extractions_used || 0;

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selected = Array.from(e.target.files);

    if (selected.length > MAX_SELECTION) {
      toast("Selection limit exceeded", {
        description: `You can only select up to ${MAX_SELECTION} files at once.`,
      });
      return;
    }

    if (selected.length + files.length > uploadsLimit - uploadsUsed) {
      toast("Upload limit exceeded", {
        description: `You can only upload ${uploadsLimit - uploadsUsed} more files.`,

      });
      return;
    }

    if (remaining_space < 104857600) {
      toast("Too many requests to server",{
        description: `Please wait for sometime.`,
      });
      return;
    }


    const valid = selected.filter((file) => {
      const ok = file.type === "application/pdf" || file.type === "image/jpeg" ||
      file.type === "image/png";
      if (!ok) {
        toast("Invalid file type", {
          description: `You can only upload pdf or image files.`,
        });

      }
      return ok;
    });

    setFiles((prev) => [...prev, ...valid]);
  };

  const handleRemoveFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddCustom = () => {
    if (!newField.name) {

      toast("Field name required", {
        description: "Provide a name for your custom field.",
      });
      return;
    }
    setExtractionFields((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { ...newField }],
    }));
    setNewField({ name: "", description: "" });
  };

  const handleRemoveCustom = (idx: number) => {
    setExtractionFields((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== idx),
    }));
  };

  const handleProcess = async () => {
    
    if (files.length === 0) {
      toast.error("No files selected");
      return;
    }

    setIsUploading(true);

    for (const file of files) {
      
      const path = `${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('documents').upload(path, file);

      if (uploadError) {
        toast.error("Error uploading file", { description: uploadError.message });
        setIsUploading(false);
        return;
      }

      console.log(profile.id)

      const { data: fields, error: fieldError } = await supabase
        .from("invoice_fields")
        .select("standard_fields, custom_fields")
        .eq("id", profile.id)
        .single();

      if (fieldError) {
        toast.error("Error fetching fields", { description: fieldError.message });
        setIsUploading(false);
        return;
        }

        const { data: insertData, error: insertError } = await supabase
        .from("invoice_documents")
        .insert([
          {
            id: profile.id,
            file_path: uploadData.fullPath,
            standard_fields: fields.standard_fields,
            custom_fields: fields.custom_fields
          }
          ])

          if (insertError) {
        toast.error("Error inserting document", { description: insertError.message });
        setIsUploading(false);
        return;
      }

    
    }
    setTimeout( async () => {

      toast("Processing complete", {
        description: `Processed ${files.length} file(s).`,
      });
      setFiles([]);
      setIsUploading(false);
      setOpenDialog(false);
      try {
        const newTotal = await getTotal();
        const { data: usageData, error } = await fetchUserUsage(profile.id);
        if (usageData){
        setUsage(usageData)
        }else{setError(error?.message || "")}
        setTotal(newTotal);
      } catch {
        setError("Failed to refresh total usage");
      }
    }, 2000);
  };

  return (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>Upload PDFs or images of invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, JPG, PNG (Max {uploadsLimit - uploadsUsed} files)
            </p>
          </div>

          <div className="flex w-full max-w-3xl space-x-4 items-center">
            <div className="flex-1 flex">
                <Input
                    type="file"
                    accept="application/pdf,image/*"
                     multiple
                    onChange={handleFilesChange}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                Select Files
                    </Button>
                    
                </label>
                
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">or</h2>
              
            </div>

            <div className="flex-1 flex">
                  <Input
                    type="file"
                    accept="application/pdf,image/*" 
                    multiple
                    onChange={handleFilesChange}
                    className="hidden"
                    id="upload-folder"
                    {...{ webkitdirectory: "" }} 
                  />
                  <label htmlFor="upload-folder" className="w-full">
                    <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => document.getElementById("upload-folder")?.click()}
                      >
                  Select Folder
                    </Button>
                  </label>
                </div>
            </div>


          {files.length > 0 && (
            <div className="w-full max-w-sm mt-4 space-y-4">
              <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-secondary/50 rounded-md p-2"
                  >
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>

              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                    disabled={files.length === 0 || isUploading}
                  >
                    {isUploading ? "Processing..." : "Extract Data"}
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configure Extraction</DialogTitle>
                    <DialogDescription>
                      Choose fields to extract from your documents.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Standard Fields</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="invoice-number"
                            checked={extractionFields.invoiceNumber}
                            onChange={() =>
                              setExtractionFields((prev) => ({
                                ...prev,
                                invoiceNumber: !prev.invoiceNumber,
                              }))
                            }
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="invoice-number">Invoice Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="date"
                            checked={extractionFields.date}
                            onChange={() =>
                              setExtractionFields((prev) => ({ ...prev, date: !prev.date }))
                            }
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="date">Date</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="total-amount"
                            checked={extractionFields.totalAmount}
                            onChange={() =>
                              setExtractionFields((prev) => ({
                                ...prev,
                                totalAmount: !prev.totalAmount,
                              }))
                            }
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="total-amount">Total Amount</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tax-number"
                            checked={extractionFields.taxNumber}
                            onChange={() =>
                              setExtractionFields((prev) => ({
                                ...prev,
                                taxNumber: !prev.taxNumber,
                              }))
                            }
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="tax-number">Tax Number</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Custom Fields</h3>
                      {extractionFields.customFields.map((field, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-secondary/50 rounded-md p-2"
                        >
                          <div>
                            <p className="text-sm font-medium">{field.name}</p>
                            {field.description && (
                              <p className="text-xs text-muted-foreground">
                                {field.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCustom(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}

                      <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          <Label htmlFor="field-name">Field Name</Label>
                          <Input
                            id="field-name"
                            value={newField.name}
                            onChange={(e) =>
                              setNewField((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="e.g. Vendor Name"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <Label htmlFor="field-description">Description (Optional)</Label>
                          <Input
                            id="field-description"
                            value={newField.description}
                            onChange={(e) =>
                              setNewField((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="e.g. Name of the vendor"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddCustom}
                          disabled={!newField.name}
                          className="w-full"
                        >
                          Add Custom Field
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-500 text-white"
                      onClick={handleProcess}
                      disabled={isUploading}
                    >
                      {isUploading ? "Processing..." : "Process Files"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
