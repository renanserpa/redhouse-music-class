/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Gamepad2, 
  BookOpen, 
  Printer, 
  BarChart3, 
  Trophy, 
  Coins, 
  Menu, 
  X,
  Guitar,
  Ear,
  Zap,
  LayoutDashboard,
  RotateCw,
  Star,
  Volume2,
  VolumeX,
  FileText,
  Activity,
  Calendar,
  LogOut,
  LogIn,
  Monitor,
  ShieldCheck,
  Users,
  Home,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  MoreHorizontal,
  History,
  Library,
  Settings,
  Mic2,
  School,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Tab, AppState, User, AuthStatus, LessonReport, MonthlyReport } from './types';
import { audio } from './lib/audio';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { listAllLessonReports, listAllMonthlyReports } from './services/dataService';
import { useAppContext } from './contexts/AppContext';

import RockstarJourney from './components/RockstarJourney';
import TunerModule from './components/TunerModule';
import Dashboard from './components/Dashboard';
import AnatomyGame from './components/AnatomyGame';
import EarTraining from './components/EarTraining';
import RhythmInvaders from './components/RhythmInvaders';
import KonnakkolBuilder from './components/KonnakkolBuilder';
import ActivityStudio from './components/ActivityStudio';
import LessonPlan from './components/LessonPlan';
import Metronome from './components/Metronome';
import MusicalWheel from './components/MusicalWheel';
import FretboardFollower from './components/FretboardFollower';
import EchoGame from './components/EchoGame';
import ChordLab from './components/ChordLab';
import RhythmChallenge from './components/RhythmChallenge';
import RhythmicDictation from './components/RhythmicDictation';
import FretboardMaster from './components/FretboardMaster';
import TablatureModule from './components/TablatureModule';
import LessonReportForm from './components/LessonReportForm';
import MonthlyReportForm from './components/MonthlyReportForm';
import ReportsHistory from './components/ReportsHistory';
import PedagogyLibrary from './components/PedagogyLibrary';
import StudentManager from './components/StudentManager';
import ClassroomManager from './components/ClassroomManager';
import BrandHeader from './components/BrandHeader';
import LessonConsole from './components/LessonConsole';
import DirectorDashboard from './components/DirectorDashboard';
import AppSettings from './components/AppSettings';
import FloatingToolbar from './components/FloatingToolbar';

