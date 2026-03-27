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
      audio.playTone(110, 'sine', 1, 0.5); // Low A
    } else {
      audio.playTone(880, 'sine', 0.5, 0.4); // High A
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
    <section className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
          <Ear className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black uppercase italic">Missão 2: Detetive de Ouvido</h3>
      </div>
      <p className="text-slate-500 font-bold mb-8 italic">Ouça o som e diga: é um elefante (Grave) ou passarinho (Agudo)?</p>
      
      <div className="flex flex-col gap-8 items-center">
        <div className="relative">
          <motion.div 
            animate={{ 
              scale: isPlaying ? [1, 1.1, 1] : 1,
              rotate: isPlaying ? [0, -5, 5, 0] : 0
            }}
            className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-6xl shadow-inner border-4 border-white relative z-10"
          >
            👦🏻
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute inset-0 bg-blue-400 rounded-full"
              />
            )}
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border-2 border-slate-900 z-20">
            <Volume2 className={`w-6 h-6 ${isPlaying ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
        </div>

        <button 
          onClick={playTestSound}
          disabled={isPlaying}
          className={`w-full max-w-md py-6 rounded-3xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 border-4 ${
            isPlaying 
              ? 'bg-slate-200 text-slate-400 border-slate-300 scale-95' 
              : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 active:scale-95'
          }`}
        >
          <Play className={`w-6 h-6 ${isPlaying ? '' : 'fill-white'}`} />
          {isPlaying ? 'Ouvindo...' : 'Tocar Som Secreto'}
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => checkEar('grave')}
            className={`group bg-white border-4 p-8 rounded-[40px] transition-all shadow-lg flex flex-col items-center gap-4 relative overflow-hidden ${
              status === 'correct' && currentSoundType === 'grave' ? 'border-emerald-500 bg-emerald-50' : 
              status === 'wrong' && currentSoundType === 'grave' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-amber-400'
            }`}
          >
            <div className="text-7xl group-hover:scale-110 transition-transform">🐘</div>
            <span className="font-black text-lg uppercase tracking-widest text-slate-400 group-hover:text-amber-500">Grave</span>
            {status === 'correct' && currentSoundType === 'grave' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-emerald-500">
                <CheckCircle2 className="w-8 h-8 fill-white" />
              </motion.div>
            )}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => checkEar('agudo')}
            className={`group bg-white border-4 p-8 rounded-[40px] transition-all shadow-lg flex flex-col items-center gap-4 relative overflow-hidden ${
              status === 'correct' && currentSoundType === 'agudo' ? 'border-emerald-500 bg-emerald-50' : 
              status === 'wrong' && currentSoundType === 'agudo' ? 'border-red-500 bg-red-50' : 'border-slate-100 hover:border-blue-400'
            }`}
          >
            <div className="text-7xl group-hover:scale-110 transition-transform">🐦</div>
            <span className="font-black text-lg uppercase tracking-widest text-slate-400 group-hover:text-blue-500">Agudo</span>
            {status === 'correct' && currentSoundType === 'agudo' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-emerald-500">
                <CheckCircle2 className="w-8 h-8 fill-white" />
              </motion.div>
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={feedback}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg text-center border-4 ${
              status === 'correct' ? 'bg-emerald-500 text-white border-emerald-600' :
              status === 'wrong' ? 'bg-red-500 text-white border-red-600' :
              'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {feedback}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
