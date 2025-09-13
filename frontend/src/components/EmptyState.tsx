import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface EmptyStateProps {
  onSearch: (query: string, answer: string) => void;
}

export function EmptyState({ onSearch }: EmptyStateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const samplePrompts = [
    "Why was PR #456 merged without approval?",
    "Was Jane's Prod DB access approved?",
    "Share current laptop count and export."
  ];

  const handlePromptClick = async (prompt: string) => {
    if (isLoading) return; // Prevent multiple clicks while loading
    setSearchQuery(prompt);
    await makeSearchRequest(prompt);
  };

  const makeSearchRequest = async (query: string) => {
    setIsLoading(true);
    try {
      // Make API call to backend
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.response || 'No answer received from backend';
      
      // Send query and answer to HomeScreen
      onSearch(query, answer);
    } catch (error) {
      console.error('Error fetching answer from backend:', error);
      const errorAnswer = 'Sorry, there was an error processing your query. Please try again.';
      onSearch(query, errorAnswer);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() && !isLoading) {
      await makeSearchRequest(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Illustration placeholder */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
          <img src="/Static/robot.png" alt="Robot" className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-medium" style={{ color: '#0055FD' }}>Evidence Bot</h1>
      </div>
      

      {/* Main heading */}
      <h1 className="text-2xl font-medium mb-4">Ask for proof, not promises.</h1>
      
      {/* Helper text */}
      <p className="text-muted-foreground mb-8 max-w-md">
        Get instant evidence from your tools. Ask questions about approvals, access, compliance, or any audit requirement.
      </p>

      {/* Search Input */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 h-12 text-base"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSearch} 
            className="px-6 h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Sample prompts */}
      <div className="space-y-3 mb-8 w-full max-w-lg">
        <p className="text-sm font-medium mb-4">Try asking:</p>
        {samplePrompts.map((prompt, index) => (
          <Card 
            key={index}
            className={`p-4 cursor-pointer hover:bg-accent transition-colors text-left ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handlePromptClick(prompt)}
          >
            <p className="text-sm">{prompt}</p>
          </Card>
        ))}
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground mt-6">
        Try referencing an issue, PR number, asset type, or person.
      </p>
    </div>
  );
}