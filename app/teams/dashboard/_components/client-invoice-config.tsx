"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from "lucide-react"

interface InvoiceField {
  id: string
  name: string
  type: "text" | "number" | "date" | "select" | "textarea"
  required: boolean
  options?: string[]
}

interface ClientInvoiceConfigProps {
  client: any
}

export function ClientInvoiceConfig({ client }: ClientInvoiceConfigProps) {
  const [fields, setFields] = useState<InvoiceField[]>([
    { id: "1", name: "Invoice Number", type: "text", required: true },
    { id: "2", name: "Amount", type: "number", required: true },
    { id: "3", name: "Due Date", type: "date", required: true },
    { id: "4", name: "Description", type: "textarea", required: false },
  ])

  const [newField, setNewField] = useState({
    name: "",
    type: "text" as const,
    required: false,
    options: [] as string[],
  })

  const addField = () => {
    if (!newField.name) return

    const field: InvoiceField = {
      id: Date.now().toString(),
      name: newField.name,
      type: newField.type,
      required: newField.required,
      options: newField.type === "select" ? newField.options : undefined,
    }

    setFields([...fields, field])
    setNewField({ name: "", type: "text", required: false, options: [] })
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const updateField = (id: string, updates: Partial<InvoiceField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Invoice Fields</CardTitle>
            <CardDescription>Configure the fields that will appear in invoices for {client.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{field.name}</span>
                    <Badge variant="outline">{field.type}</Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  {field.options && (
                    <p className="text-sm text-muted-foreground mt-1">Options: {field.options.join(", ")}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Field</CardTitle>
            <CardDescription>Add a new field to the invoice configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field Name</Label>
              <Input
                id="field-name"
                placeholder="Enter field name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-type">Field Type</Label>
              <Select value={newField.type} onValueChange={(value: any) => setNewField({ ...newField, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newField.type === "select" && (
              <div className="space-y-2">
                <Label htmlFor="field-options">Options (comma separated)</Label>
                <Textarea
                  id="field-options"
                  placeholder="Option 1, Option 2, Option 3"
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      options: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>

            <Button onClick={addField} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
