import React, { useState } from 'react';
import { X, Copy, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface EvidenceItem {
  field: string;
  value: string;
  source: string;
  link: string;
}

interface EvidenceDrawerProps {
  evidence: EvidenceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ evidence, isOpen, onClose }: EvidenceDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!evidence) return null;

  const handleCopyFactBlock = () => {
    const factBlock = `Field: ${evidence.field}\nValue: ${evidence.value}\nSource: ${evidence.source}`;
    navigator.clipboard.writeText(factBlock);
  };

  const mockJsonData = {
    field: evidence.field,
    value: evidence.value,
    source: evidence.source,
    timestamp: "2025-07-01T14:32:00Z",
    metadata: {
      repository: "web-app",
      pull_request: 456,
      author: "alice",
      commit_sha: "a1b2c3d4e5f6",
      branch: "feature/auth"
    },
    audit_trail: [
      {
        action: "merged",
        timestamp: "2025-07-01T14:32:00Z",
        actor: "alice",
        reason: "admin_override"
      }
    ]
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="json">Raw JSON</TabsTrigger>
              <TabsTrigger value="preview">Source Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Key Facts</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Field:</span>
                    <span className="text-sm">{evidence.field}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Value:</span>
                    <span className="text-sm">{evidence.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Source:</span>
                    <Badge variant="secondary">{evidence.source}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Timestamp:</span>
                    <span className="text-sm">2025-07-01 14:32:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant="destructive">Non-compliant</Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">People Involved</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">A</span>
                    </div>
                    <span className="text-sm">alice (Merger)</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="json" className="mt-4">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Raw Data</h4>
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(JSON.stringify(mockJsonData, null, 2))}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(mockJsonData, null, 2)}
                </pre>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Source Preview</h4>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Preview not available for this source type
                  </p>
                  <Button variant="outline" size="sm">
                    View on GitHub
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 flex gap-3 bg-background border-t pt-4">
          <Button variant="outline" onClick={handleCopyFactBlock}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Fact Block
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add to Export
          </Button>
          <Button variant="outline" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}