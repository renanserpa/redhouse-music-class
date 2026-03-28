import React, { createContext, useContext, useEffect, useState } from 'react';
import { DynamicNavConfig } from '../types';

type Theme = 'light' | 'dark';

export const DEFAULT_NAV_CONFIG: DynamicNavConfig = {
  pages: {
    'dashboard': { id: 'dashboard', label: 'Início', icon: 'Home', color: 'text-redhouse-muted' },
    'leaderboard': { id: 'leaderboard', label: 'Hall da Fama', icon: 'Trophy', color: 'text-pedagogy-yellow' },
    'rockstar-journey': { id: 'rockstar-journey', label: 'Jornada do Rockstar', icon: 'Star', color: 'text-yellow-500' },
    'lesson-console': { id: 'lesson-console', label: 'Console de Aula', icon: 'Monitor', color: 'text-pedagogy-red' },
    'lesson-plan': { id: 'lesson-plan', label: 'Plano de Aula', icon: 'BookOpen', color: 'text-pedagogy-blue' },
    'avatar-customizer': { id: 'avatar-customizer', label: 'Meu Avatar', icon: 'User', color: 'text-pedagogy-blue' },
    'avatar-shop': { id: 'avatar-shop', label: 'Loja de Skins', icon: 'ShoppingBag', color: 'text-pedagogy-yellow' },
    'director-dashboard': { id: 'director-dashboard', label: 'Painel Diretor', icon: 'ShieldCheck', color: 'text-pedagogy-purple' },
    'lesson-report': { id: 'lesson-report', label: 'Relatório de Aula', icon: 'FileText', color: 'text-pedagogy-purple' },
    'monthly-report': { id: 'monthly-report', label: 'Relatório Mensal', icon: 'Calendar', color: 'text-pedagogy-red' },
    'reports-history': { id: 'reports-history', label: 'Histórico', icon: 'BarChart3', color: 'text-pedagogy-green' },
    'pedagogy-library': { id: 'pedagogy-library', label: 'Biblioteca', icon: 'Library', color: 'text-pedagogy-blue' },
    'tuner': { id: 'tuner', label: 'Afinador', icon: 'Music', color: 'text-emerald-500' },
    'chord-lab': { id: 'chord-lab', label: 'Lab de Acordes', icon: 'Star', color: 'text-pedagogy-green' },
    'fretboard-follower': { id: 'fretboard-follower', label: 'Fretboard Follower', icon: 'Guitar', color: 'text-pedagogy-blue' },
    'fretboard-master': { id: 'fretboard-master', label: 'Fretboard Master', icon: 'Library', color: 'text-pedagogy-red' },
    'tablature': { id: 'tablature', label: 'Tablaturas Console', icon: 'FileText', color: 'text-pedagogy-yellow' },
    'anatomy': { id: 'anatomy', label: 'Anatomia', icon: 'Guitar', color: 'text-pedagogy-orange' },
    'ear-training': { id: 'ear-training', label: 'Detetive Sonoro', icon: 'Ear', color: 'text-pedagogy-blue' },
    'echo-game': { id: 'echo-game', label: 'Jogo do Eco', icon: 'Volume2', color: 'text-pedagogy-purple' },
    'rhythm-invaders': { id: 'rhythm-invaders', label: 'Rhythm Invaders', icon: 'Zap', color: 'text-pedagogy-yellow' },
    'rhythm-challenge': { id: 'rhythm-challenge', label: 'Desafio Rítmico', icon: 'Activity', color: 'text-pedagogy-red' },
    'rhythm-sequencer': { id: 'rhythm-sequencer', label: 'Estúdio de Beats', icon: 'Zap', color: 'text-pedagogy-purple' },
    'rhythmic-dictation': { id: 'rhythmic-dictation', label: 'Ditado Rítmico', icon: 'Printer', color: 'text-pedagogy-blue' },
    'musical-wheel': { id: 'musical-wheel', label: 'Roda Musical', icon: 'RotateCw', color: 'text-pedagogy-orange' },
    'konnakkol': { id: 'konnakkol', label: 'Konnakkol', icon: 'Mic2', color: 'text-pedagogy-green' },
    'string-maze': { id: 'string-maze', label: 'Labirinto das Cordas', icon: 'Music', color: 'text-pedagogy-blue', featureFlag: 'new-games' },
    'elefante-passarinho': { id: 'elefante-passarinho', label: 'Elefante vs Passarinho', icon: 'Gamepad2', color: 'text-pedagogy-orange', featureFlag: 'new-games' },
    'escada-das-cores': { id: 'escada-das-cores', label: 'Escada das Cores', icon: 'Music', color: 'text-pedagogy-green', featureFlag: 'new-games' },
    'grande-relogio': { id: 'grande-relogio', label: 'Grande Relógio', icon: 'Zap', color: 'text-pedagogy-yellow', featureFlag: 'new-games' },
    'rhythm-domino': { id: 'rhythm-domino', label: 'Dominó Rítmico', icon: 'Gamepad2', color: 'text-pedagogy-red', featureFlag: 'new-games' },
    'fabrica-de-acordes': { id: 'fabrica-de-acordes', label: 'Fábrica de Acordes', icon: 'Gamepad2', color: 'text-pedagogy-blue', featureFlag: 'new-games' },
    'danca-mao-direita': { id: 'danca-mao-direita', label: 'Dança Mão Direita', icon: 'Gamepad2', color: 'text-pedagogy-purple', featureFlag: 'new-games' },
    'sussurro-ou-trovao': { id: 'sussurro-ou-trovao', label: 'Sussurro ou Trovão', icon: 'Zap', color: 'text-pedagogy-orange', featureFlag: 'new-games' },
    'spider-walk': { id: 'spider-walk', label: 'Caminhada da Aranha', icon: 'Activity', color: 'text-pedagogy-red', featureFlag: 'new-games' },
    'metronome': { id: 'metronome', label: 'Metrônomo', icon: 'RotateCw', color: 'text-redhouse-muted' },
    'activity-studio': { id: 'activity-studio', label: 'Estúdio de Atividades', icon: 'Gamepad2', color: 'text-pedagogy-purple', featureFlag: 'ai-studio' },
    'songwriter-studio': { id: 'songwriter-studio', label: 'Songwriter Studio', icon: 'Sparkles', color: 'text-pedagogy-purple', featureFlag: 'songwriter-studio' },
    'presentation': { id: 'presentation', label: 'Apresentação', icon: 'BookOpen', color: 'text-emerald-600', featureFlag: 'presentation' },
    'classrooms': { id: 'classrooms', label: 'Turmas', icon: 'School', color: 'text-pedagogy-red' },
    'students': { id: 'students', label: 'Alunos', icon: 'Users', color: 'text-pedagogy-blue' },
    'settings': { id: 'settings', label: 'Preferências', icon: 'Settings', color: 'text-pedagogy-purple' },
  },
  modules: [
    {
      id: 'core',
      label: 'Core',
      icon: 'Home',
      children: [
        { id: 'core-main', label: 'Principal', pages: ['dashboard', 'leaderboard', 'rockstar-journey', 'lesson-console', 'lesson-plan', 'avatar-customizer', 'avatar-shop', 'director-dashboard'] }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'FileText',
      children: [
        { id: 'reports-main', label: 'Relatórios', pages: ['lesson-report', 'monthly-report', 'reports-history'] }
      ]
    },
    {
      id: 'learning-hub',
      label: 'Learning Hub',
      icon: 'Library',
      children: [
        { id: 'learning-main', label: 'Aprendizado', pages: ['pedagogy-library', 'tuner', 'chord-lab', 'fretboard-follower', 'fretboard-master', 'tablature'] }
      ]
    },
    {
      id: 'games',
      label: 'Games & Dynamics',
      icon: 'Gamepad2',
      children: [
        { id: 'games-main', label: 'Jogos', pages: ['anatomy', 'ear-training', 'echo-game', 'rhythm-invaders', 'rhythm-challenge', 'rhythm-sequencer', 'rhythmic-dictation', 'musical-wheel', 'konnakkol', 'string-maze', 'elefante-passarinho', 'escada-das-cores', 'grande-relogio', 'rhythm-domino', 'fabrica-de-acordes', 'danca-mao-direita', 'sussurro-ou-trovao', 'spider-walk'] }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'Zap',
      children: [
        { id: 'tools-main', label: 'Ferramentas', pages: ['metronome', 'activity-studio', 'songwriter-studio', 'presentation'] }
      ]
    },
    {
      id: 'management',
      label: 'Management',
      icon: 'Settings',
      children: [
        { id: 'management-main', label: 'Gestão', pages: ['classrooms', 'students', 'settings'] }
      ]
    }
  ]
};

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  featureToggles: Record<string, boolean>;
  setFeatureToggle: (id: string, enabled: boolean) => void;
  navConfig: DynamicNavConfig;
  updateNavConfig: (newConfig: DynamicNavConfig) => void;
  resetNavConfig: () => void;
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

  const [featureToggles, setFeatureTogglesState] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('rh_feature_toggles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse feature toggles from localStorage', e);
        return {};
      }
    }
    return {};
  });

  const [navConfig, setNavConfigState] = useState<DynamicNavConfig>(() => {
    const saved = localStorage.getItem('rh_nav_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse nav config from localStorage', e);
        return DEFAULT_NAV_CONFIG;
      }
    }
    return DEFAULT_NAV_CONFIG;
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

  useEffect(() => {
    localStorage.setItem('rh_feature_toggles', JSON.stringify(featureToggles));
  }, [featureToggles]);

  useEffect(() => {
    localStorage.setItem('rh_nav_config', JSON.stringify(navConfig));
  }, [navConfig]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setSoundEnabled = (enabled: boolean) => setSoundEnabledState(enabled);
  const setIsSidebarCollapsed = (collapsed: boolean) => setIsSidebarCollapsedState(collapsed);
  
  const setFeatureToggle = (id: string, enabled: boolean) => {
    setFeatureTogglesState(prev => ({
      ...prev,
      [id]: enabled
    }));
  };

  const updateNavConfig = (newConfig: DynamicNavConfig) => {
    setNavConfigState(newConfig);
  };

  const resetNavConfig = () => {
    setNavConfigState(DEFAULT_NAV_CONFIG);
  };

  return (
    <AppContext.Provider value={{ 
      theme, 
      setTheme, 
      soundEnabled, 
      setSoundEnabled,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      featureToggles,
      setFeatureToggle,
      navConfig,
      updateNavConfig,
      resetNavConfig
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
