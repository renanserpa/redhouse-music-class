import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Users, 
  School, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX,
  ChevronRight,
  Monitor,
  Bell,
  Shield,
  HelpCircle,
  Terminal,
  Cpu,
  Zap
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import ClassroomManager from './ClassroomManager';
import StudentManager from './StudentManager';
import DevMenuBuilder from './DevMenuBuilder';

type SettingsTab = 'preferences' | 'classrooms' | 'students' | 'developer';

interface AppSettingsProps {
  userRole?: string;
}

export default function AppSettings({ userRole }: AppSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('preferences');
  const { 
    theme, 
    setTheme, 
    soundEnabled, 
    setSoundEnabled,
    featureToggles,
    setFeatureToggle
  } = useAppContext();

  const tabs = [
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'classrooms', label: 'Turmas', icon: School },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'developer', label: 'Developer', icon: Terminal, devOnly: true },
  ].filter(tab => !tab.devOnly || userRole === 'dev');

  const availableFeatures = [
    { id: 'ai-studio', label: 'Google AI Studio Integration', icon: Cpu, description: 'Enable advanced AI features powered by Google Gemini' },
    { id: 'new-games', label: 'Experimental Game Dynamics', icon: Zap, description: 'Test new physics and interaction models in games' },
    { id: 'songwriter-studio', label: 'Songwriter Studio Module', icon: Volume2, description: 'Access the early-access songwriting tools' },
    { id: 'presentation', label: 'Institutional Presentation Page', icon: Monitor, description: 'Show the marketing-focused landing page' },
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-redhouse-red/10 rounded-xl">
          <Settings className="w-8 h-8 text-redhouse-red" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-redhouse-blue dark:text-white uppercase italic tracking-tight">
            Configurações
          </h1>
          <p className="text-sm font-bold text-redhouse-muted uppercase tracking-widest">
            Gerencie sua conta e preferências do app
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
              ${activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-redhouse-red shadow-sm' 
                : 'text-gray-500 hover:text-redhouse-blue dark:hover:text-white'}
            `}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'preferences' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Setting */}
                <div className="glass-card p-6 border-2 border-redhouse-blue/10 dark:border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        {theme === 'light' ? <Sun className="w-6 h-6 text-amber-600" /> : <Moon className="w-6 h-6 text-amber-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-redhouse-blue dark:text-white">Tema do App</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Escolha entre modo claro ou escuro</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-900/50 rounded-xl">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 text-redhouse-red shadow-sm' : 'text-gray-500'}`}
                    >
                      <Sun className="w-4 h-4" /> Claro
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 text-redhouse-red shadow-sm' : 'text-gray-500'}`}
                    >
                      <Moon className="w-4 h-4" /> Escuro
                    </button>
                  </div>
                </div>

                {/* Sound Setting */}
                <div className="glass-card p-6 border-2 border-redhouse-blue/10 dark:border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        {soundEnabled ? <Volume2 className="w-6 h-6 text-blue-600" /> : <VolumeX className="w-6 h-6 text-blue-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-redhouse-blue dark:text-white">Sons de Navegação</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ativar/desativar sons ao clicar nos menus</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                        ${soundEnabled ? 'bg-redhouse-red' : 'bg-gray-300 dark:bg-slate-700'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      <strong>Nota:</strong> Os sons pedagógicos (jogos, metrônomo e atividades) continuarão ativos mesmo se esta opção estiver desativada.
                    </p>
                  </div>
                </div>

                {/* Other Info (Placeholder) */}
                <div className="glass-card p-6 border-2 border-redhouse-blue/10 dark:border-white/10 opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-slate-900/30 rounded-lg">
                        <Bell className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-redhouse-blue dark:text-white">Notificações</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Em breve</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="glass-card p-6 border-2 border-redhouse-blue/10 dark:border-white/10 opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-slate-900/30 rounded-lg">
                        <Shield className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-redhouse-blue dark:text-white">Privacidade</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Em breve</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'classrooms' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-redhouse-blue/10 dark:border-white/10 h-full overflow-y-auto">
                <ClassroomManager />
              </div>
            )}

            {activeTab === 'students' && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-redhouse-blue/10 dark:border-white/10 h-full overflow-y-auto">
                <StudentManager />
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="flex flex-col gap-6 h-full overflow-y-auto no-scrollbar pb-20">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-xl">
                    <Terminal className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-300">Developer Mode</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 italic">
                      Experimental feature flags and system configuration.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-redhouse-muted uppercase tracking-[0.3em] italic px-2">
                    Feature Toggles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableFeatures.map((feature) => (
                      <div 
                        key={feature.id}
                        className="glass-card p-6 border-2 border-redhouse-blue/10 dark:border-white/10 flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-slate-900/30 rounded-lg">
                              <feature.icon className="w-6 h-6 text-redhouse-blue dark:text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-redhouse-blue dark:text-white">{feature.label}</h3>
                              <code className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                                {feature.id}
                              </code>
                            </div>
                          </div>
                          <button
                            onClick={() => setFeatureToggle(feature.id, !featureToggles[feature.id])}
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                              ${featureToggles[feature.id] ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-700'}
                            `}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${featureToggles[feature.id] ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-black text-redhouse-muted uppercase tracking-[0.3em] italic px-2 mt-12">
                    Menu Builder
                  </h3>
                  <DevMenuBuilder />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
