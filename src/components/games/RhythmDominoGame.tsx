import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Trophy, CheckCircle2, XCircle, Music, Clock } from 'lucide-react';

interface RhythmDominoGameProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
}

interface RhythmFigure {
  id: string;
  name: string;
  syllable: string;
  duration: number;
  icon: string; // Simple representation or SVG path
}

const FIGURES: RhythmFigure[] = [
  { id: '1', name: 'Semínima', syllable: 'Tá', duration: 1, icon: '♩' },
  { id: '2', name: 'Par de Colcheias', syllable: 'Ti-ti', duration: 1, icon: '♫' },
  { id: '3', name: 'Mínima', syllable: 'Taaa', duration: 2, icon: '𝅗𝅥' },
  { id: '4', name: 'Pausa de Semínima', syllable: 'Chiu', duration: 1, icon: '𝄽' },
];

export default function RhythmDominoGame({ onComplete, addXP }: RhythmDominoGameProps) {
  const [currentFigure, setCurrentFigure] = useState<RhythmFigure | null>(null);
  const [options, setOptions] = useState<RhythmFigure[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = () => {
    const randomFigure = FIGURES[Math.floor(Math.random() * FIGURES.length)];
    setCurrentFigure(randomFigure);
    
    // Shuffle all figures for options
    setOptions([...FIGURES].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleOptionClick = (figure: RhythmFigure) => {
    if (!currentFigure || feedback) return;

    if (figure.id === currentFigure.id) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      audio.playSuccess();
      
      if (score + 1 >= 5) {
        setGameState('finished');
        addXP(40);
        setTimeout(() => onComplete(), 2000);
      } else {
        setTimeout(() => generateRound(), 1500);
      }
    } else {
      setFeedback('wrong');
      audio.playError();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl"
        >
          <Trophy className="w-12 h-12" />
        </motion.div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic mb-2">Mestre do Ritmo!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold">Você conhece todas as figuras do dominó musical.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
          Dominó Rítmico
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Associe o nome da figura ao seu desenho! ({score}/5)
        </p>
      </div>

      {currentFigure && (
        <motion.div
          key={currentFigure.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-48 h-48 bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl flex items-center justify-center border-4 border-redhouse-primary relative group"
        >
          <span className="text-8xl text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
            {currentFigure.icon}
          </span>
          
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute inset-0 rounded-[2.8rem] flex items-center justify-center backdrop-blur-sm z-10 ${
                  feedback === 'correct' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}
              >
                {feedback === 'correct' ? (
                  <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                ) : (
                  <XCircle className="w-24 h-24 text-red-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(option)}
            className="p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-redhouse-primary transition-all flex flex-col items-center gap-2 shadow-lg"
          >
            <span className="text-lg font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              {option.name}
            </span>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {option.duration} {option.duration === 1 ? 'Tempo' : 'Tempos'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <Music className="w-5 h-5 text-blue-500" />
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 italic">
          Dica: A Mínima é a mais longa, ela vale 2 batidas do coração!
        </p>
      </div>
    </div>
  );
}
