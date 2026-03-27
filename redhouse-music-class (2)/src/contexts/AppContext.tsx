import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('rh_theme');
    return (saved as Theme) || 'light';
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('rh_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsedState] = useState<boolean>(() => {
    const saved = localStorage.getItem('rh_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('rh_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rh_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('rh_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setSoundEnabled = (enabled: boolean) => setSoundEnabledState(enabled);
  const setIsSidebarCollapsed = (collapsed: boolean) => setIsSidebarCollapsedState(collapsed);

  return (
    <AppContext.Provider value={{ 
      theme, 
      setTheme, 
      soundEnabled, 
      setSoundEnabled,
      isSidebarCollapsed,
      setIsSidebarCollapsed
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
