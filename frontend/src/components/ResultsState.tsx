import React from 'react';
import { Copy, Download, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { SourceList } from './SourceList';

interface EvidenceItem {
  field: string;
  value: string;
  source: string;
  link: string;
}

interface ResultsStateProps {
  query: string;
  answer: string;
  onEvidenceClick: (evidence: EvidenceItem) => void;
  onExport: () => void;
}

export function ResultsState({ query, answer, onEvidenceClick, onExport }: ResultsStateProps) {
  const evidenceData: EvidenceItem[] = [
    { field: 'merged_by', value: 'alice', source: 'GitHub', link: 'View' },
    { field: 'required_approvals', value: '2', source: 'GitHub', link: 'View' },
    { field: 'actual_approvals', value: '0', source: 'GitHub', link: 'View' },
    { field: 'approval_evidence', value: 'none', source: 'GitHub', link: 'View' },
    { field: 'merge_date', value: '2025-07-01T14:32:00Z', source: 'GitHub', link: 'View' },
    { field: 'admin_override', value: 'true', source: 'GitHub', link: 'View' },
    { field: 'critical_hotfix_label', value: 'present', source: 'GitHub', link: 'View' },
    { field: 'status_checks_bypassed', value: 'true', source: 'GitHub', link: 'View' },
  ];

  const handleCopySummary = () => {
    navigator.clipboard.writeText(answer);
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Query: {query || "Why was PR #456 merged without approval?"}</h3>
            <p className="text-sm text-foreground leading-relaxed">
              {answer}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline">Source: GitHub API</Badge>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleCopySummary}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Summary
            </Button>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Evidence Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">EVIDENCE DETAILS</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onEvidenceClick(item)}
                  >
                    <TableCell className="font-medium">{item.field}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {item.link}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Source List */}
      <SourceList />
    </div>
  );
}