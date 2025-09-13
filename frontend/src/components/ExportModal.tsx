import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [format, setFormat] = useState('csv');
  const [includeNarrative, setIncludeNarrative] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      if (format === 'pdf') {
        // Call the query-pdf endpoint for PDF format
        const response = await fetch('http://localhost:8000/query-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            includeNarrative: includeNarrative 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'evidence_data.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success toast notification
        toast.success('PDF downloaded successfully!', {
          description: 'Your evidence data has been saved as PDF.',
        });
        
        console.log('PDF download completed');
      } else {
        // Handle CSV format (existing logic)
        console.log(`Downloading evidence data as ${format.toUpperCase()} file.`);
        const fileName = `evidence_data.${format}`;
        console.log(`Download started: ${fileName}`);
        
        // Show success toast notification for CSV
        toast.success('CSV downloaded successfully!', {
          description: 'Your evidence data has been saved as CSV.',
        });
      }
      
      // Close modal after download
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error downloading file:', error);
      
      // Show error toast notification
      toast.error('Download failed', {
        description: 'There was an error downloading your file. Please try again.',
      });
    } finally {
      setIsDownloading(false);
    }
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
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="text-sm">PDF (.pdf)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleDownload} className="flex-1" disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isDownloading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}