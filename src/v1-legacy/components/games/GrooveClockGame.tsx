import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Play, RotateCcw, CheckCircle2, XCircle, Zap } from 'lucide-react';

interface GrooveClockGameProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
}

export default function GrooveClockGame({ onComplete, addXP }: GrooveClockGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [beatCount, setBeatCount] = useState(0);
  
  const lastBeatTime = useRef<number>(0);
  const targetScore = 10;
  const tolerance = 150; // ms

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const msPerBeat = (60 / bpm) * 1000;
      interval = setInterval(() => {
        const now = Date.now();
        lastBeatTime.current = now;
        setBeatCount(b => (b % 4) + 1);
        audio.playClick(beatCount === 4); // Accent on 1
      }, msPerBeat);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm, beatCount]);

  const handleTap = () => {
    if (!isPlaying) return;

    const now = Date.now();
    const msPerBeat = (60 / bpm) * 1000;
    const diff = Math.abs(now - lastBeatTime.current);
    const nextDiff = Math.abs(now - (lastBeatTime.current + msPerBeat));
    const minDiff = Math.min(diff, nextDiff);

    setAttempts(a => a + 1);

    if (minDiff < 80) {
      setFeedback('perfect');
      setScore(s => s + 1);
      addXP(5);
      audio.playSuccess();
    } else if (minDiff < tolerance) {
      setFeedback('good');
      setScore(s => s + 0.5);
      addXP(2);
    } else {
      setFeedback('miss');
      audio.playError();
    }

    setTimeout(() => setFeedback(null), 500);

    if (score >= targetScore) {
      setIsPlaying(false);
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-4 border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
          O Grande Relógio (Groove Circle)
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Siga a pulsação e clique no tempo certo! ({Math.floor(score)}/{targetScore})
        </p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-8 border-slate-100 dark:border-slate-800 rounded-full" />
        
        {/* Pulsing Circle */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              key={beatCount}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 60 / bpm, ease: "easeOut" }}
              className="absolute inset-0 bg-redhouse-primary rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Inner Circle / Tap Area */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleTap}
          disabled={!isPlaying}
          className={`relative w-48 h-48 rounded-full shadow-2xl flex flex-col items-center justify-center transition-colors z-10 ${
            isPlaying 
              ? 'bg-white dark:bg-slate-800 border-4 border-redhouse-primary' 
              : 'bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700'
          }`}
        >
          {isPlaying ? (
            <>
              <span className="text-6xl font-black italic text-redhouse-primary">{beatCount}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Clique Aqui!</span>
            </>
          ) : (
            <Play className="w-16 h-16 text-slate-400 fill-current" />
          )}
        </motion.button>

        {/* Feedback Text */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.5 }}
              animate={{ opacity: 1, y: -80, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className={`absolute top-0 font-black uppercase italic tracking-tighter text-2xl z-20 ${
                feedback === 'perfect' ? 'text-yellow-500' : feedback === 'good' ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {feedback === 'perfect' ? 'PERFEITO!' : feedback === 'good' ? 'BOM!' : 'ERROU!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex flex-col items-center gap-6 w-full">
        {!isPlaying ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(true)}
            className="w-full py-4 bg-redhouse-primary text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-lg shadow-redhouse-primary/30"
          >
            Começar Desafio
          </motion.button>
        ) : (
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-center">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BPM</span>
              <span className="text-2xl font-black italic text-slate-900 dark:text-white">{bpm}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(false)}
              className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400"
            >
              <RotateCcw className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-black text-yellow-500">Mantenha o ritmo para ganhar XP!</span>
        </div>
      </div>
    </div>
  );
}
