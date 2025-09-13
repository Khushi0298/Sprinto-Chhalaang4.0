import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [format, setFormat] = useState('csv');
  const [includeNarrative, setIncludeNarrative] = useState(true);
  const [selectedFields, setSelectedFields] = useState({
    field: true,
    value: true,
    source: true,
    timestamp: true,
    metadata: true,
  });

  const handleExport = () => {
    // Simulate export generation
    setTimeout(() => {
      toast.success('Export generated successfully!', {
        description: `Evidence data exported as ${format.toUpperCase()} file.`,
      });
      onClose();
    }, 1000);
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Evidence</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="text-sm">CSV (.csv)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="text-sm">Excel (.xlsx)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Field Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Include Fields</Label>
            <div className="space-y-2">
              {Object.entries(selectedFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <Label htmlFor={field} className="text-sm capitalize">
                    {field.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="narrative"
                checked={includeNarrative}
                onCheckedChange={setIncludeNarrative}
              />
              <Label htmlFor="narrative" className="text-sm">
                Include narrative summary
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleExport} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Generate Export
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}