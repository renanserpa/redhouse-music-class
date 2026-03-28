/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Dança da Mão Direita (PIMA) — Mundo 4, Floresta dos Acordes
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Hand, Star, RotateCcw, CheckCircle, Zap } from 'lucide-react';

interface DancaMaoDireitaProps {
  addXP: (amount: number) => void;
  onComplete: () => void;
}

const FINGERS = [
  { key: 'P', name: 'Polegar', string: '6ª/5ª corda', color: 'bg-orange-500', glow: 'shadow-orange-500/50' },
  { key: 'I', name: 'Indicador', string: '3ª corda', color: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  { key: 'M', name: 'Médio', string: '2ª corda', color: 'bg-emerald-500', glow: 'shadow-emerald-500/50' },
  { key: 'A', name: 'Anelar', string: '1ª corda', color: 'bg-rose-500', glow: 'shadow-rose-500/50' },
];

interface FallingNote {
  id: number;
  fingerIndex: number;
  y: number;
  speed: number;
}

const SEQUENCES = [
  [0, 2, 1, 3],
  [0, 1, 2, 3],
  [0, 3, 1, 2],
  [0, 2, 3, 1],
];

export default function DancaMaoDireita({ addXP, onComplete }: DancaMaoDireitaProps) {
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [combo, setCombo] = useState(0);
  const [pressedKey, setPressedKey] = useState<number | null>(null);

  const targetRounds = SEQUENCES.length;
  const currentSequence = SEQUENCES[currentRound] || SEQUENCES[0];
  const expectedFinger = currentSequence[currentStep];

  const handleFingerPress = useCallback((fingerIndex: number) => {
    if (phase !== 'playing' || feedback !== null) return;

    setPressedKey(fingerIndex);
    setTimeout(() => setPressedKey(null), 200);

    if (fingerIndex === expectedFinger) {
      audio.playSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setFeedback('correct');
      addXP(newCombo >= 4 ? 10 : 5);

      setTimeout(() => {
        setFeedback(null);
        const nextStep = currentStep + 1;
        if (nextStep >= currentSequence.length) {
          const nextRound = currentRound + 1;
          if (nextRound >= targetRounds) {
            setPhase('complete');
            audio.playLevelUp();
            addXP(30);
            onComplete();
          } else {
            setScore(s => s + 10);
            setCurrentRound(nextRound);
            setCurrentStep(0);
          }
        } else {
          setCurrentStep(nextStep);
        }
      }, 400);
    } else {
      audio.playError();
      setCombo(0);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  }, [phase, feedback, expectedFinger, combo, currentStep, currentRound, currentSequence, targetRounds, addXP, onComplete]);

  const reset = () => {
    setScore(0);
    setCurrentRound(0);
    setCurrentStep(0);
    setFeedback(null);
    setCombo(0);
    setPhase('intro');
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%]" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(225,29,72,0.4)] -rotate-3 border-2 border-rose-400">
            <Hand className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Dança da Mão Direita</h3>
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Protocolo P-I-M-A · Mundo 4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-xl">
             <div className="text-right">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sync Score</p>
                <p className="text-2xl font-black text-amber-500 font-mono italic leading-none">{score}</p>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <Star className="w-6 h-6 text-amber-500 fill-amber-500/20" />
          </div>

          <AnimatePresence>
            {combo >= 2 && (
              <motion.div
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: 20 }}
                className="bg-rose-600/20 text-rose-500 px-5 py-3 rounded-2xl border border-rose-500/30 font-black italic flex items-center gap-2 shadow-lg backdrop-blur-md"
              >
                <Zap className="w-5 h-5 animate-pulse" />
                <span>x{combo} COMBO!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center space-y-10 py-12 relative z-10">
            <div className="relative inline-block">
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl filter drop-shadow-[0_0_30px_rgba(225,29,72,0.3)]">🤚</motion.div>
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 px-4 py-1 rounded-full border border-white/10 text-[10px] font-black text-rose-500 uppercase tracking-widest backdrop-blur-md">Mão Direita</div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-5xl font-black uppercase italic text-white tracking-tighter">P — I — M — A</h4>
              <p className="text-slate-400 font-bold text-lg italic max-w-md mx-auto leading-relaxed">Cada dedo tem uma corda designada. Sincronize seus movimentos com a sequência rítmica!</p>
            </div>

            <div className="flex justify-center flex-wrap gap-6">
              {FINGERS.map(f => (
                <div key={f.key} className="flex flex-col items-center gap-3">
                  <div className={`w-20 h-20 ${f.color} rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl border-2 border-white/20`}>{f.key}</div>
                  <div className="text-center">
                    <p className="text-xs font-black text-white uppercase italic tracking-tighter">{f.name}</p>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1 italic">{f.string}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { audio.playStart(); setPhase('playing'); }}
              className="bg-white text-slate-950 px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.2)] text-xl hover:bg-rose-50 transition-colors"
            >
              🎸 Iniciar Protocolo
            </motion.button>
          </motion.div>
        )}

        {phase === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10 relative z-10">
            {/* Progress Bar HUD */}
            <div className="flex items-center gap-6">
              <div className="flex-1 bg-black/40 rounded-full h-4 border border-white/5 overflow-hidden p-1 shadow-inner">
                <motion.div
                  animate={{ width: `${((currentRound * 4 + currentStep) / (targetRounds * 4)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                />
              </div>
              <div className="bg-black/40 px-4 py-1 rounded-full border border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest font-mono">
                ROUND_ID: 0{currentRound + 1} / 0{targetRounds}
              </div>
            </div>

            {/* Sequence Viewer HUD */}
            <div className="bg-black/40 backdrop-blur-md rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent"></div>
              <div className="flex justify-center gap-6">
                {currentSequence.map((fi, si) => (
                  <motion.div 
                    key={si}
                    animate={si === currentStep ? { scale: [1, 1.15, 1], y: [0, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className={`w-20 h-24 rounded-[1.5rem] flex flex-col items-center justify-center font-black text-3xl transition-all border-2 ${
                      si < currentStep ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                      si === currentStep ? `${FINGERS[fi].color} border-white text-white shadow-[0_0_30px_rgba(255,255,255,0.3)]` :
                      'bg-slate-900 border-white/5 text-white/20'
                    }`}
                  >
                    {FINGERS[fi].key}
                    {si === currentStep && (
                      <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-2 h-2 bg-white rounded-full mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic">Sequência Digital</p>
              </div>
            </div>

            {/* Finger Controller Interface */}
            <div className="grid grid-cols-4 gap-6 relative">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="absolute -top-16 inset-x-0 flex justify-center z-20 pointer-events-none"
                  >
                    <div className={`px-10 py-4 rounded-full font-black uppercase text-2xl text-white shadow-2xl backdrop-blur-xl border-2 ${
                      feedback === 'correct' ? 'bg-emerald-500/80 border-emerald-400 shadow-emerald-500/20' : 'bg-redhouse-primary/80 border-rose-400 shadow-redhouse-primary/20'
                    }`}>
                      {feedback === 'correct' ? '√ SYNC OK' : '× ERR_INPUT'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {FINGERS.map((f, i) => (
                <motion.button
                  key={f.key}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleFingerPress(i)}
                  className={`
                    aspect-[4/5] rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border-2 shadow-2xl transition-all relative overflow-hidden group/btn backdrop-blur-md
                    ${pressedKey === i ? `${f.color} border-white scale-95 shadow-[0_0_40px_rgba(255,255,255,0.5)]` : 
                      i === expectedFinger ? `bg-black/60 border-rose-500/50 ${f.color.replace('bg-', 'text-')} ring-4 ring-rose-500/10` :
                      'bg-black/40 border-white/5 text-white/20'}
                  `}
                >
                  <span className={`text-6xl font-black italic tracking-tighter ${pressedKey === i ? 'text-white' : i === expectedFinger ? 'text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'text-slate-800'}`}>{f.key}</span>
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${pressedKey === i ? 'text-white' : 'text-white/20'}`}>{f.name}</p>
                    <p className={`text-[8px] font-bold uppercase opacity-60 mt-0.5 ${pressedKey === i ? 'text-white/60' : 'text-white/10'}`}>{f.string}</p>
                  </div>
                  
                  {i === expectedFinger && pressedKey !== i && (
                    <motion.div 
                      animate={{ borderOpacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 border-2 border-rose-500/30 rounded-[2.3rem] pointer-events-none"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center">
              <button onClick={reset} className="flex items-center gap-3 text-white/20 hover:text-rose-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 bg-black/40 rounded-full border border-white/5 backdrop-blur-md italic">
                <RotateCcw className="w-3 h-3" /> Abort Session
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-12 relative z-10">
            <div className="relative inline-block">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }} className="w-64 h-64 border-4 border-dashed border-rose-500/20 rounded-full absolute -inset-8"></motion.div>
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl filter drop-shadow-[0_0_40px_rgba(225,29,72,0.4)]">🏆</motion.div>
            </div>

            <div className="space-y-4">
              <h4 className="text-6xl font-black uppercase italic text-white tracking-tighter [text-shadow:_0_0_30px_rgba(225,29,72,0.3)]">Protocolo P-I-M-A Dominado!</h4>
              <p className="text-slate-400 font-bold text-xl italic max-w-md mx-auto leading-relaxed">Sua coordenação motora atingiu níveis de elite. Mundo 4 em sincronia!</p>
            </div>

            <div className="flex items-center justify-center gap-4 bg-emerald-500/10 border border-emerald-500/30 w-fit mx-auto px-10 py-6 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
              <Star className="w-10 h-10 text-emerald-500 fill-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
              <div className="text-left">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-2 italic">XP Reward</p>
                <p className="font-black text-emerald-500 text-5xl italic tracking-tighter leading-none">+80 XP</p>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={reset}
              className="bg-white text-slate-950 px-16 py-7 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:bg-rose-50 transition-colors">
              Reiniciar Ciclo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
