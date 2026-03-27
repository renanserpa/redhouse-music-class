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
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden text-white font-sans">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-redhouse-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="bg-black/60 backdrop-blur-xl border-b border-white/10 p-4 md:p-6 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                audio.playClick();
                onBack();
              }}
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>
            
            <div className="hidden sm:block h-10 w-px bg-white/10 mx-2" />

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-redhouse-primary uppercase italic tracking-widest">Missão_LOG_{worldNumber}</span>
                <span className="text-[10px] font-black text-white/30 uppercase italic tracking-widest">/ {worldName.toUpperCase()}</span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-md">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 mr-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-redhouse-primary/20 rounded-2xl border border-redhouse-primary/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <Zap className="w-5 h-5 text-redhouse-primary" />
                <span className="text-sm font-black text-redhouse-primary">+50 XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-2xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-black text-yellow-500">+10 CR</span>
              </div>
            </div>

            <button 
              onClick={() => {
                audio.playClick();
                setShowNpc(!showNpc);
              }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
                showNpc ? 'bg-redhouse-primary text-white border-white/20 shadow-lg shadow-redhouse-primary/30' : 'bg-white/5 text-white/20 border-white/5'
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
              className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/10 p-6 md:p-12 min-h-[60vh] shadow-2xl relative group"
            >
              {/* Internal HUD corners */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/10 rounded-tl-2xl pointer-events-none" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/10 rounded-tr-2xl pointer-events-none" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/10 rounded-bl-2xl pointer-events-none" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/10 rounded-br-2xl pointer-events-none" />
              
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-2xl border-t border-white/10 p-6 md:p-8 sticky bottom-0 z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-[1.5rem] flex items-center justify-center text-emerald-500 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase italic tracking-widest">Status: Mission_Live</p>
              <p className="text-xs font-bold text-slate-400 italic">Complete o desafio para registrar seu progresso no neural_net.</p>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="w-full md:w-auto bg-redhouse-primary text-white px-20 py-6 rounded-[2.5rem] font-black text-2xl uppercase italic shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:shadow-[0_10px_50px_rgba(239,68,68,0.6)] transition-all flex items-center justify-center gap-4 border border-white/20"
          >
            <Trophy className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            Finalizar Protocolo
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
            onClose={() => {
              audio.playClick();
              setShowNpc(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
