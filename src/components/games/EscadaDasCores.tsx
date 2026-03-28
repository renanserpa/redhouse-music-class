/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * A Escada das Cores (Maestro Colors) — Mundo 2, Reino das Notas
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Music, RotateCcw, CheckCircle, Star } from 'lucide-react';

interface EscadaDasCoresProps {
  addXP: (amount: number) => void;
  onComplete: () => void;
}

const NOTES = [
  { name: 'Dó', letter: 'C', color: '#ef4444', textColor: 'text-white', freq: 262 },
  { name: 'Ré', letter: 'D', color: '#f97316', textColor: 'text-white', freq: 294 },
  { name: 'Mi', letter: 'E', color: '#eab308', textColor: 'text-white', freq: 330 },
  { name: 'Fá', letter: 'F', color: '#22c55e', textColor: 'text-white', freq: 349 },
  { name: 'Sol', letter: 'G', color: '#06b6d4', textColor: 'text-white', freq: 392 },
  { name: 'Lá', letter: 'A', color: '#3b82f6', textColor: 'text-white', freq: 440 },
  { name: 'Si', letter: 'B', color: '#ec4899', textColor: 'text-white', freq: 494 },
];

// 4 steps in the scale have blanks; the student must place them
const MISSING_INDICES = [1, 3, 5, 2]; // Ré, Fá, Lá, Mi (shuffled order for drag shelf)

