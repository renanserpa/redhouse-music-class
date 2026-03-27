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

  return (
    <div className="flex flex-col items-center gap-10 p-10 max-w-3xl mx-auto bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="text-center relative z-10 w-full mb-4">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Dominó Rítmico
        </h2>
        <div className="flex items-center justify-center gap-4 text-slate-400 font-bold uppercase italic tracking-widest text-xs">
          <span>Associe as Figuras</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="text-redhouse-primary">Sincronia: {score}/5</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' ? (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full flex flex-col items-center gap-10"
          >
            {currentFigure && (
              <motion.div
                key={currentFigure.id}
                className="w-64 h-64 bg-black/40 backdrop-blur-md rounded-[3.5rem] shadow-2xl flex items-center justify-center border border-white/10 relative group/card overflow-hidden"
              >
                {/* Visual Pulse */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-500 rounded-full blur-3xl pointer-events-none"
                />
                
                <span className="text-[10rem] text-white group-hover/card:scale-110 transition-transform relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] font-serif">
                  {currentFigure.icon}
                </span>
                
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute inset-0 rounded-[3.4rem] flex items-center justify-center backdrop-blur-xl z-20 ${
                        feedback === 'correct' ? 'bg-emerald-500/20' : 'bg-redhouse-primary/20'
                      }`}
                    >
                      {feedback === 'correct' ? (
                        <CheckCircle2 className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]" />
                      ) : (
                        <XCircle className="w-32 h-32 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-6 w-full relative z-10">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(option)}
                  disabled={!!feedback}
                  className="p-10 bg-black/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 hover:bg-white/5 transition-all flex flex-col items-center gap-2 shadow-2xl group/btn"
                >
                  <span className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover/btn:text-blue-400 transition-colors">
                    {option.name}
                  </span>
                  <div className="flex items-center gap-3 text-white/30">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                      {option.duration} {option.duration === 1 ? 'Tempo' : 'Tempos'}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center relative z-10"
          >
            <div className="w-32 h-32 bg-yellow-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <Trophy className="w-16 h-16 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            </div>
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Mestre do Ritmo!</h2>
            <p className="text-xl text-slate-400 font-bold italic uppercase tracking-tight mb-10">Você decifrou todas as figuras com sincronia total.</p>
            
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-emerald-500/20 shadow-2xl">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">Recompensa Milestone</div>
              <div className="text-5xl font-black text-emerald-400 italic tracking-tighter">+40 XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex items-center gap-6 p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 relative z-10 overflow-hidden shadow-2xl">
        <div className="w-1.5 h-12 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        <p className="text-sm font-bold text-slate-400 italic leading-snug">
          <span className="text-blue-400 uppercase tracking-widest text-[10px] block mb-1">Dica do Maestro</span>
          <span className="text-white/80">A Mínima estende o som por <span className="text-emerald-400 underline decoration-emerald-500/50 decoration-2">2 pulsos completos</span>. Sinta a pulsação!</span>
        </p>
      </div>
    </div>
  );
}
