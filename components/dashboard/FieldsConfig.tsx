
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Field {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

const defaultFields: Field[] = [
  { id: '1', name: 'Invoice Number', description: 'Unique identifier for the invoice', isDefault: true },
  { id: '2', name: 'Date', description: 'Invoice date in DD/MM/YYYY format', isDefault: true },
  { id: '3', name: 'Total Amount', description: 'Sum total of the invoice', isDefault: true },
  { id: '4', name: 'Tax Number', description: 'Tax identification number if available', isDefault: true },
];

const FieldsConfig: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(defaultFields);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentField, setCurrentField] = useState<Field | null>(null);
  const [newField, setNewField] = useState<{ name: string; description: string }>({
    name: '',
    description: ''
  });
  
  const { toast } = useToast();
  
  const handleAddField = () => {
    if (!newField.name) {
      toast({
        title: "Field name required",
        description: "Please provide a name for your custom field.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = `custom-${Date.now()}`;
    setFields([...fields, { id: newId, name: newField.name, description: newField.description }]);
    setNewField({ name: '', description: '' });
    setOpenAddDialog(false);
    
    toast({
      title: "Field added",
      description: `"${newField.name}" has been added to your fields.`
    });
  };
  
  const handleEditField = (field: Field) => {
    setCurrentField(field);
    setOpenEditDialog(true);
  };
  
  const handleUpdateField = () => {
    if (!currentField) return;
    
    setFields(fields.map(f => 
      f.id === currentField.id 
        ? { ...currentField } 
        : f
    ));
    setOpenEditDialog(false);
    
    toast({
      title: "Field updated",
      description: `"${currentField.name}" has been updated.`
    });
  };
  
  const handleDeleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    
    toast({
      title: "Field removed",
      description: "The field has been removed from your configuration."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Fields and Description
        </CardTitle>
        <CardDescription>
          Configure the fields you want to extract from invoices
        </CardDescription>
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
                  {field.description || 'No description provided'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditField(field)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                {!field.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteField(field.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
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
                  <Label htmlFor="new-field-name">Field Name</Label>
                  <Input 
                    id="new-field-name"
                    value={newField.name}
                    onChange={(e) => setNewField({...newField, name: e.target.value})}
                    placeholder="e.g. Vendor Name"
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="new-field-description">Description</Label>
                  <Textarea 
                    id="new-field-description"
                    value={newField.description}
                    onChange={(e) => setNewField({...newField, description: e.target.value})}
                    placeholder="Explain what this field is and what format it should be in"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddField}>
                  Add Field
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
                <DialogDescription>
                  Update this field's information.
                </DialogDescription>
              </DialogHeader>
              
              {currentField && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="edit-field-name">Field Name</Label>
                    <Input 
                      id="edit-field-name"
                      value={currentField.name}
                      onChange={(e) => setCurrentField({...currentField, name: e.target.value})}
                      disabled={currentField.isDefault}
                    />
                    {currentField.isDefault && (
                      <p className="text-xs text-muted-foreground">Default fields cannot be renamed.</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="edit-field-description">Description</Label>
                    <Textarea 
                      id="edit-field-description"
                      value={currentField.description}
                      onChange={(e) => setCurrentField({...currentField, description: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateField}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldsConfig;
