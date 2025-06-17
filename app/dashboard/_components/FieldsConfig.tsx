// Name: V.Hemanathan
// Describe: compenent to configure the fields for the invoice. uses the invoiceFieldsService for database operations
// Framework: Next.js -15.3.2 


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
import { useUserProfile } from "@/hooks/useUserProfile";
import { getInvoiceFields, addCustomField, updateField, deleteCustomField, FieldArray } from "./_services/invoiceFieldsService";


const DEFAULT_FIELDS: FieldArray[] = [
  { name: "Invoice Number", description: "Unique identifier for the invoice" },
  { name: "Date", description: "Invoice date in DD/MM/YYYY format" },
  { name: "Total Amount", description: "Sum total of the invoice" },
  { name: "Tax Number", description: "Tax identification number if available" },
];



export default function FieldsConfig() {
  const { profile } = useUserProfile();
  const userId = profile?.id || "";
  
  const [standardFields, setStandardFields] = useState<FieldArray[]>([]);
  const [customFields, setCustomFields] = useState<FieldArray[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [newField, setNewField] = useState<FieldArray>({ name: "", description: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditingStandard, setIsEditingStandard] = useState(true);
  const [editField, setEditField] = useState<FieldArray>({ name: "", description: "" });
  
  // const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    getInvoiceFields(userId).then(data => {
      if (data) {
        setStandardFields(data.standard_fields);
        setCustomFields(data.custom_fields);
      }
      else {
        setStandardFields(DEFAULT_FIELDS);
        setCustomFields([]);
      }
    });
  }, [userId]);

  const handleAdd = async () => {
    const updated = await addCustomField(userId, { ...newField, name: newField.name.trim(), description: newField.description.trim() }, standardFields, customFields);
    if (updated) {
      setCustomFields(updated);
      setNewField({ name: "", description: "" });
      setOpenAdd(false);
    }
  };

  const openEditDialog = (idx: number, isStd: boolean) => {
    setIsEditingStandard(isStd);
    setEditIndex(idx);
    const src = isStd ? standardFields[idx] : customFields[idx];
    setEditField({ ...src });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (editIndex === null) return;
    const updatedStd = [...standardFields];
    const updatedCust = [...customFields];

    if (isEditingStandard) {
      updatedStd[editIndex] = { ...editField };
    } else {
      updatedCust[editIndex] = { ...editField };
    }

    const ok = await updateField(userId, updatedStd, updatedCust);
    if (ok) {
      setStandardFields(updatedStd);
      setCustomFields(updatedCust);
      setOpenEdit(false);
    }
  };

  const handleDelete = async (idx: number) => {
    const updated = await deleteCustomField(userId, idx, standardFields, customFields);
    if (updated) setCustomFields(updated);
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
                        placeholder="e.g. Name of the vendor or supplier"
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
