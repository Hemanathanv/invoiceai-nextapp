// Name: V.Hemanathan
// Describe: component to configure the fields for the invoice per client. uses the invoiceFieldsService for database operations
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"

import {
  getInvoiceFields,
  addCustomField,
  updateField,
  deleteCustomField,
  FieldArray,
  addHeaderField,
  deleteHeaderField,
} from "@/app/dashboard/_components/_services/invoiceFieldsService";
import { toast } from "sonner";

/**
 * Props: client context for invoice configuration
 */
interface FieldsConfigProps {
  client: {
    id: string;
    client_id: string;
    client_name: string;
    user_id: string;
    org_id: string;
  };
}

// default standard fields if none in DB
const DEFAULT_FIELDS: FieldArray[] = [
  { name: "Invoice Number", description: "Unique identifier for the invoice" },
  { name: "Date", description: "Invoice date in DD/MM/YYYY format" },
  { name: "Total Amount", description: "Sum total of the invoice" },
  { name: "Tax Number", description: "Tax identification number if available" },
  { name : "Vendor Name", description: "Name of the vendor or service provider"}
];

const DEFAULT_LINEITEMS: FieldArray[] = [
  { name: "Item Name", description: "Name of the item or service" },
  { name: "Quantity", description: "Quantity of the item or service" },
  { name: "Unit Price", description: "Price per unit of the item or service" },
  { name: "Total Price", description: "Total price for the item or service including taxes and discounts" },
  { name: "Tax Rate", description: "Tax rate applicable to the item or service" },
  { name: "Discount", description: "Discount applicable to the item or service" },
  { name: "GST", description: "GST applicable to the item or service"},
  { name: "SGST", description: "SGST applicable to the item or service"},
  { name: "CGST", description: "CGST applicable to the item or service"},
  { name: "IGST", description: "IGST applicable to the item or service"},
  { name: "HSN Code", description: "HSN code for the item or service"},
  { name: "SAC Code", description: "SAC code for the item or service"},
  {name : "VAT NO", description: "VAT number of the vendor or service provider"},
  {name : "VAT Rate", description: "VAT rate of the each item or service"},
];


interface FieldsConfigProps {
  client: { id: string; client_id: string; client_name: string; user_id: string; org_id: string }
  role: string  // e.g. "manager" or "user"
}

