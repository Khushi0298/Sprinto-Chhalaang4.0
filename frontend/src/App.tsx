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

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'integrations':
        return <IntegrationsScreen />;
      case 'audit':
        return <AuditLogScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
      />
      {renderScreen()}
      <Toaster />
    </div>
  );
}