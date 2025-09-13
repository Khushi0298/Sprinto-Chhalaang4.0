import React, { useState } from 'react';
import { Github, FileText, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isConnected: boolean;
  details?: {
    orgCount?: number;
    repoCount?: number;
    lastSync?: string;
  };
}

export function IntegrationsScreen() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'jira',
      name: 'Jira',
      description: 'Connect to your Jira instance to pull issue tracking, approvals, and project management data.',
      icon: FileText,
      isConnected: true,
      details: {
        orgCount: 1,
        repoCount: 12,
        lastSync: '2 hours ago'
      }
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Access your GitHub repositories for code reviews, pull requests, and commit history.',
      icon: Github,
      isConnected: true,
      details: {
        orgCount: 2,
        repoCount: 28,
        lastSync: '15 minutes ago'
      }
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Upload and search through compliance documents, policies, and procedures.',
      icon: FileText,
      isConnected: false
    }
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              isConnected: !integration.isConnected,
              details: !integration.isConnected ? {
                orgCount: 1,
                repoCount: 5,
                lastSync: 'Just now'
              } : undefined
            }
          : integration
      )
    );
  };

  return (
    <div className="p-carbon-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your tools to enable Evidence Bot to search across your organization's data sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const IconComponent = integration.icon;
            
            return (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-muted">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge 
                        variant={integration.isConnected ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {integration.isConnected ? "Connected" : "Not connected"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {integration.isConnected && integration.details && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">Organizations:</span> {integration.details.orgCount}
                        </div>
                        <div>
                          <span className="font-medium">Repositories:</span> {integration.details.repoCount}
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Last sync:</span> {integration.details.lastSync}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {integration.isConnected ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleConnection(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => toggleConnection(integration.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 border border-border rounded-lg bg-muted/20">
          <h3 className="font-medium mb-2">Security & Privacy</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Evidence Bot uses read-only access to your connected tools. We never store or modify your source data, 
            and all searches are performed in real-time with your existing permissions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <strong>Data Protection:</strong> All data is encrypted in transit and at rest
            </div>
            <div>
              <strong>Access Control:</strong> Uses your existing role-based permissions
            </div>
            <div>
              <strong>Audit Trail:</strong> All searches and exports are logged
            </div>
            <div>
              <strong>Compliance:</strong> SOC 2 Type II certified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}