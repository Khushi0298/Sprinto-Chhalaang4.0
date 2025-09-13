import React, { useState } from 'react';
import { Calendar, User, Search, Download, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  query: string;
  toolsUsed: string[];
  exports: number;
  status: 'completed' | 'failed' | 'partial';
  details: {
    duration: string;
    resultsCount: number;
    sourcesAccessed: string[];
  };
}

export function AuditLogScreen() {
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const auditEntries: AuditEntry[] = [
    {
      id: '1',
      timestamp: '2025-01-12 14:30:22',
      user: 'john.doe@company.com',
      query: 'Why was PR #456 merged without approval?',
      toolsUsed: ['GitHub', 'Jira'],
      exports: 1,
      status: 'completed',
      details: {
        duration: '2.3s',
        resultsCount: 8,
        sourcesAccessed: ['GitHub PR #456', 'Repository Settings', 'Approval Policy']
      }
    },
    {
      id: '2',
      timestamp: '2025-01-12 13:45:12',
      user: 'jane.smith@company.com',
      query: 'Show all laptop assignments for Q4',
      toolsUsed: ['Documents', 'Jira'],
      exports: 2,
      status: 'completed',
      details: {
        duration: '4.1s',
        resultsCount: 24,
        sourcesAccessed: ['Asset Management DB', 'IT Tickets', 'Procurement Records']
      }
    },
    {
      id: '3',
      timestamp: '2025-01-12 12:15:33',
      user: 'mike.wilson@company.com',
      query: 'Database access approvals for production',
      toolsUsed: ['Jira', 'Documents'],
      exports: 0,
      status: 'partial',
      details: {
        duration: '1.8s',
        resultsCount: 3,
        sourcesAccessed: ['Access Request Forms', 'Jira Tickets']
      }
    },
    {
      id: '4',
      timestamp: '2025-01-12 11:20:45',
      user: 'sarah.connor@company.com',
      query: 'Code review compliance for main branch',
      toolsUsed: ['GitHub'],
      exports: 1,
      status: 'completed',
      details: {
        duration: '3.7s',
        resultsCount: 15,
        sourcesAccessed: ['GitHub Repository', 'Branch Protection Rules', 'PR History']
      }
    },
    {
      id: '5',
      timestamp: '2025-01-12 10:55:18',
      user: 'alex.garcia@company.com',
      query: 'Failed login attempts last 24 hours',
      toolsUsed: ['Documents'],
      exports: 0,
      status: 'failed',
      details: {
        duration: '0.5s',
        resultsCount: 0,
        sourcesAccessed: []
      }
    }
  ];

  const handleViewDetails = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setIsDetailSheetOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'partial':
        return <Badge className="bg-warning text-warning-foreground">Partial</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-carbon-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">Audit Log</h1>
          <p className="text-muted-foreground">
            Track all Evidence Bot queries, data access, and exports for compliance and security monitoring.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select defaultValue="7">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">User</label>
              <Input placeholder="Filter by user..." />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tool</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All tools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tools</SelectItem>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="jira">Jira</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Audit Table */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Activity Log</h3>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </div>
          
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Query</TableHead>
                  <TableHead>Tools Used</TableHead>
                  <TableHead>Exports</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                    <TableCell className="text-sm">{entry.user}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{entry.query}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {entry.toolsUsed.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{entry.exports}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(entry)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Detail Sheet */}
        <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
          <SheetContent className="w-[600px] sm:w-[600px]">
            <SheetHeader>
              <SheetTitle>Audit Entry Details</SheetTitle>
            </SheetHeader>
            
            {selectedEntry && (
              <div className="mt-6 space-y-6">
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Query Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Query:</strong> {selectedEntry.query}</div>
                    <div><strong>User:</strong> {selectedEntry.user}</div>
                    <div><strong>Timestamp:</strong> {selectedEntry.timestamp}</div>
                    <div><strong>Duration:</strong> {selectedEntry.details.duration}</div>
                    <div><strong>Status:</strong> {getStatusBadge(selectedEntry.status)}</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Results Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Results Found:</strong> {selectedEntry.details.resultsCount}</div>
                    <div><strong>Exports Generated:</strong> {selectedEntry.exports}</div>
                    <div><strong>Tools Used:</strong> {selectedEntry.toolsUsed.join(', ')}</div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Sources Accessed</h4>
                  <div className="space-y-2">
                    {selectedEntry.details.sourcesAccessed.map((source, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        {source}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}