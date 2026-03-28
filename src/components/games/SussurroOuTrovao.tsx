/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sussurro ou Trovão — Mundo 3, Montanha do Ritmo
 * Dinâmica: Forte (Trovão) vs Fraco (Sussurro)
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { RotateCcw, CheckCircle, Volume2, VolumeX, Trophy, Music, Play, Wind, Zap } from 'lucide-react';

interface SussurroOuTrovaoProps {
  addXP: (amount: number) => void;
  onComplete: () => void;
}

type Dynamic = 'forte' | 'fraco';

interface Round {
  scenario: string;
  emoji: string;
  correct: Dynamic;
  instruction: string;
}

const ROUNDS: Round[] = [
  { scenario: 'Um trovão rasgando o céu!', emoji: '⛈️', correct: 'forte', instruction: 'Toque FORTE para quebrar o bloco de pedra!' },
  { scenario: 'Um bebê dormindo na sala...', emoji: '👶', correct: 'fraco', instruction: 'Toque FRACO para não acordar o bebê!' },
  { scenario: 'Um leão rugindo na savana!', emoji: '🦁', correct: 'forte', instruction: 'Toque FORTE como o rugido do leão!' },
  { scenario: 'Uma borboleta pousando na flor...', emoji: '🦋', correct: 'fraco', instruction: 'Toque FRACO como o bater das asas!' },
  { scenario: 'Um foguete decolando!', emoji: '🚀', correct: 'forte', instruction: 'Toque FORTE como os motores do foguete!' },
  { scenario: 'Um rato andando na ponta dos pés...', emoji: '🐭', correct: 'fraco', instruction: 'Toque FRACO como o passinhos do ratinho!' },
  { scenario: 'Uma explosão de palmas no show!', emoji: '👏', correct: 'forte', instruction: 'Toque FORTE como a plateia aplaudindo!' },
  { scenario: 'Uma estrela cadente passando...', emoji: '🌠', correct: 'fraco', instruction: 'Toque FRACO como um desejo sussurrado!' },
];

