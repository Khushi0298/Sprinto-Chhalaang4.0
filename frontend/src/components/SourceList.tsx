import React from 'react';
import { Github, FileText, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function SourceList() {
  const sources = [
    {
      id: 1,
      type: 'github',
      name: 'Pull Request #456',
      description: 'Feature: Add user authentication',
      icon: Github,
    },
    {
      id: 2,
      type: 'github',
      name: 'Repository: web-app',
      description: 'Main application repository',
      icon: Github,
    },
    {
      id: 3,
      type: 'document',
      name: 'Approval Policy.pdf',
      description: 'Code review requirements',
      icon: FileText,
    },
    {
      id: 4,
      type: 'github',
      name: 'Branch Protection Rules',
      description: 'Repository settings',
      icon: Github,
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-medium mb-4">Source Documents</h3>
      <div className="space-y-3">
        {sources.map((source) => {
          const IconComponent = source.icon;
          return (
            <div key={source.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded bg-muted">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{source.name}</p>
                <p className="text-xs text-muted-foreground truncate">{source.description}</p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}