
import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Upload, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const UploadBox: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [extractionFields, setExtractionFields] = useState({
    invoiceNumber: true,
    date: true,
    totalAmount: true,
    taxNumber: true,
    customFields: [] as { name: string, description: string }[]
  });
  const [newField, setNewField] = useState({ name: '', description: '' });
  
  const { toast } = useToast();
  const { usage } = useAuth();
  
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length + files.length > usage.uploadsLimit - usage.uploadsUsed) {
      toast({
        title: "Upload limit exceeded",
        description: `You can only upload ${usage.uploadsLimit - usage.uploadsUsed} more documents with your current plan.`,
        variant: "destructive"
      });
      return;
    }
    
    const validFiles = selectedFiles.filter(file => {
      const isValid = file.type === 'application/pdf' || file.type.startsWith('image/');
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF or image file.`,
          variant: "destructive"
        });
      }
      return isValid;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomField = () => {
    if (!newField.name) return;
    
    setExtractionFields(prev => ({
      ...prev,
      customFields: [...prev.customFields, { ...newField }]
    }));
    setNewField({ name: '', description: '' });
  };
  
  const handleRemoveCustomField = (index: number) => {
    setExtractionFields(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };
  
  const handleProcessFiles = () => {
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      toast({
        title: "Processing complete",
        description: `Successfully processed ${files.length} files.`,
      });
      setFiles([]);
      setIsUploading(false);
      setOpenDialog(false);
    }, 2000);
  };

  return (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload PDFs or images of invoices to extract data
        </CardDescription>
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
              Supports PDF, JPG, PNG (Max {usage.uploadsLimit - usage.uploadsUsed} files remaining)
            </p>
          </div>
          
          <div className="w-full max-w-sm">
            <Input
              type="file"
              accept="application/pdf,image/*"
              multiple
              onChange={handleFilesChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="w-full cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                Select Files
              </Button>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="w-full max-w-sm mt-4 space-y-4">
              <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center text-sm bg-secondary/50 rounded-md p-2">
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-primary" disabled={files.length === 0 || isUploading}>
                    {isUploading ? 'Processing...' : 'Extract Data'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configure Extraction</DialogTitle>
                    <DialogDescription>
                      Select the fields you want to extract from your documents.
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
                            onChange={() => setExtractionFields(prev => ({ ...prev, invoiceNumber: !prev.invoiceNumber }))}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="invoice-number">Invoice Number</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="date"
                            checked={extractionFields.date}
                            onChange={() => setExtractionFields(prev => ({ ...prev, date: !prev.date }))}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="date">Date</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="total-amount"
                            checked={extractionFields.totalAmount}
                            onChange={() => setExtractionFields(prev => ({ ...prev, totalAmount: !prev.totalAmount }))}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="total-amount">Total Amount</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="tax-number"
                            checked={extractionFields.taxNumber}
                            onChange={() => setExtractionFields(prev => ({ ...prev, taxNumber: !prev.taxNumber }))}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="tax-number">Tax Number</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Custom Fields</h3>
                      {extractionFields.customFields.map((field, index) => (
                        <div key={index} className="flex justify-between items-center bg-secondary/50 rounded-md p-2">
                          <div>
                            <p className="text-sm font-medium">{field.name}</p>
                            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveCustomField(index)}
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
                            onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Vendor Name"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <Label htmlFor="field-description">Description (Optional)</Label>
                          <Input 
                            id="field-description"
                            value={newField.description}
                            onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="e.g. Name of the vendor or supplier"
                          />
                        </div>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={handleAddCustomField}
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
                    <Button className="bg-gradient-primary" onClick={handleProcessFiles} disabled={isUploading}>
                      {isUploading ? 'Processing...' : 'Process Files'}
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
};

export default UploadBox;