export default function SussurroOuTrovao({ addXP, onComplete }: SussurroOuTrovaoProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; dynamic: Dynamic } | null>(null);
  const [phase, setPhase] = useState<'playing' | 'complete'>('playing');
  const [isPressed, setIsPressed] = useState<Dynamic | null>(null);

  const round = ROUNDS[currentRound];

  const handlePress = useCallback((dynamic: Dynamic) => {
    if (feedback !== null) return;

    setIsPressed(dynamic);
    const isCorrect = dynamic === round.correct;
    setFeedback({ correct: isCorrect, dynamic });

    if (isCorrect) {
      audio.playSuccess();
      addXP(10);
      setScore(s => s + 1);
    } else {
      audio.playError();
    }

    setTimeout(() => {
      setFeedback(null);
      setIsPressed(null);
      const next = currentRound + 1;
      if (next >= ROUNDS.length) {
        setPhase('complete');
        audio.playLevelUp();
        addXP(35);
        onComplete();
      } else {
        setCurrentRound(next);
      }
    }, 1200);
  }, [feedback, round, currentRound, addXP, onComplete]);

  const reset = () => {
    setCurrentRound(0);
    setScore(0);
    setFeedback(null);
    setPhase('playing');
    setIsPressed(null);
  };

  const accuracy = ROUNDS.length > 0 ? Math.round((score / ROUNDS.length) * 100) : 0;

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%]" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] -rotate-3 border-2 border-amber-400">
            <Volume2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Sussurro ou Trovão?</h3>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Protocolo de Dinâmica · Mundo 3</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-xl">
             <div className="text-right">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sync Score</p>
                <p className="text-2xl font-black text-amber-500 font-mono italic leading-none">{score}/{ROUNDS.length}</p>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <Trophy className="w-6 h-6 text-amber-500 fill-amber-500/20" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'playing' ? (
          <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 relative z-10">
            {/* Progress HUD */}
            <div className="flex items-center gap-6">
              <div className="flex-1 bg-black/40 rounded-full h-4 border border-white/5 overflow-hidden p-1 shadow-inner">
                <motion.div
                  animate={{ width: `${(currentRound / ROUNDS.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0:15px_rgba(245,158,11,0.5)]"
                />
              </div>
              <div className="bg-black/40 px-4 py-1 rounded-full border border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest font-mono">
                SIGNAL_ID: 0{currentRound + 1} / 0{ROUNDS.length}
              </div>
            </div>

            {/* Scenario Card HUD */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRound}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className={`rounded-[3rem] p-12 text-center border transition-all shadow-2xl relative overflow-hidden backdrop-blur-md ${
                    feedback?.correct ? 'border-emerald-500/50 bg-emerald-500/5' :
                    feedback && !feedback.correct ? 'border-redhouse-primary/50 bg-redhouse-primary/5' :
                    'border-white/10 bg-black/40'
                  }`}
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="text-9xl mb-10 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    {round.emoji}
                  </motion.div>
                  <h4 className="text-4xl font-black text-white italic mb-4 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{round.scenario}</h4>
                  <p className="text-slate-400 font-bold text-xl italic mb-10">{round.instruction}</p>

                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1.1, opacity: 1, y: 0 }}
                        className={`absolute inset-0 flex items-center justify-center backdrop-blur-xl rounded-[2.8rem] z-20`}
                      >
                         <div className={`px-12 py-6 rounded-[2rem] font-black uppercase text-3xl shadow-2xl border-2 ${
                            feedback.correct ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-redhouse-primary text-white border-rose-400'
                          }`}>
                           {feedback.correct ? '√ PROTOCOLO OK' : '✗ ERRO DE SINAL'}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* HUD Elements Overlay */}
                  <div className="absolute top-6 left-8 text-[10px] font-black text-white/10 uppercase tracking-[0.2em] italic">Acoustic_Sensor_Active</div>
                  <div className="absolute bottom-6 right-8 text-[10px] font-black text-white/10 uppercase tracking-[0.2em] italic">Mundo_3_Core</div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dynamic Interactive Selectors */}
            <div className="grid grid-cols-2 gap-8 relative">
              {[
                { type: 'forte', label: 'FORTE (Trovão)', icon: '⛈️', color: 'bg-amber-600', hoverColor: 'hover:border-amber-500/50 hover:bg-amber-500/10' },
                { type: 'fraco', label: 'FRACO (Sussurro)', icon: '🌙', color: 'bg-cyan-600', hoverColor: 'hover:border-cyan-500/50 hover:bg-cyan-500/10' }
              ].map((btn) => (
                <motion.button
                  key={btn.type}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onPointerDown={() => handlePress(btn.type as 'forte' | 'fraco')}
                  disabled={feedback !== null}
                  className={`
                    flex flex-col items-center justify-center gap-6 p-12 rounded-[3.5rem] border-2 transition-all shadow-2xl font-black relative group overflow-hidden
                    ${isPressed === btn.type
                      ? `${btn.color} border-white text-white scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)]`
                      : `bg-black/40 border-white/5 ${btn.hoverColor}`
                    }
                    ${feedback !== null ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
                  `}
                >
                  <span className="text-8xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{btn.icon}</span>
                  <div className="text-center relative z-10">
                    <p className={`text-4xl font-black uppercase italic tracking-tighter ${isPressed === btn.type ? 'text-white' : 'text-white/80'}`}>{btn.label.split(' ')[0]}</p>
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic ${isPressed === btn.type ? 'text-white/60' : 'text-white/20'}`}>{btn.label.split(' ')[1]}</p>
                  </div>
                  
                  {/* Decorative Scanlines per button */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <button onClick={reset} className="flex items-center gap-3 text-white/20 hover:text-amber-500 transition-colors text-[10px] font-black uppercase tracking-[0.4em] py-3 px-8 bg-black/40 rounded-full border border-white/5 backdrop-blur-md italic">
                <RotateCcw className="w-3 h-3" /> Reset Session
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-12 relative z-10">
            <div className="relative inline-block">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} className="w-64 h-64 border-2 border-dashed border-white/20 rounded-full absolute -inset-8"></motion.div>
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl filter drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                 🏆
               </motion.div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-6xl font-black uppercase italic text-white tracking-tighter [text-shadow:_0_0_30px_rgba(255,255,255,0.2)]">Percepção Calibrada!</h4>
              <p className="text-slate-400 font-bold text-2xl italic tracking-tight">{score}/{ROUNDS.length} acertos · Sincronia Total de {accuracy}%</p>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/30 w-fit mx-auto px-12 py-8 rounded-[3rem] shadow-2xl backdrop-blur-md group/xp">
              <div className="flex items-center gap-6">
                <Trophy className="w-12 h-12 text-emerald-500 group-hover/xp:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.3em] leading-none mb-2">Milestone Reward</p>
                  <p className="font-black text-emerald-400 text-5xl italic tracking-tighter leading-none">+45 XP</p>
                </div>
              </div>
            </div>
            
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={reset}
              className="bg-white text-slate-950 px-16 py-7 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-amber-50 transition-colors">
              Iniciar Novo Ciclo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
