import React, { useState } from 'react';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { ResultsState } from './ResultsState';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ExportModal } from './ExportModal';

type HomeState = 'empty' | 'loading' | 'results';

interface EvidenceItem {
  field: string;
  value: string;
  source: string;
  link: string;
}

export function HomeScreen(): React.ReactElement {
  const [currentState, setCurrentState] = useState<HomeState>('empty');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (searchQuery) {
      setQuery(searchQuery);
    }
    setCurrentState('loading');
    
    try {
      // Make API call to backend
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryToSearch }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer || 'No answer received from backend');
      setCurrentState('results');
    } catch (error) {
      console.error('Error fetching answer from backend:', error);
      setAnswer('Sorry, there was an error processing your query. Please try again.');
      setCurrentState('results');
    }
  };

  const handleEvidenceClick = (evidence: EvidenceItem) => {
    setSelectedEvidence(evidence);
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const renderMainContent = () => {
    switch (currentState) {
      case 'empty':
        return <EmptyState onSearch={handleSearch} />;
      case 'loading':
        return <LoadingState />;
      case 'results':
        return (
          <ResultsState 
            query={query}
            answer={answer}
            onEvidenceClick={handleEvidenceClick}
            onExport={handleExport}
          />
        );
      default:
        return <EmptyState onSearch={handleSearch} />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* FilterRail hidden */}
      <main className="flex-1 p-carbon-6">
        <div className="max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </main>

      <EvidenceDrawer
        evidence={selectedEvidence}
        isOpen={!!selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}