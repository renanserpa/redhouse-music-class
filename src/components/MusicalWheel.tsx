/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { RotateCw, Star, Sparkles } from 'lucide-react';

interface MusicalWheelProps {
  addXP: (amount: number) => void;
}

const CHALLENGES = [
  { text: "Tocar 3 vezes a corda Mi (Grave)", icon: "🐘", fill: "#f97316" },
  { text: "Fazer o som de um passarinho (Agudo)", icon: "🐦", fill: "#3b82f6" },
  { text: "Cantar 'TA-KA-DI-MI' batendo palmas", icon: "👏", fill: "#10b981" },
  { text: "Mostrar onde ficam as Tarraxas", icon: "🔍", fill: "#f59e0b" },
  { text: "Tocar a corda Lá (A) bem devagar", icon: "🐢", fill: "#e11d48" },
  { text: "Fazer um solo de 5 segundos!", icon: "🎸", fill: "#0ea5e9" },
  { text: "Cantar o nome das 6 cordas", icon: "🎤", fill: "#6366f1" },
  { text: "Imitar o som de uma aranha subindo", icon: "🕷️", fill: "#14b8a6" },
];

const NUM = CHALLENGES.length;
const ANGLE = 360 / NUM;

function polarToXY(angleDeg: number, r: number, cx = 50, cy = 50) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(index: number, r = 46, cx = 50, cy = 50) {
  const start = index * ANGLE;
  const end = start + ANGLE;
  const p1 = polarToXY(start, r, cx, cy);
  const p2 = polarToXY(end, r, cx, cy);
  const large = ANGLE > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
}

export default function MusicalWheel({ addXP }: MusicalWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof CHALLENGES[0] | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    audio.playTone(220, '8n');

    const extraSpins = 5 + Math.random() * 5;
    const newRotation = rotation + extraSpins * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = newRotation % 360;
      const index = Math.floor(((360 - finalAngle) % 360) / ANGLE) % NUM;
      setResult(CHALLENGES[index]);
      audio.playSuccess();
      addXP(20);
    }, 3000);
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden text-white flex flex-col items-center">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      <div className="flex items-center gap-3 mb-8 w-full">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
          <RotateCw className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white">Roda da Sorte Musical</h3>
      </div>

      <div className="relative w-[300px] h-[300px] md:w-[480px] md:h-[480px] mb-12">
        {/* Pointer triangle */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-40"
          style={{
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '32px solid #0f172a',
            marginTop: '-4px',
          }}
        />

        {/* SVG Wheel */}
        <motion.div
          className="w-full h-full"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.1, 0, 0.1, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />
            {CHALLENGES.map((c, i) => {
              const midAngle = i * ANGLE + ANGLE / 2;
              const labelPos = polarToXY(midAngle, 33);
              return (
                <g key={i}>
                  <path
                    d={sectorPath(i)}
                    fill={c.fill}
                    stroke="#0f172a"
                    strokeWidth="0.8"
                    opacity="0.9"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                  >
                    {c.icon}
                  </text>
                </g>
              );
            })}
            {/* Center cap */}
            <circle cx="50" cy="50" r="9" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Spin button overlaid at center */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={spinWheel}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center transition-all ${
            isSpinning ? 'bg-slate-200 scale-90' : 'bg-white hover:bg-slate-50'
          }`}
        >
          <RotateCw className={`w-6 h-6 text-slate-900 ${isSpinning ? 'animate-spin' : ''}`} />
        </motion.button>

        {/* Outer glow when spinning */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-4 border-8 border-amber-400/30 rounded-full animate-pulse z-0 pointer-events-none"
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
            className="w-full max-w-2xl p-8 rounded-[40px] border-4 border-slate-900 text-center shadow-2xl text-white relative overflow-hidden"
            style={{ backgroundColor: result.fill }}
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
