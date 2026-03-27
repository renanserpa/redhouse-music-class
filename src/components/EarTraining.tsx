/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Ear, Music, Play, CheckCircle2, XCircle, Volume2 } from 'lucide-react';

interface EarTrainingProps {
  addXP: (amount: number) => void;
}

export default function EarTraining({ addXP }: EarTrainingProps) {
  const [currentSoundType, setCurrentSoundType] = useState<'grave' | 'agudo' | null>(null);
  const [feedback, setFeedback] = useState("Ouça o som e diga: é um elefante ou passarinho?");
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const playTestSound = () => {
    setIsPlaying(true);
    setStatus('idle');
    const isGrave = Math.random() > 0.5;
    setCurrentSoundType(isGrave ? 'grave' : 'agudo');
    
    if (isGrave) {
      audio.playTone(110, '4n'); // Low A
    } else {
      audio.playTone(880, '4n'); // High A
    }
    
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const checkEar = (choice: 'grave' | 'agudo') => {
    if (!currentSoundType) {
      setFeedback("Primeiro, toque o som secreto! 🎵");
      return;
    }

    if (choice === currentSoundType) {
      setFeedback("BOOOA! Você tem ouvido de detetive! +10 XP");
      setStatus('correct');
      audio.playSuccess();
      addXP(10);
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setFeedback("Quase! Tente ouvir de novo...");
      setStatus('wrong');
      audio.playError();
      setTimeout(() => setStatus('idle'), 1500);
    }
    setCurrentSoundType(null);
  };

  return (
    <section className="bg-slate-950 rounded-[40px] p-8 shadow-2xl border-4 border-slate-900 relative overflow-hidden text-white">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%] opacity-10"></div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg -rotate-3 border-2 border-slate-700">
          <Ear className="w-8 h-8 text-cyan-500" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Missão: Detetive Sônico</h3>
          <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">Mapeamento de Frequência</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-10 items-center relative z-10">
        <div className="relative">
          <motion.div 
            animate={{ 
              scale: isPlaying ? [1, 1.1, 0.9, 1.05, 1] : 1,
              backgroundColor: isPlaying ? '#0f172a' : '#1e293b'
            }}
            className="w-36 h-36 rounded-full flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-slate-800 relative z-10 overflow-hidden"
          >
            <span className="relative z-10">🎧</span>
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0.6, scale: 0.8 }}
                animate={{ opacity: 0, scale: 2.2 }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="absolute inset-0 bg-cyan-500/30 rounded-full"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(6,182,212,0.15),transparent_70%)]"></div>
          </motion.div>
          <motion.div 
            animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
            className="absolute -bottom-2 -right-2 bg-slate-900 p-3 rounded-2xl shadow-2xl border-2 border-cyan-500/30 z-20"
          >
            <Volume2 className={`w-6 h-6 ${isPlaying ? 'text-cyan-400' : 'text-slate-600'}`} />
          </motion.div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { audio.playClick(); playTestSound(); }}
          disabled={isPlaying}
          className={`w-full max-w-md py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 border-b-8 active:border-b-0 active:translate-y-2 ${
            isPlaying 
              ? 'bg-slate-800 text-slate-500 border-slate-950 opacity-50 cursor-wait' 
              : 'bg-slate-900 text-white border-slate-950 hover:bg-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.3)]'
          }`}
        >
          <Play className={`w-7 h-7 ${isPlaying ? '' : 'fill-cyan-400 text-cyan-400'}`} />
          {isPlaying ? 'ANALISANDO...' : 'REPRODUZIR SINAL'}
        </motion.button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <motion.button 
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => checkEar('grave')}
            className={`group bg-slate-900 border-4 p-10 rounded-[4rem] transition-all shadow-xl flex flex-col items-center gap-6 relative overflow-hidden ${
              status === 'correct' && currentSoundType === 'grave' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 
              status === 'wrong' && currentSoundType === 'grave' ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'border-slate-800 hover:border-orange-500/50'
            }`}
          >
            <div className="text-8xl group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">🐘</div>
            <div className="text-center">
              <span className="block font-black text-2xl uppercase tracking-tighter italic text-white group-hover:text-orange-500 transition-colors">Grave</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 block">Low Frequency</span>
            </div>
            {status === 'correct' && currentSoundType === 'grave' && (
              <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="absolute top-6 right-6 text-emerald-400">
                <CheckCircle2 className="w-10 h-10 fill-emerald-500/20" />
              </motion.div>
            )}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => checkEar('agudo')}
            className={`group bg-slate-900 border-4 p-10 rounded-[4rem] transition-all shadow-xl flex flex-col items-center gap-6 relative overflow-hidden ${
              status === 'correct' && currentSoundType === 'agudo' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 
              status === 'wrong' && currentSoundType === 'agudo' ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]' : 'border-slate-800 hover:border-cyan-500/50'
            }`}
          >
            <div className="text-8xl group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">🐦</div>
            <div className="text-center">
              <span className="block font-black text-2xl uppercase tracking-tighter italic text-white group-hover:text-cyan-400 transition-colors">Agudo</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 block">High Frequency</span>
            </div>
            {status === 'correct' && currentSoundType === 'agudo' && (
              <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="absolute top-6 right-6 text-emerald-400">
                <CheckCircle2 className="w-10 h-10 fill-emerald-500/20" />
              </motion.div>
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={feedback}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl text-center border-4 text-sm ${
              status === 'correct' ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]' :
              status === 'wrong' ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.3)]' :
              'bg-slate-900 text-cyan-400 border-slate-800'
            }`}
          >
            {feedback}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
