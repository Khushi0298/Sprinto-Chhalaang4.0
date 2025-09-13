import React from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface FilterRailProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function FilterRail({ isCollapsed, onToggleCollapse }: FilterRailProps) {
  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-border p-carbon-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="w-80 border-r border-border bg-card">
      <div className="p-carbon-4">
        <div className="flex items-center justify-between mb-carbon-4">
          <div className="flex items-center space-carbon-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium">Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Sources */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Sources</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="jira" defaultChecked />
                <Label htmlFor="jira" className="text-sm">Jira</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="github" defaultChecked />
                <Label htmlFor="github" className="text-sm">GitHub</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="docs" defaultChecked />
                <Label htmlFor="docs" className="text-sm">Documents</Label>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Date Range</Label>
            <Select defaultValue="30">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Repository */}
          <div>
            <Label htmlFor="repo" className="text-sm font-medium mb-3 block">Repository</Label>
            <Input 
              id="repo"
              placeholder="Filter by repository..."
              className="text-sm"
            />
          </div>

          {/* Issue Key */}
          <div>
            <Label htmlFor="issue" className="text-sm font-medium mb-3 block">Issue Key</Label>
            <Input 
              id="issue"
              placeholder="e.g., PROJ-123"
              className="text-sm"
            />
          </div>

          {/* PR Number */}
          <div>
            <Label htmlFor="pr" className="text-sm font-medium mb-3 block">PR Number</Label>
            <Input 
              id="pr"
              placeholder="e.g., 456"
              className="text-sm"
            />
          </div>

          {/* Active Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                GitHub
                <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Last 30 days
                <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}