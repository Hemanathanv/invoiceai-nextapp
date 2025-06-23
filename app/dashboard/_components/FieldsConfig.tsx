// components/dashboard/FieldsConfig.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, FileText, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
<<<<<<< HEAD
=======
import { set } from "date-fns";
>>>>>>> 7e5d71a (database connected using supabase)

interface FieldArray {
  name: string;
  description: string;
}

const DEFAULT_FIELDS: FieldArray[] = [
  { name: "Invoice Number", description: "Unique identifier for the invoice" },
  { name: "Date", description: "Invoice date in DD/MM/YYYY format" },
  { name: "Total Amount", description: "Sum total of the invoice" },
  { name: "Tax Number", description: "Tax identification number if available" },
];



export default function FieldsConfig() {
  const supabase = createClient();
  const [standardFields, setStandardFields] = useState<FieldArray[]>([]);
  const [customFields, setCustomFields] = useState<FieldArray[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [newField, setNewField] = useState<FieldArray>({ name: "", description: "" }); 
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditingStandard, setIsEditingStandard] = useState<boolean>(true);
  const [editField, setEditField] = useState<FieldArray>({ name: "", description: "" });
  
  // const { toast } = useToast();

  useEffect(() => {
    
    const init = async () => {
      
      const user = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }
      
<<<<<<< HEAD
      const { data: fetchedRow, error: fetchError } = await supabase
=======
      let { data: fetchedRow, error: fetchError } = await supabase
>>>>>>> 7e5d71a (database connected using supabase)
        .from("invoice_fields")
        .select("standard_fields, custom_fields")
        .eq("id", user?.data.user?.id)
        .single();


      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching fields:", fetchError);
        toast.error("Failed to load fields");
        return;
      }

      
      
      if (!fetchedRow) {
  
    const { data: inserted, error: insertError } = await supabase
            .from("invoice_fields")
            .upsert({
              standard_fields: DEFAULT_FIELDS},
              { onConflict: "id" }  
                    )
            .select("standard_fields, custom_fields")
            .single();
                    
        if (insertError) {
          console.error("Error inserting default fields:", insertError);
          toast.error("Failed to insert default fields");
          return;
        }

        setStandardFields(inserted.standard_fields ?? []);
        setCustomFields(inserted.custom_fields ?? []);  
      }else {
        setStandardFields(fetchedRow.standard_fields ?? DEFAULT_FIELDS);
        setCustomFields(fetchedRow.custom_fields ?? []);
      }

      
      }
      init();

<<<<<<< HEAD
  }, [supabase]);
=======
  }, []);
>>>>>>> 7e5d71a (database connected using supabase)


  const updateFieldsInDb = async (
    newStandard: FieldArray[],
    newCustom: FieldArray[]
  ): Promise<boolean> => {
 
    const { error } = await supabase
      .from("invoice_fields")
      .upsert(
        {
          standard_fields: newStandard,
          custom_fields: newCustom,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Failed to update arrays:", error);
      toast.error("Failed to save changes");
      return false;
    }
    return true;
  };

  // ─── Add a New Custom Field ───────────────────────────────────────────
  const handleAdd = async () => {
    if (!newField.name.trim()) {
      toast.error("Field name required", {
        description: "Please provide a name for your custom field.",
      });
      return;
    }
    const updatedCustom = [...customFields, { ...newField, name: newField.name.trim(), description: newField.description.trim() }];

    const ok = await updateFieldsInDb(standardFields, updatedCustom);
    if (ok) {
      setCustomFields(updatedCustom);
      setNewField({ name: "", description: "" });
      setOpenAdd(false);
      toast.success("Field added", {
        description: `"${updatedCustom.at(-1)?.name}" has been added.`,
      });
    }
  };

  // ─── Open Edit Dialog ─────────────────────────────────────────────────
  // idx: index in whichever array; isStd: true → standardFields, false → customFields
  const openEditDialog = (idx: number, isStd: boolean) => {
    setIsEditingStandard(isStd);
    setEditIndex(idx);
    const fieldToEdit = isStd ? standardFields[idx] : customFields[idx];
    setEditField({ name: fieldToEdit.name, description: fieldToEdit.description });
    setOpenEdit(true);
  };

  // ─── Save Edited Field ─────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (editIndex === null) return;
    if (!editField.name.trim()) {
      toast.error("Field name required", {
        description: "Please provide a name.",
      });
      return;
    }

<<<<<<< HEAD
    const updatedStandard = [...standardFields];
    const updatedCustom = [...customFields];
=======
    let updatedStandard = [...standardFields];
    let updatedCustom = [...customFields];
>>>>>>> 7e5d71a (database connected using supabase)

    if (isEditingStandard) {
      updatedStandard[editIndex] = {
        name: editField.name.trim(),
        description: editField.description.trim(),
      };
    } else {
      updatedCustom[editIndex] = {
        name: editField.name.trim(),
        description: editField.description.trim(),
      };
    }

    const ok = await updateFieldsInDb(updatedStandard, updatedCustom);
    if (ok) {
      setStandardFields(updatedStandard);
      setCustomFields(updatedCustom);
      setOpenEdit(false);
      toast.success("Field updated", {
        description: `"${editField.name}" saved.`,
      });
    }
  };

  // ─── Delete a Custom Field ─────────────────────────────────────────────
  const handleDelete = async (idx: number) => {
    const fieldToDelete = customFields[idx];
    const updatedCustom = customFields.filter((_, i) => i !== idx);

    const ok = await updateFieldsInDb(standardFields, updatedCustom);
    if (ok) {
      setCustomFields(updatedCustom);
      toast.success("Field removed", {
        description: `"${fieldToDelete.name}" has been removed.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Fields and Description
        </CardTitle>
        <CardDescription>Configure fields to extract from invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ── Standard Fields ─────────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold">Standard Fields</h3>
            <div className="space-y-4 mt-2">
              {standardFields.map((field, idx) => (
                <div
                  key={`${field.name}-${idx}`}
                  className="p-4 border rounded-md bg-background flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-medium text-sm">{field.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {field.description || "No description"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(idx, true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Custom Fields ──────────────────────────────── */}
          <div>
            <h3 className="text-lg font-semibold">Custom Fields</h3>
            <div className="space-y-4 mt-2">
              {customFields.map((field, idx) => (
                <div
                  key={`${field.name}-${idx}`}
                  className="p-4 border rounded-md bg-background flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-medium text-sm">{field.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {field.description || "No description"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(idx, false)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Custom Field Button */}
              <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Field
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Custom Field</DialogTitle>
                    <DialogDescription>
                      Create a new field to extract from your invoices.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="add-name">Field Name</Label>
                      <Input
                        id="add-name"
                        value={newField.name}
                        onChange={(e) =>
                          setNewField({ ...newField, name: e.target.value })
                        }
                        placeholder="e.g. Vendor Name"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="add-desc">Description</Label>
                      <Textarea
                        id="add-desc"
                        value={newField.description}
                        onChange={(e) =>
                          setNewField({ ...newField, description: e.target.value })
                        }
                        placeholder="What does this field represent?"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenAdd(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdd}>Add Field</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* ── Edit Field Dialog ───────────────────────────── */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
                <DialogDescription>
                  Update the field’s details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-name">Field Name</Label>
                  <Input
                    id="edit-name"
                    value={editField.name}
                    onChange={(e) =>
                      setEditField({ ...editField, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-desc">Description</Label>
                  <Textarea
                    id="edit-desc"
                    value={editField.description}
                    onChange={(e) =>
                      setEditField({ ...editField, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenEdit(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
