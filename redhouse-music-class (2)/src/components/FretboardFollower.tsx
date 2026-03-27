/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Play, SkipForward, CheckCircle2, Zap, Star } from 'lucide-react';

interface FretboardFollowerProps {
  addXP: (amount: number) => void;
}

const NOTES = [
  { string: 6, fret: 0, label: "E (Mi Grave)", color: "bg-orange-500" },
  { string: 6, fret: 1, label: "F (Fá)", color: "bg-orange-500" },
  { string: 6, fret: 3, label: "G (Sol)", color: "bg-orange-500" },
  { string: 5, fret: 0, label: "A (Lá)", color: "bg-blue-500" },
  { string: 5, fret: 2, label: "B (Si)", color: "bg-blue-500" },
  { string: 5, fret: 3, label: "C (Dó)", color: "bg-blue-500" },
  { string: 4, fret: 0, label: "D (Ré)", color: "bg-emerald-500" },
  { string: 4, fret: 2, label: "E (Mi)", color: "bg-emerald-500" },
  { string: 4, fret: 3, label: "F (Fá)", color: "bg-emerald-500" },
  { string: 3, fret: 0, label: "G (Sol)", color: "bg-purple-500" },
  { string: 3, fret: 2, label: "A (Lá)", color: "bg-purple-500" },
  { string: 2, fret: 0, label: "B (Si)", color: "bg-rose-500" },
  { string: 2, fret: 1, label: "C (Dó)", color: "bg-rose-500" },
  { string: 2, fret: 3, label: "D (Ré)", color: "bg-rose-500" },
  { string: 1, fret: 0, label: "E (Mi Agudo)", color: "bg-amber-500" },
  { string: 1, fret: 1, label: "F (Fá)", color: "bg-amber-500" },
  { string: 1, fret: 3, label: "G (Sol)", color: "bg-amber-500" },
];

export default function FretboardFollower({ addXP }: FretboardFollowerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentNote = NOTES[currentIndex];

  const nextNote = () => {
    setIsSuccess(true);
    audio.playSuccess();
    addXP(15);
    
    setTimeout(() => {
      setIsSuccess(false);
      setCurrentIndex((prev) => (prev + 1) % NOTES.length);
    }, 1500);
  };

  const playNoteSound = () => {
    setIsPlaying(true);
    // Simplified frequency mapping
    const freqs: Record<number, number> = {
      6: 82.41, 5: 110.00, 4: 146.83, 3: 196.00, 2: 246.94, 1: 329.63
    };
    const baseFreq = freqs[currentNote.string];
    const freq = baseFreq * Math.pow(2, currentNote.fret / 12);
    audio.playTone(freq, 'triangle', 1, 0.4);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <section className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-900 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black uppercase italic">Siga a Aranha no Braço</h3>
        </div>
        <div className="bg-slate-900 text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest border-2 border-slate-800">
          Nota {currentIndex + 1} / {NOTES.length}
        </div>
      </div>

      <div className="w-full max-w-4xl bg-slate-900 rounded-[40px] p-12 mb-12 relative shadow-2xl overflow-hidden border-8 border-slate-800">
        {/* Strings */}
        <div className="flex flex-col justify-between h-full absolute inset-0 py-12 px-20">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className={`h-1 w-full relative transition-colors duration-300 ${isPlaying && currentNote.string === s ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-slate-700'}`}>
              <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-slate-500 font-black text-sm">
                {['E', 'B', 'G', 'D', 'A', 'E'][s-1]}
              </span>
            </div>
          ))}
        </div>

        {/* Frets */}
        <div className="flex justify-between h-full absolute inset-0 px-20">
          {[0, 1, 2, 3, 4, 5].map((f) => (
            <div key={f} className="w-1 bg-slate-800 h-full relative">
              {f > 0 && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-600 font-black text-xs">
                  {f}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* The Spider (Current Note) */}
        <div className="relative h-64 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ scale: 0, opacity: 0, x: -50 }}
              animate={{ 
                scale: isSuccess ? [1, 1.5, 0] : 1, 
                opacity: isSuccess ? [1, 1, 0] : 1,
                x: 0 
              }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute z-20 w-14 h-14 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${currentNote.color}`}
              style={{
                left: `${(currentNote.fret * 20) + 10}%`,
                top: `${((currentNote.string - 1) * 20) - 5}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.span 
                animate={{ rotate: isPlaying ? [0, 10, -10, 0] : 0 }}
                className="text-white text-3xl"
              >
                🕷️
              </motion.span>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -inset-4 border-4 border-emerald-400 rounded-full animate-ping"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div 
          animate={{ scale: isSuccess ? [1, 1.05, 1] : 1 }}
          className={`p-8 rounded-[40px] border-4 flex flex-col items-center text-center shadow-lg transition-colors ${
            isSuccess ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-900'
          }`}
        >
          <span className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Onde Tocar?</span>
          <h4 className={`text-4xl font-black mb-4 transition-colors ${isSuccess ? 'text-emerald-600' : 'text-slate-900'}`}>
            {currentNote.label}
          </h4>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-2 rounded-2xl border-2 border-slate-200 font-bold shadow-sm">
              Corda: <span className="text-orange-500">{currentNote.string}</span>
            </div>
            <div className="bg-white px-6 py-2 rounded-2xl border-2 border-slate-200 font-bold shadow-sm">
              Casa: <span className="text-blue-500">{currentNote.fret}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={playNoteSound}
            disabled={isPlaying}
            className={`flex-1 rounded-[40px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 text-xl border-4 ${
              isPlaying ? 'bg-slate-200 text-slate-400 border-slate-300' : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 active:scale-95'
            }`}
          >
            <Play className={`w-8 h-8 ${isPlaying ? '' : 'fill-white'}`} />
            {isPlaying ? 'Ouvindo...' : 'Ouvir Nota'}
          </button>
          <button 
            onClick={nextNote}
            disabled={isSuccess}
            className={`flex-1 rounded-[40px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 text-xl border-4 ${
              isSuccess ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600 active:scale-95'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-8 h-8" />
                Concluído!
              </>
            ) : (
              <>
                <SkipForward className="w-8 h-8 fill-white" />
                Próxima Nota
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-3xl relative border-4 border-slate-900 w-full max-w-4xl shadow-xl">
        <div className="absolute -top-4 right-8 bg-slate-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border-2 border-slate-800 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          DICA DO LUCCA 👦🏻
        </div>
        <p className="text-lg font-bold italic text-slate-600 leading-relaxed">
          "Dedo na pontinha do traste para o som sair limpinho! Vamos lá, Rockstar!"
        </p>
      </div>
    </section>
  );
}