export default function AppV1() {
  const { 
    theme, 
    setTheme, 
    soundEnabled, 
    setSoundEnabled, 
    isSidebarCollapsed, 
    setIsSidebarCollapsed 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tvMode, setTvMode] = useState(false);
  const [state, setState] = useState<AppState>({
    user: {
      uid: 'dev-user-id',
      name: 'Professor RedHouse',
      email: 'serparenan@gmail.com',
      role: 'admin',
      photoURL: null
    },
    authStatus: 'authenticated',
    xp: 450,
    coins: 120,
    studentName: "Pequeno Rockstar",
    instrument: 'guitar',
    stats: {
      tech: 80,
      rhythm: 60,
      theory: 40,
      repertoire: 70,
      expression: 90
    },
    currentClassroomId: undefined,
    currentStudentId: undefined,
    lessonReports: [],
    monthlyReports: []
  });

  useEffect(() => {
    localStorage.setItem('rh_tv_mode', String(tvMode));
    if (tvMode) {
      document.documentElement.classList.add('tv-mode');
    } else {
      document.documentElement.classList.remove('tv-mode');
    }
  }, [tvMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tvMode) {
        setTvMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tvMode]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    playNavSound();
  };

  // Carregar relatórios iniciais e checar URL params
  useEffect(() => {
    // Check for parameters in URL
    const params = new URLSearchParams(window.location.search);
    const lessonParam = params.get('lesson');
    const tabParam = params.get('tab');

    if (lessonParam) {
      setActiveTab('rockstar-journey');
    } else if (tabParam) {
      setActiveTab(tabParam as Tab);
    }

    if (state.authStatus === 'authenticated') {
      const loadReports = async () => {
        try {
          const [lessons, monthly] = await Promise.all([
            listAllLessonReports(),
            listAllMonthlyReports()
          ]);
          setState(prev => ({ ...prev, lessonReports: lessons, monthlyReports: monthly }));
        } catch (error) {
          console.error("Erro ao carregar relatórios:", error);
        }
      };
      loadReports();
    }
  }, [state.authStatus]);

  useEffect(() => {
    // Authentication temporarily disabled for development
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addXP = (amount: number) => {
    setState(prev => ({ ...prev, xp: prev.xp + amount }));
    if (amount > 0) audio.playSuccess();
  };

  const addCoins = (amount: number) => {
    setState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const updateStats = (newStats: Partial<AppState['stats']>) => {
    setState(prev => ({ ...prev, stats: { ...prev.stats, ...newStats } }));
  };

  if (state.authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-redhouse-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-8 border-redhouse-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-redhouse-text uppercase tracking-widest italic">Carregando RedHouse...</p>
        </div>
      </div>
    );
  }

  if (state.authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-redhouse-bg flex items-center justify-center p-6 hud-gradient">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass-card p-10 text-center"
        >
          <BrandHeader showCampus={true} />
          <div className="my-10">
            <div className="w-24 h-24 bg-redhouse-primary rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl mb-6 transform -rotate-6">
              <Music className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-redhouse-text uppercase italic mb-4">Bem-vindo, Mestre!</h1>
            <p className="text-redhouse-muted font-bold mb-8">Acesse sua conta para gerenciar suas turmas e relatórios na RedHouse Cuiabá.</p>
            
            <button 
              onClick={handleLogin}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95 text-redhouse-text"
            >
              <LogIn className="w-6 h-6 text-redhouse-primary" />
              Entrar com Google
            </button>
          </div>
          <p className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest">Acesso restrito a professores autorizados</p>
        </motion.div>
      </div>
    );
  }

  const playNavSound = () => {
    if (soundEnabled) {
      audio.playClick();
    }
  };

  const handleTabChange = (tab: Tab | 'landing') => {
    playNavSound();
    if (tab === 'landing') {
      window.location.href = '/';
      return;
    }
    setActiveTab(tab as Tab);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const navGroups = [
    {
      label: 'Aula',
      items: [
        { id: 'dashboard', label: 'Início', icon: Home, color: 'text-redhouse-muted' },
        { id: 'rockstar-journey', label: 'Jornada do Rockstar', icon: Star, color: 'text-yellow-500' },
        { id: 'lesson-console', label: 'Console de Aula', icon: Monitor, color: 'text-pedagogy-red' },
        { id: 'lesson-plan', label: 'Plano de Aula', icon: BookOpen, color: 'text-pedagogy-blue' },
        { id: 'metronome', label: 'Metrônomo', icon: RotateCw, color: 'text-redhouse-muted' },
        { id: 'director-dashboard', label: 'Painel Diretor', icon: ShieldCheck, color: 'text-pedagogy-purple' },
      ]
    },
    {
      label: 'Relatórios',
      items: [
        { id: 'lesson-report', label: 'Relatório de Aula', icon: FileText, color: 'text-pedagogy-purple' },
        { id: 'monthly-report', label: 'Relatório Mensal', icon: Calendar, color: 'text-pedagogy-red' },
        { id: 'reports-history', label: 'Histórico', icon: BarChart3, color: 'text-pedagogy-green' },
      ]
    },
    {
      label: 'Jogos & Dinâmicas',
      items: [
        { id: 'anatomy', label: 'Anatomia', icon: Guitar, color: 'text-pedagogy-orange' },
        { id: 'ear-training', label: 'Detetive Sonoro', icon: Ear, color: 'text-pedagogy-blue' },
        { id: 'echo-game', label: 'Jogo do Eco', icon: Volume2, color: 'text-pedagogy-purple' },
        { id: 'rhythm-invaders', label: 'Rhythm Invaders', icon: Zap, color: 'text-pedagogy-yellow' },
        { id: 'rhythm-challenge', label: 'Desafio Rítmico', icon: Activity, color: 'text-pedagogy-red' },
        { id: 'rhythmic-dictation', label: 'Ditado Rítmico', icon: Printer, color: 'text-pedagogy-blue' },
        { id: 'musical-wheel', label: 'Roda Musical', icon: RotateCw, color: 'text-pedagogy-orange' },
        { id: 'konnakkol', label: 'Konnakkol', icon: Mic2, color: 'text-pedagogy-green' },
      ]
    },
    {
      label: 'Conteúdo & IA',
      items: [
        { id: 'pedagogy-library', label: 'Biblioteca', icon: BookOpen, color: 'text-pedagogy-blue' },
        { id: 'tuner', label: 'Afinador', icon: Music, color: 'text-emerald-500' },
        { id: 'chord-lab', label: 'Lab de Acordes', icon: Star, color: 'text-pedagogy-green' },
        { id: 'fretboard-follower', label: 'Fretboard Follower', icon: Guitar, color: 'text-pedagogy-blue' },
        { id: 'fretboard-master', label: 'Fretboard Master', icon: Library, color: 'text-pedagogy-red' },
        { id: 'tablature', label: 'Tablaturas Console', icon: FileText, color: 'text-pedagogy-yellow' },
        { id: 'activity-studio', label: 'Estúdio de Atividades', icon: Gamepad2, color: 'text-pedagogy-purple' },
      ]
    },
    {
      label: 'Configurações',
      items: [
        { id: 'classrooms', label: 'Turmas', icon: School, color: 'text-pedagogy-red' },
        { id: 'students', label: 'Alunos', icon: Users, color: 'text-pedagogy-blue' },
        { id: 'settings', label: 'Preferências', icon: Settings, color: 'text-pedagogy-purple' },
      ]
    },
    {
      label: 'Apresentação',
      items: [
        { id: 'landing', label: 'Ver Apresentação', icon: Home, color: 'text-redhouse-primary' },
      ]
    }
  ];

  const bottomNavItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'lesson-console', label: 'Aula', icon: Monitor },
    { id: 'reports-history', label: 'Relatórios', icon: FileText },
    { id: 'more', label: 'Mais', icon: MoreHorizontal },
  ];

  const getActiveBottomTab = () => {
    if (activeTab === 'dashboard') return 'dashboard';
    if (activeTab === 'lesson-console') return 'lesson-console';
    if (['lesson-report', 'monthly-report', 'reports-history'].includes(activeTab)) return 'reports-history';
    return 'more';
  };

  const activeBottomTab = getActiveBottomTab();

  const SidebarContent = () => (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-32 bg-redhouse-primary/5 blur-3xl -z-10" />
      
      <div className="p-6 border-b border-white/5 relative flex items-center justify-between">
        {!isSidebarCollapsed && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <BrandHeader showCampus={true} variant="compact" />
          </motion.div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-white/5 rounded-xl transition-all text-redhouse-muted hover:text-redhouse-text active:scale-95 group"
        >
          {isSidebarCollapsed ? <Menu className="w-5 h-5 group-hover:rotate-180 transition-transform" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-8 overflow-y-auto no-scrollbar py-8">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-4">
            {!isSidebarCollapsed && (
              <h5 className="px-4 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic mb-2">{group.label}</h5>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as Tab)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl font-black transition-all relative group/item ${
                      isActive 
                        ? 'bg-white/10 text-white shadow-xl shadow-black/20 ring-1 ring-white/10' 
                        : 'hover:bg-white/4 text-redhouse-muted'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-white text-slate-900 shadow-[0_0_15px_white]' : 'bg-white/5 group-hover/item:bg-white/10'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {!isSidebarCollapsed && (
                      <span className={`text-[11px] uppercase italic tracking-tight transition-all ${isActive ? 'translate-x-1' : 'group-hover/item:translate-x-1'}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active" 
                        className="absolute right-3 w-1.5 h-1.5 bg-redhouse-primary rounded-full shadow-[0_0_10px_var(--color-redhouse-primary)]" 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className={`flex items-center gap-4 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
          <div className="relative group/avatar">
            <div className="absolute inset-0 bg-redhouse-primary/20 blur-xl group-hover/avatar:bg-redhouse-primary/40 transition-all rounded-full" />
            <div className="w-12 h-12 bg-white rounded-2xl border border-white/10 flex items-center justify-center text-xl shadow-2xl relative z-10 overflow-hidden ring-1 ring-white/20 group-hover/avatar:scale-110 transition-transform">
              {state.user?.photoURL ? (
                <img src={state.user.photoURL} alt={state.user.name || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                "👦🏻"
              )}
            </div>
            
            {/* Theme Toggle Overlay for Collapsed Sidebar */}
            {isSidebarCollapsed && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="absolute -right-2 -bottom-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 z-20 hover:bg-redhouse-primary transition-colors"
                title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              >
                {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </button>
            )}
          </div>
          
          {!isSidebarCollapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-black text-[11px] text-redhouse-text uppercase italic truncate">{state.user?.name || 'Professor RedHouse'}</h4>
                <p className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.2em] mt-0.5 truncate">
                  {state.user?.role === 'admin' ? 'SYSTEM_ADMIN' : 'CLASS_COMMANDER'}
                </p>
              </div>

              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-white/5 rounded-xl text-redhouse-muted hover:text-white transition-all active:scale-90"
                title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </>
          )}

          <div className={`flex items-center gap-1 ${isSidebarCollapsed ? 'mt-4' : ''}`}>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 hover:bg-white/5 rounded-xl text-redhouse-muted hover:text-white transition-all active:scale-90"
              title={soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 hover:bg-white/5 rounded-xl text-redhouse-primary hover:bg-redhouse-primary/10 transition-all active:scale-90"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-white dark:bg-[#0A0F14] text-redhouse-blue dark:text-redhouse-text font-sans selection:bg-redhouse-primary selection:text-white transition-colors duration-500 overflow-x-hidden relative ${tvMode ? 'tv-mode' : ''}`}>
      {/* Global scanline/grid effect - Reduced opacity and theme aware */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015] dark:opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Mobile Header */}
      <header className="lg:hidden bg-redhouse-bg/80 backdrop-blur-lg border-b border-white/5 p-6 flex justify-between items-center sticky top-0 z-50">
        <BrandHeader variant="compact" />
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-redhouse-muted active:scale-90 transition-transform">
          <Menu className="w-8 h-8" />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile Only) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 bg-[#0D1219]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[70] shadow-[10px_0_50px_rgba(0,0,0,0.5)]
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-40
        ${isSidebarCollapsed ? 'w-24' : 'w-80'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className={`
        min-h-screen p-6 lg:p-12 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) relative z-10
        ${isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-80'}
      `}>
        <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="glass-card px-8 py-5 flex items-center gap-6 border-white/5 bg-white/2 hover:border-pedagogy-green/30 transition-all group">
              <div className="w-14 h-14 bg-pedagogy-green/10 rounded-[20px] flex items-center justify-center text-pedagogy-green border border-pedagogy-green/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[9px] font-black text-redhouse-muted uppercase tracking-[0.3em] leading-none mb-1.5 italic">Experience_Score</p>
                <p className="text-3xl font-black text-redhouse-text leading-none italic tracking-tighter">{state.xp}</p>
              </div>
            </div>
            <div className="glass-card px-8 py-5 flex items-center gap-6 border-white/5 bg-white/2 hover:border-pedagogy-yellow/30 transition-all group">
              <div className="w-14 h-14 bg-pedagogy-yellow/10 rounded-[20px] flex items-center justify-center text-pedagogy-yellow border border-pedagogy-yellow/20 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">
                <Coins className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[9px] font-black text-redhouse-muted uppercase tracking-[0.3em] leading-none mb-1.5 italic">GMC_Credits</p>
                <p className="text-3xl font-black text-redhouse-text leading-none italic tracking-tighter">{state.coins}</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-4">
             <div className="flex items-center md:justify-end gap-3 mb-1">
                <div className="w-1.5 h-1.5 bg-pedagogy-green rounded-full shadow-[0_0_8px_var(--color-pedagogy-green)] animate-pulse" />
                <h2 className="text-[9px] font-black text-redhouse-muted uppercase tracking-[0.4em] italic">RedHouse_Network: Active</h2>
             </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTvMode(!tvMode)}
                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-black uppercase italic text-[10px] ${
                  tvMode 
                    ? 'bg-redhouse-primary border-redhouse-primary text-white shadow-lg shadow-redhouse-primary/30' 
                    : 'bg-white/5 border-white/10 text-redhouse-muted hover:text-white hover:border-white/20'
                }`}
              >
                <Monitor className="w-4 h-4" />
                {tvMode ? 'Modo TV Ativo' : 'Modo TV'}
              </button>
              <p className="text-4xl font-black text-redhouse-primary italic uppercase leading-none tracking-tighter">Music_HUD v2.5</p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'rockstar-journey' && (
                <RockstarJourney 
                  state={state} 
                  setState={setState}
                  addXP={addXP}
                  addCoins={addCoins}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'tuner' && <TunerModule />}
              {activeTab === 'dashboard' && (
                <Dashboard 
                  state={state} 
                  setState={setState} 
                  setActiveTab={setActiveTab} 
                  currentClassroomId={state.currentClassroomId}
                  currentStudentId={state.currentStudentId}
                  onSelectContext={(classroomId, studentId) => {
                    setState(prev => ({ ...prev, currentClassroomId: classroomId, currentStudentId: studentId }));
                  }}
                />
              )}
              {activeTab === 'pedagogy-library' && <PedagogyLibrary />}
              {activeTab === 'anatomy' && <AnatomyGame addXP={addXP} />}
              {activeTab === 'ear-training' && <EarTraining addXP={addXP} />}
              {activeTab === 'echo-game' && <EchoGame addXP={addXP} />}
              {activeTab === 'chord-lab' && <ChordLab addXP={addXP} />}
              {activeTab === 'rhythm-invaders' && <RhythmInvaders addXP={addXP} />}
              {activeTab === 'konnakkol' && <KonnakkolBuilder addXP={addXP} />}
              {activeTab === 'musical-wheel' && <MusicalWheel addXP={addXP} />}
              {activeTab === 'fretboard-follower' && <FretboardFollower addXP={addXP} />}
              {activeTab === 'fretboard-master' && <FretboardMaster addXP={addXP} />}
              {activeTab === 'tablature' && <TablatureModule />}
              {activeTab === 'rhythm-challenge' && <RhythmChallenge addXP={addXP} />}
              {activeTab === 'rhythmic-dictation' && <RhythmicDictation addXP={addXP} />}
              {activeTab === 'activity-studio' && <ActivityStudio state={state} />}
              {activeTab === 'classrooms' && <ClassroomManager />}
              {activeTab === 'students' && <StudentManager />}
              {activeTab === 'lesson-console' && (
                <LessonConsole 
                  state={state} 
                  onFinishLesson={(attendance) => {
                    setActiveTab('lesson-report');
                  }} 
                />
              )}
              {activeTab === 'director-dashboard' && <DirectorDashboard state={state} />}
              {activeTab === 'lesson-plan' && <LessonPlan setActiveTab={setActiveTab} />}
              {activeTab === 'lesson-report' && <LessonReportForm user={state.user} onSave={(report) => {
                setState(prev => ({
                  ...prev,
                  lessonReports: [...(prev.lessonReports || []), report]
                }));
                setActiveTab('reports-history');
              }} />}
              {activeTab === 'monthly-report' && <MonthlyReportForm user={state.user} onSave={(report) => {
                setState(prev => ({
                  ...prev,
                  monthlyReports: [...(prev.monthlyReports || []), report]
                }));
                setActiveTab('reports-history');
              }} />}
              {activeTab === 'reports-history' && <ReportsHistory state={state} />}
              {activeTab === 'metronome' && <Metronome />}
              {activeTab === 'settings' && <AppSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-redhouse-bg/80 backdrop-blur-xl border-t border-white/10 p-2 flex justify-around items-center z-50 shadow-2xl">
        {bottomNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'more') {
                setIsSidebarOpen(true);
              } else {
                handleTabChange(item.id as Tab);
              }
            }}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all relative min-w-[70px] ${
              activeBottomTab === item.id ? 'text-redhouse-primary' : 'text-redhouse-muted'
            }`}
          >
            {activeBottomTab === item.id && (
              <motion.div 
                layoutId="activeBottomTab"
                className="absolute inset-0 bg-red-500/10 rounded-2xl -z-10 border border-redhouse-primary/20"
              />
            )}
            <item.icon className={`w-6 h-6 ${activeBottomTab === item.id ? 'scale-110' : ''} transition-transform`} />
            <span className={`text-[10px] font-black uppercase mt-1 tracking-tighter ${activeBottomTab === item.id ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <FloatingToolbar isVisible={activeTab !== 'lesson-console'} />
    </div>
  );
}
