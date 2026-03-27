import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Volume2, CheckCircle2, XCircle, Play } from 'lucide-react';

interface ElephantBirdGameProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
}

export default function ElephantBirdGame({ onComplete, addXP }: ElephantBirdGameProps) {
  const [currentSound, setCurrentSound] = useState<'grave' | 'agudo' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const targetScore = 5;

  const playSound = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    const isGrave = Math.random() > 0.5;
    const type = isGrave ? 'grave' : 'agudo';
    setCurrentSound(type);
    
    if (isGrave) {
      // Low E string
      await audio.playNote('E2');
    } else {
      // High E string
      await audio.playNote('E4');
    }
    
    setIsPlaying(false);
  };

  const handleChoice = (choice: 'grave' | 'agudo') => {
    if (!currentSound || feedback) return;

    if (choice === currentSound) {
      setFeedback('correct');
      setScore(s => s + 1);
      audio.playSuccess();
      addXP(5);
    } else {
      setFeedback('wrong');
      audio.playError();
    }

    setAttempts(a => a + 1);

    setTimeout(() => {
      setFeedback(null);
      setCurrentSound(null);
      if (score + (choice === currentSound ? 1 : 0) >= targetScore) {
        onComplete();
      } else {
        playSound();
      }
    }, 1500);
  };

  useEffect(() => {
    playSound();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-4 border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
          Detetive Sonoro: Elefante ou Passarinho?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Ouça o som e escolha o animal correto! ({score}/{targetScore})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('grave')}
          disabled={!!feedback || isPlaying}
          className={`relative p-8 rounded-3xl border-4 transition-all flex flex-col items-center gap-4 ${
            feedback === 'correct' && currentSound === 'grave' 
              ? 'border-emerald-500 bg-emerald-50' 
              : feedback === 'wrong' && currentSound === 'agudo'
              ? 'border-slate-200 opacity-50'
              : 'border-slate-100 dark:border-slate-800 hover:border-redhouse-primary bg-slate-50 dark:bg-slate-800'
          }`}
        >
          <span className="text-6xl">🐘</span>
          <span className="font-black text-xl uppercase italic tracking-tighter text-slate-900 dark:text-white">Elefante</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">(Grave)</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('agudo')}
          disabled={!!feedback || isPlaying}
          className={`relative p-8 rounded-3xl border-4 transition-all flex flex-col items-center gap-4 ${
            feedback === 'correct' && currentSound === 'agudo' 
              ? 'border-emerald-500 bg-emerald-50' 
              : feedback === 'wrong' && currentSound === 'grave'
              ? 'border-slate-200 opacity-50'
              : 'border-slate-100 dark:border-slate-800 hover:border-redhouse-primary bg-slate-50 dark:bg-slate-800'
          }`}
        >
          <span className="text-6xl">🐦</span>
          <span className="font-black text-xl uppercase italic tracking-tighter text-slate-900 dark:text-white">Passarinho</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">(Agudo)</span>
        </motion.button>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6">
        <motion.button
          animate={!currentSound && !isPlaying ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={playSound}
          disabled={isPlaying || !!currentSound}
          className="w-20 h-20 bg-redhouse-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-redhouse-primary/30 disabled:opacity-50"
        >
          {isPlaying ? (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Volume2 className="w-10 h-10" />
            </motion.div>
          ) : (
            <Play className="w-10 h-10 fill-current" />
          )}
        </motion.button>
        
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 font-black uppercase italic tracking-tighter text-lg ${
                feedback === 'correct' ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {feedback === 'correct' ? (
                <><CheckCircle2 className="w-6 h-6" /> Mandou bem!</>
              ) : (
                <><XCircle className="w-6 h-6" /> Quase lá!</>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