export default function ClientFieldsConfig({ client, role }: FieldsConfigProps) {
  const userId = client.client_id;
  // const orgId = client.org_id;

  const [standardFields, setStandardFields] = useState<FieldArray[]>([]);
  const [customFields, setCustomFields] = useState<FieldArray[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openHeaderAdd, setOpenHeaderAdd] = useState(false);
  const [newField, setNewField] = useState<FieldArray>({ name: "", description: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditingStandard, setIsEditingStandard] = useState(true);
  const [editField, setEditField] = useState<FieldArray>({ name: "", description: "" });
  const [defaultHeader, setDefaultHeader] = useState("")
  const [defaultLineitems, setDefaultLineitems] = useState("")



  // load fields for this client
  useEffect(() => {
    if (!userId) return;
    getInvoiceFields(userId).then((data) => {
      if (data) {
        setStandardFields(data.standard_fields);
        setCustomFields(data.custom_fields);
      } else {
        setStandardFields(DEFAULT_FIELDS);
        setCustomFields([]);
      }
    });
  }, [userId, client.id]);

  // add new custom field
  const handleAddHeaders = async () => {
    const updated = await addHeaderField(
      userId,
      { ...newField, name: newField.name.trim(), description: newField.description.trim() },
      standardFields,
      customFields
    );
    if (updated) {
      setStandardFields(updated);
      setNewField({ name: "", description: "" });
      setOpenHeaderAdd(false);
    }
  };

  const handleAddLineItems = async () => {
    const updated = await addCustomField(
      userId,
      { ...newField, name: newField.name.trim(), description: newField.description.trim() },
      standardFields,
      customFields
    );
    if (updated) {
      setCustomFields(updated);
      setNewField({ name: "", description: "" });
      setOpenAdd(false);
    }
  };

  // open edit dialog
  const openEditDialog = (idx: number, isStd: boolean) => {
    setIsEditingStandard(isStd);
    setEditIndex(idx);
    const src = isStd ? standardFields[idx] : customFields[idx];
    setEditField({ ...src });
    setOpenEdit(true);
  };

  // save edits
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

  // delete custom field
  const handleDelete = async (idx: number) => {
    const updated = await deleteCustomField(userId,  idx, standardFields, customFields);
    if (updated) setCustomFields(updated);
  };

  const handleHeaderDelete = async (idx: number) => {
    const updated = await deleteHeaderField(userId,  idx, standardFields, customFields);
    if (updated) setStandardFields(updated);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {client.client_name} - Invoice Fields
          </CardTitle>
          <CardDescription>Configure fields to extract</CardDescription>
        </CardHeader>
        <CardContent>

        <div className="flex items-center gap-2 mb-4">
  <Select onValueChange={setDefaultHeader} value={defaultHeader} disabled={role !== "manager"}>
    <SelectTrigger className="w-60">
      <SelectValue placeholder="Pick a Default Header field…" />
    </SelectTrigger>
    <SelectContent>
      {DEFAULT_FIELDS.map((f) => (
        <SelectItem key={f.name} value={f.name}>
          {f.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  <Button
    disabled={!defaultHeader && role !== "manager"}
    onClick={async () => {
      // find the full field object
      const field = DEFAULT_FIELDS.find((f) => f.name === defaultHeader)!
      // insert it (or call your invoiceFieldsService to persist)
      const updated = await addHeaderField(userId, field, standardFields, customFields)
      if (updated){
        setStandardFields(updated)
        setDefaultHeader("")  // reset dropdown
        toast.success(`Added standard field “${field.name}”`)
      }
      
    }}
  >
    + Default Headers
  </Button>
</div>

          {/* Standard Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invoice Headers</h3>
            {standardFields.map((field, idx) => (
              <div key={idx} className="p-4 border rounded-md bg-background flex justify-between">
                <div>
                  <h4 className="font-medium text-sm">{field.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{field.description || "No description"}</p>
                </div>
                {role === "manager" && (
                  <>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(idx, true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => handleHeaderDelete(idx)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                  </>
                )}
              </div>
            ))}

            {/* Add New Field */}
            <Dialog open={openHeaderAdd} onOpenChange={setOpenHeaderAdd} >
              <DialogTrigger asChild>
                <Button disabled={role !== "manager"} variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add New Field
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Invoice Header</DialogTitle>
                  <DialogDescription>Create a new field to extract</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-name">Field Name</Label>
                    <Input id="add-name" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} placeholder="Vendor Name" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-desc">Description</Label>
                    <Textarea id="add-desc" value={newField.description} onChange={(e) => setNewField({ ...newField, description: e.target.value })} placeholder="Field description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={role !== "manager"} variant="outline" onClick={() => setOpenAdd(false)}>Cancel</Button>
                  <Button onClick={handleAddHeaders}>Add Field</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2 mb-4">
  <Select onValueChange={setDefaultLineitems} value={defaultLineitems} disabled={role !== "manager"}>
    <SelectTrigger className="w-60">
      <SelectValue placeholder="Pick a Default Line Items…" />
    </SelectTrigger>
    <SelectContent>
      {DEFAULT_LINEITEMS.map((f) => (
        <SelectItem key={f.name} value={f.name}>
          {f.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  <Button
    disabled={!defaultLineitems && role !== "manager"}
    onClick={async () => {
      // find the full field object
      const field = DEFAULT_LINEITEMS.find((f) => f.name === defaultLineitems)!
      // insert it (or call your invoiceFieldsService to persist)
      const updated = await addCustomField(userId, field, standardFields, customFields)
      if (updated){
        setCustomFields(updated)
        setDefaultLineitems("")  // reset dropdown
        toast.success(`Added standard field “${field.name}”`)
      }
      
    }}
  >
    + Default LineItems
  </Button>
</div>

            {/* Custom Fields */}
            <h3 className="text-lg font-semibold mt-6">Invoice LineItems</h3>
            {customFields.map((field, idx) => (
              <div key={idx} className="p-4 border rounded-md bg-background flex justify-between">
                <div>
                  <h4 className="font-medium text-sm">{field.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{field.description || "No description"}</p>
                </div>
                <div className="flex gap-2">
                  {role === "manager" && (
                    <>
                      
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(idx, false)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(idx)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                  </>
                  )}
                </div>
              </div>
            ))}

            {/* Add New Field */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button disabled={role !== "manager"} variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add New Field
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Line Items</DialogTitle>
                  <DialogDescription>Create a new field to extract</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-name">Field Name</Label>
                    <Input id="add-name" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} placeholder="Vendor Name" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-desc">Description</Label>
                    <Textarea id="add-desc" value={newField.description} onChange={(e) => setNewField({ ...newField, description: e.target.value })} placeholder="Field description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={role !== "manager"} variant="outline" onClick={() => setOpenAdd(false)}>Cancel</Button>
                  <Button onClick={handleAddLineItems}>Add Field</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Field */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Field</DialogTitle>
                  <DialogDescription>Update field details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="edit-name">Field Name</Label>
                    <Input id="edit-name" value={editField.name} onChange={(e) => setEditField({ ...editField, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="edit-desc">Description</Label>
                    <Textarea id="edit-desc" value={editField.description} onChange={(e) => setEditField({ ...editField, description: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
                  <Button onClick={handleUpdate}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
