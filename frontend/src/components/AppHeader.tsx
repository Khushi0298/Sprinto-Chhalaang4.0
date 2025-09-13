import React from 'react';
import { Shield, Bell, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

type Screen = 'home' | 'integrations' | 'audit';

interface AppHeaderProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export function AppHeader({ currentScreen, onScreenChange, isDark, onToggleDark }: AppHeaderProps) {
  return (
    <header className="bg-background border-b border-border">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center space-carbon-6">
          <div className="flex items-center space-carbon-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-medium">SPRINTO</h1>
          </div>
          
          <nav className="flex items-center space-carbon-1">
            <Button
              variant={currentScreen === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onScreenChange('home')}
              className="hover:bg-[#FE763A] hover:text-white active:bg-[#FE763A] focus:bg-[#FE763A]"
              style={currentScreen === 'home' ? { backgroundColor: '#FE763A', color: 'white' } : {}}
            >
              Ask
            </Button>
            <Button
              variant={currentScreen === 'integrations' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onScreenChange('integrations')}
              className="hover:bg-[#FE763A] hover:text-white active:bg-[#FE763A] focus:bg-[#FE763A]"
              style={currentScreen === 'integrations' ? { backgroundColor: '#FE763A', color: 'white' } : {}}
            >
              Integrations
            </Button>
            <Button
              variant={currentScreen === 'audit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onScreenChange('audit')}
              className="hover:bg-[#FE763A] hover:text-white active:bg-[#FE763A] focus:bg-[#FE763A]"
              style={currentScreen === 'audit' ? { backgroundColor: '#FE763A', color: 'white' } : {}}
            >
              Audit Log
            </Button>
          </nav>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-carbon-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDark}
            className="hover:bg-[#FE763A] hover:text-white active:bg-[#FE763A] focus:bg-[#FE763A]"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="hover:bg-[#FE763A] hover:text-white active:bg-[#FE763A] focus:bg-[#FE763A]"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 hover:bg-[#FE763A] hover:text-white active:bg-[#FE763A] focus:bg-[#FE763A]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}