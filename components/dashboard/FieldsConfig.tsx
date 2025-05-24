// components/dashboard/FieldsConfig.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, FileText } from "lucide-react";
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

interface Field {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

const defaultFields: Field[] = [
  {
    id: "1",
    name: "Invoice Number",
    description: "Unique identifier for the invoice",
    isDefault: true,
  },
  {
    id: "2",
    name: "Date",
    description: "Invoice date in DD/MM/YYYY format",
    isDefault: true,
  },
  {
    id: "3",
    name: "Total Amount",
    description: "Sum total of the invoice",
    isDefault: true,
  },
  {
    id: "4",
    name: "Tax Number",
    description: "Tax identification number if available",
    isDefault: true,
  },
];

export default function FieldsConfig() {
  const [fields, setFields] = useState<Field[]>(defaultFields);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentField, setCurrentField] = useState<Field | null>(null);
  const [newField, setNewField] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  // const { toast } = useToast();

  const handleAdd = () => {
    if (!newField.name) {
      toast("Field name required", {
        description: "Please provide a name for your custom field.",
      });
      return;
    }
    const id = `custom-${Date.now()}`;
    setFields([
      ...fields,
      { id, name: newField.name, description: newField.description },
    ]);
    setNewField({ name: "", description: "" });
    setOpenAdd(false);
    toast("Field added", {
      description: `"${newField.name}" has been added.`,
    });
  };

  const handleEdit = (field: Field) => {
    setCurrentField(field);
    setOpenEdit(true);
  };

  const handleUpdate = () => {
    if (!currentField) return;
    setFields(fields.map((f) => (f.id === currentField.id ? { ...currentField } : f)));
    setOpenEdit(false);
    toast("Field updated", {
      description: `"${currentField.name}" saved.`,
    });
  };

  const handleDelete = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    toast("Field removed", {
      description: "The field has been removed.",
    });
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
        <div className="space-y-4">
          {fields.map((field) => (
            <div
              key={field.id}
              className="p-4 border rounded-md bg-background flex justify-between items-start"
            >
              <div>
                <h3 className="font-medium text-sm">{field.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.description || "No description"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(field)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {!field.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(field.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Add Field */}
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
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
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

          {/* Edit Field */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
                <DialogDescription>Update the field’s details below.</DialogDescription>
              </DialogHeader>
              {currentField && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="edit-name">Field Name</Label>
                    <Input
                      id="edit-name"
                      value={currentField.name}
                      onChange={(e) =>
                        setCurrentField({ ...currentField, name: e.target.value })
                      }
                      disabled={currentField.isDefault}
                    />
                    {currentField.isDefault && (
                      <p className="text-xs text-muted-foreground">
                        Default fields cannot be renamed.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="edit-desc">Description</Label>
                    <Textarea
                      id="edit-desc"
                      value={currentField.description}
                      onChange={(e) =>
                        setCurrentField({ ...currentField, description: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
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