export default function EscadaDasCores({ addXP, onComplete }: EscadaDasCoresProps) {
  const [slots, setSlots] = useState<(number | null)[]>(Array(7).fill(null).map((_, i) =>
    MISSING_INDICES.includes(i) ? null : i
  ));
  const [shelf, setShelf] = useState<number[]>([...MISSING_INDICES].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<'playing' | 'complete'>('playing');
  const [feedback, setFeedback] = useState<{ slot: number; correct: boolean } | null>(null);

  const handleShelfClick = (noteIdx: number) => {
    audio.playTone(NOTES[noteIdx].freq, '8n');
    setSelected(noteIdx);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (selected === null) return;
    if (slots[slotIdx] !== null) return; // already filled

    const isCorrect = selected === slotIdx;
    setFeedback({ slot: slotIdx, correct: isCorrect });

    if (isCorrect) {
      audio.playSuccess();
      const newSlots = [...slots];
      newSlots[slotIdx] = selected;
      const newShelf = shelf.filter(n => n !== selected);
      setSlots(newSlots);
      setShelf(newShelf);
      setSelected(null);
      addXP(10);

      if (newShelf.length === 0) {
        setTimeout(() => {
          setPhase('complete');
          audio.playLevelUp();
          addXP(30); // bonus
          if (onComplete) onComplete();
        }, 1200);
      }
    } else {
      audio.playError();
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
      }, 700);
    }
  };

  const reset = () => {
    setSlots(Array(7).fill(null).map((_, i) => MISSING_INDICES.includes(i) ? null : i));
    setShelf([...MISSING_INDICES].sort(() => Math.random() - 0.5));
    setSelected(null);
    setPhase('playing');
    setFeedback(null);
  };

  const filled = slots.filter(s => s !== null).length;
  const progress = (filled / 7) * 100;

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] rotate-3 border-2 border-cyan-400">
            <Music className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">A Escada das Cores</h3>
            <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">Maestro Color System · Mundo 2</p>
          </div>
        </div>
        
        <div className="bg-slate-900 px-6 py-3 rounded-2xl border-2 border-slate-800 flex items-center gap-4 shadow-xl">
          <div className="flex gap-1.5">
            {Array(7).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-all ${slots[i] !== null ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-700'}`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-cyan-500">{filled}/7</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'playing' ? (
          <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10 relative z-10">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-2xl text-center">
              <p className="text-slate-400 font-bold italic text-sm">Escaneie a nota na prateleira e complete a sequência correta na escada!</p>
            </div>

            {/* The Staircase */}
            <div className="flex flex-col gap-3 max-w-xl mx-auto py-4">
              {NOTES.slice().reverse().map((note, revIdx) => {
                const i = 6 - revIdx;
                const noteInSlot = slots[i];
                const hasNote = noteInSlot !== null;
                const isEmpty = !hasNote && MISSING_INDICES.includes(i);
                const isFeedback = feedback?.slot === i;

                return (
                  <motion.div
                    key={i}
                    style={{ marginLeft: `${i * 32}px` }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-[10px] font-black text-slate-600 w-8 text-right font-mono uppercase">IDX 0{i}</span>

                    <motion.button
                      whileHover={isEmpty && selected !== null ? { scale: 1.05, x: 5 } : {}}
                      whileTap={isEmpty && selected !== null ? { scale: 0.95 } : {}}
                      onClick={() => isEmpty && handleSlotClick(i)}
                      className={`
                        h-16 rounded-2xl flex items-center justify-between px-6 font-black text-xl transition-all border-4 relative overflow-hidden group
                        ${hasNote
                          ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          : isFeedback && feedback?.correct
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : isFeedback && !feedback?.correct
                          ? 'border-rose-500 bg-rose-500/20 animate-shake'
                          : selected !== null
                          ? 'border-dashed border-cyan-500/50 bg-cyan-500/5 cursor-pointer hover:bg-cyan-500/20'
                          : 'border-dashed border-slate-800 bg-slate-900/50'
                        }
                      `}
                      style={{
                        width: `${260 - i * 15}px`,
                        backgroundColor: hasNote ? NOTES[noteInSlot].color : undefined
                      }}
                    >
                      {hasNote ? (
                        <>
                          <span className="text-white drop-shadow-md flex items-center gap-2">
                            {NOTES[noteInSlot].name}
                            <span className="opacity-40 text-sm font-black">{NOTES[noteInSlot].letter}</span>
                          </span>
                          <span className="text-[10px] opacity-50 font-mono">{NOTES[noteInSlot].freq}HZ</span>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                           <div className="text-xl font-black italic tracking-tighter">LOCKED</div>
                        </div>
                      )}
                      
                      {/* Scanning Line only visible on correct slot */}
                      {isFeedback && feedback?.correct && (
                        <motion.div 
                          animate={{ x: [-200, 400] }}
                          className="absolute inset-0 bg-white/20 blur-md pointer-events-none"
                        />
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Shelf — draggable notes */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 text-center">Data Repository</p>
              <div className="flex flex-wrap justify-center gap-6">
                <AnimatePresence>
                  {shelf.map(noteIdx => (
                    <motion.button
                      key={noteIdx}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1, y: -8, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShelfClick(noteIdx)}
                      className={`
                        w-24 h-24 rounded-[2rem] font-black text-white text-2xl shadow-2xl border-4 transition-all flex flex-col items-center justify-center relative group/shelf
                        ${selected === noteIdx ? 'border-white scale-110 shadow-cyan-500/20' : 'border-white/10 hover:border-white/40'}
                      `}
                      style={{ 
                        backgroundColor: NOTES[noteIdx].color,
                        boxShadow: selected === noteIdx ? `0 0 30px ${NOTES[noteIdx].color}44` : ''
                      }}
                    >
                      <span className="drop-shadow-lg">{NOTES[noteIdx].name}</span>
                      <span className="text-sm opacity-50 font-black tracking-widest">{NOTES[noteIdx].letter}</span>
                      
                      {selected === noteIdx && (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                          className="absolute -inset-2 border-2 border-dashed border-white/50 rounded-[2.2rem]"
                        />
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={reset} className="flex items-center gap-2 text-slate-600 hover:text-cyan-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border border-slate-800 rounded-full">
                <RotateCcw className="w-3 h-3" /> Reset Sequence
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-12 relative z-10">
            <div className="relative inline-block">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }} className="w-48 h-48 border-4 border-dashed border-cyan-500/20 rounded-full absolute -inset-4"></motion.div>
               <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl">🚀</motion.div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-5xl font-black uppercase italic text-white tracking-tighter [text-shadow:_0_0_30px_rgba(255,255,255,0.3)]">Escala Sincronizada!</h4>
              <p className="text-slate-400 font-bold text-lg italic">O código secreto do Mundo 2 foi decifrado com sucesso!</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-emerald-500/10 border-2 border-emerald-500/50 w-fit mx-auto px-8 py-4 rounded-[2rem]">
              <Star className="w-8 h-8 text-emerald-500 fill-emerald-500 ring-4 ring-emerald-500/20 rounded-full" />
              <span className="font-black text-emerald-500 text-3xl italic tracking-tighter">+40 XP</span>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={reset}
              className="bg-white text-slate-950 px-12 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-cyan-50 transition-colors">
              Reiniciar Protocolo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
