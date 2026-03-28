/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { RotateCw, Trophy, Star, Sparkles } from 'lucide-react';

interface MusicalWheelProps {
  addXP: (amount: number) => void;
}

const CHALLENGES = [
  { text: "Tocar 3 vezes a corda Mi (Grave)", icon: "🐘", color: "bg-orange-500" },
  { text: "Fazer o som de um passarinho (Agudo)", icon: "🐦", color: "bg-blue-500" },
  { text: "Cantar 'TA-KA-DI-MI' batendo palmas", icon: "👏", color: "bg-emerald-500" },
  { text: "Mostrar onde ficam as Tarraxas", icon: "🔍", color: "bg-purple-500" },
  { text: "Tocar a corda Lá (A) bem devagar", icon: "🐢", color: "bg-rose-500" },
  { text: "Fazer um solo de 5 segundos!", icon: "🎸", color: "bg-amber-500" },
  { text: "Cantar o nome das 6 cordas", icon: "🎤", color: "bg-indigo-500" },
  { text: "Imitar o som de uma aranha subindo", icon: "🕷️", color: "bg-cyan-500" },
];

export default function MusicalWheel({ addXP }: MusicalWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof CHALLENGES[0] | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    audio.playTone(220, 'sawtooth', 0.5, 0.1);

    const extraSpins = 5 + Math.random() * 5;
    const newRotation = rotation + extraSpins * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = newRotation % 360;
      const index = Math.floor(((360 - finalAngle) % 360) / (360 / CHALLENGES.length));
      const challenge = CHALLENGES[index];
      setResult(challenge);
      audio.playSuccess();
      addXP(20);
    }, 3000);
  };

  return (
    <section className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-900 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-8 w-full">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
          <RotateCw className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black uppercase italic">Roda da Sorte Musical</h3>
      </div>

      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] mb-12">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-40 w-8 h-12 bg-slate-900 clip-path-triangle" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
        
        {/* Wheel Container */}
        <div className="w-full h-full rounded-full border-8 border-slate-900 overflow-hidden relative shadow-2xl bg-slate-900">
          <motion.div 
            className="w-full h-full relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.1, 0, 0.1, 1] }}
          >
            {CHALLENGES.map((c, i) => {
              const angle = 360 / CHALLENGES.length;
              return (
                <div 
                  key={i}
                  className={`absolute top-0 left-1/2 w-1/2 h-full origin-left flex items-center justify-end pr-8 text-white font-black ${c.color}`}
                  style={{ 
                    transform: `rotate(${i * angle}deg) skewY(${90 - angle}deg)`,
                    width: '50%',
                    height: '100%',
                    borderLeft: '2px solid rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ transform: `skewY(-${90 - angle}deg) rotate(${angle / 2}deg)`, textAlign: 'center' }}>
                    <span className="text-4xl block mb-2 drop-shadow-lg">{c.icon}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Center Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={spinWheel}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-24 h-24 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center transition-all ${
            isSpinning ? 'bg-slate-200 scale-90' : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex flex-col items-center">
            <RotateCw className={`w-10 h-10 text-slate-900 ${isSpinning ? 'animate-spin' : ''}`} />
            {!isSpinning && <span className="text-[10px] font-black uppercase mt-1">Girar</span>}
          </div>
        </motion.button>

        {/* Outer Glow */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-4 border-8 border-amber-400/30 rounded-full animate-pulse z-0"
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key={result.text}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`w-full max-w-2xl p-8 rounded-[40px] border-4 border-slate-900 text-center shadow-2xl ${result.color} text-white relative overflow-hidden`}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl mb-6 drop-shadow-2xl"
            >
              {result.icon}
            </motion.div>
            <h4 className="text-4xl font-black uppercase mb-4 tracking-tighter italic">DESAFIO ACEITO!</h4>
            <p className="text-2xl font-bold italic mb-8 bg-black/10 py-4 px-6 rounded-3xl">{result.text}</p>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-white text-slate-900 py-3 px-8 rounded-full font-black flex items-center gap-2 shadow-lg">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span>+20 XP</span>
              </div>
              <div className="bg-black/20 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
          </motion.div>
        ) : !isSpinning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl text-center border-4 border-slate-800"
          >
            Gire a roda para começar o desafio em grupo! 🎡
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
