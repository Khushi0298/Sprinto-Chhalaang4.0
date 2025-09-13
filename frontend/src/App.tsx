import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { HomeScreen } from './components/HomeScreen';
import { IntegrationsScreen } from './components/IntegrationsScreen';
import { AuditLogScreen } from './components/AuditLogScreen';
import { Toaster } from './components/ui/sonner';

type Screen = 'home' | 'integrations' | 'audit';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDark, setIsDark] = useState(false);
  const [isResultsState, setIsResultsState] = useState(false);
  const [forceEmptyState, setForceEmptyState] = useState(0); // Use a counter to force re-render

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleScreenChange = (screen: Screen, opts?: { fromResults?: boolean }) => {
    if (opts?.fromResults && screen === 'home') {
      // Force reset to empty state by incrementing counter
      setForceEmptyState(prev => prev + 1);
      setIsResultsState(false);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            key={forceEmptyState} // Use key to force re-mount when needed
            onStateChange={setIsResultsState}
          />
        );
      case 'integrations':
        return <IntegrationsScreen />;
      case 'audit':
        return <AuditLogScreen />;
      default:
        return (
          <HomeScreen 
            key={forceEmptyState} // Use key to force re-mount when needed
            onStateChange={setIsResultsState}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        currentScreen={currentScreen}
        onScreenChange={handleScreenChange}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        isResultsState={isResultsState}
      />
      {renderScreen()}
      <Toaster />
    </div>
  );
}