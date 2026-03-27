import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2, Trophy, Coins, Zap, Volume2, X } from 'lucide-react';
import { audio } from '../lib/audio';
import { Instrument } from '../types';
import NPCGuide, { NPCState } from './NPCGuide';

interface LessonPageProps {
  lessonId: string;
  title: string;
  worldName: string;
  worldNumber: number;
  instrument?: Instrument;
  onBack: () => void;
  onComplete: () => void;
  children: React.ReactNode;
}

export default function LessonPage({ 
  lessonId, 
  title, 
  worldName, 
  worldNumber, 
  instrument = 'guitar',
  onBack, 
  onComplete, 
  children 
}: LessonPageProps) {
  const [showNpc, setShowNpc] = useState(true);
  const [npcState, setNpcState] = useState<NPCState>('idle');
  const [npcContext, setNpcContext] = useState<'lessonStart' | 'correct' | 'wrong'>('lessonStart');

  useEffect(() => {
    setNpcContext('lessonStart');
    setNpcState('idle');
  }, [lessonId]);

  useEffect(() => {
    if (npcState !== 'idle') {
      const timer = setTimeout(() => {
        setNpcState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [npcState]);

  const handleComplete = () => {
    setNpcState('celebrating');
    setNpcContext('correct');
    
    // Delay completion to allow celebration animation
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-redhouse-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-4 md:p-6 sticky top-0 z-40 shadow-sm pedagogical-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                audio.playClick();
                onBack();
              }}
              className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-redhouse-primary hover:bg-redhouse-primary/10 transition-all"
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>
            
            <div className="hidden sm:block h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-redhouse-primary uppercase italic tracking-widest">Mundo {worldNumber}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">/ {worldName}</span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 mr-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-redhouse-primary/10 rounded-2xl border border-redhouse-primary/20">
                <Zap className="w-5 h-5 text-redhouse-primary" />
                <span className="text-sm font-black text-redhouse-primary">+50</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-black text-yellow-500">+10</span>
              </div>
            </div>

            <button 
              onClick={() => setShowNpc(!showNpc)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                showNpc ? 'bg-redhouse-primary text-white shadow-lg shadow-redhouse-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 md:p-12 relative z-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={lessonId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-12 min-h-[60vh] glass-card"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-6 md:p-8 sticky bottom-0 z-40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">Quase lá!</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Complete o desafio para ganhar seu prêmio.</p>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="w-full md:w-auto bg-redhouse-primary text-white px-16 py-6 rounded-[2.5rem] font-black text-2xl uppercase italic shadow-2xl shadow-redhouse-primary/40 hover:bg-redhouse-primary/90 transition-all flex items-center justify-center gap-4 group"
          >
            <Trophy className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            Concluir Missão
          </motion.button>
        </div>
      </footer>

      {/* NPC Mestre Corda */}
      <AnimatePresence>
        {showNpc && (
          <NPCGuide 
            context={npcContext}
            instrument={instrument}
            state={npcState}
            onClose={() => setShowNpc(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
