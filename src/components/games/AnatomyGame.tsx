/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { CheckCircle2, Search, Zap, Rocket, Disc } from 'lucide-react';

interface AnatomyGameProps {
  addXP: (amount: number) => void;
  onComplete?: () => void;
}

export default function AnatomyGame({ addXP, onComplete }: AnatomyGameProps) {
  const [discoveredParts, setDiscoveredParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("Aguardando Escaneamento...");
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const parts = [
    { 
      id: 'tarraxas', 
      label: 'Painel de Comando (Tarraxas)', 
      metaphor: 'Use o volante para afinar a rota!',
      x: 10, y: 40, width: 12, height: 15,
      icon: Zap
    },
    { 
      id: 'braco', 
      label: 'Pista de Decolagem (Braço)', 
      metaphor: 'Aqui é onde a aranha-astronauta caminha.',
      x: 25, y: 42, width: 38, height: 12,
      icon: Rocket
    },
    { 
      id: 'boca', 
      label: 'Propulsor de Som (Boca)', 
      metaphor: 'Onde a energia musical explode!',
      x: 72, y: 42, width: 8, height: 12,
      icon: Disc
    },
    { 
      id: 'corpo', 
      label: 'Cabine de Comando (Corpo)', 
      metaphor: 'Onde o som ganha força para decolar.',
      x: 65, y: 30, width: 25, height: 35,
      icon: Search
    },
  ];

  const handlePartClick = (part: typeof parts[0]) => {
    setFeedback(`${part.label}: ${part.metaphor}`);
    setLastClicked(part.id);
    audio.playTone(440, '4n');
    
    if (!discoveredParts.includes(part.id)) {
      const newDiscovered = [...discoveredParts, part.id];
      setDiscoveredParts(newDiscovered);
      addXP(15);
      
      if (newDiscovered.length === parts.length) {
        setFeedback("🚀 NAVE PRONTA PARA DECOLAGEM!");
        audio.playSuccess();
        if (onComplete) {
          setTimeout(onComplete, 2000);
        }
      }
    }

    setTimeout(() => setLastClicked(null), 1500);
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%]" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] -rotate-6 border-2 border-blue-400">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Missão 1: Reconhecimento</h3>
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest leading-none">Anatomia do Instrumento · Mundo 1</p>
          </div>
        </div>
        
        <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-xl">
          <div className="flex gap-1.5">
            {parts.map(p => (
              <div 
                key={p.id} 
                className={`w-2.5 h-2.5 rounded-full transition-all ${discoveredParts.includes(p.id) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-white/10'}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest font-mono italic">{discoveredParts.length} / {parts.length} SCAN_OK</span>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] p-4 border border-white/5 mb-8 text-center relative z-10">
        <p className="text-blue-200/60 font-black italic text-[11px] uppercase tracking-[0.2em] animate-pulse">Inicie o diagnóstico clicando nos componentes da nave musical</p>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md rounded-[4rem] p-12 border border-white/5 relative overflow-hidden group shadow-2xl min-h-[450px] flex items-center justify-center">
        {/* Digital Scanning HUD Layout */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-blue-500/20 rounded-tl-[3rem]" />
           <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-blue-500/20 rounded-tr-[3rem]" />
           <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-blue-500/20 rounded-bl-[3rem]" />
           <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-blue-500/20 rounded-br-[3rem]" />
        </div>

        <motion.div 
          animate={{ scaleX: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-x-0 h-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none"
        ></motion.div>

        <div className="relative w-full h-full max-w-4xl aspect-[2/1] z-10">
          {/* Instrumental "Spaceship" UI */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
            <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              {/* Body / Cockpit */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d="M 550,100 C 700,100 780,180 780,200 C 780,220 700,300 550,300 L 500,300 C 450,300 450,100 500,100 Z"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <path d="M 550,105 C 680,105 750,180 750,200 C 750,220 680,295 550,295 L 510,295 C 470,295 470,105 510,105 Z" fill="rgba(30,41,59,0.5)" />
              
              {/* Soundhole / Propulsion */}
              <circle cx="560" cy="200" r="40" fill="rgba(2,6,23,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <motion.circle 
                animate={{ rotate: 360, opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                cx="560" cy="200" r="30" fill="transparent" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4" 
              />
              
              {/* Neck / Runway */}
              <rect x="150" y="180" width="350" height="40" fill="rgba(51,65,85,0.5)" rx="4" />
              {[...Array(12)].map((_, i) => (
                <rect key={i} x={180 + i * 30} y={180} width="1" height="40" fill="rgba(255,255,255,0.1)" />
              ))}
              
              {/* Headstock / Command Panel */}
              <rect x="50" y="170" width="100" height="60" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" rx="12" />
              
              {/* Tuning Pegs / Antennae */}
              {[0, 1, 2].map(i => (
                <g key={i}>
                  <circle cx={70 + i * 30} cy="160" r="6" fill="rgba(100,116,139,0.5)" />
                  <circle cx={70 + i * 30} cy="240" r="6" fill="rgba(100,116,139,0.5)" />
                </g>
              ))}

              {/* Scanning Laser Line */}
              {lastClicked && (
                <motion.line 
                  initial={{ y1: 0, y2: 0 }}
                  animate={{ y1: [0, 400], y2: [0, 400] }}
                  transition={{ duration: 1.5, ease: 'linear' }}
                  x1="0" x2="800"
                  className="stroke-blue-500/40 stroke-[10] blur-sm"
                />
              )}
            </svg>
          </div>

          {/* Interactive HUD Points */}
          {parts.map(part => (
            <button
              key={part.id}
              onClick={() => handlePartClick(part)}
              className={`absolute border-2 transition-all flex flex-col items-center justify-center gap-3 group/part overflow-hidden ${
                discoveredParts.includes(part.id) 
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                  : 'border-white/5 hover:border-blue-500/50 bg-white/5 hover:bg-blue-500/10'
              } rounded-[2rem] backdrop-blur-md`}
              style={{
                left: `${part.x}%`,
                top: `${part.y}%`,
                width: `${part.width}%`,
                height: `${part.height}%`
              }}
            >
              <div className={`p-3 rounded-2xl transition-all ${discoveredParts.includes(part.id) ? 'bg-emerald-500 text-white' : 'bg-slate-900/80 text-white/30 group-hover/part:scale-110 group-hover/part:text-blue-400'}`}>
                <part.icon className="w-6 h-6" />
              </div>
              
              <AnimatePresence>
                {discoveredParts.includes(part.id) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-2 right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>

              {lastClicked === part.id && (
                <motion.div 
                  initial={{ opacity: 1, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-blue-500/40 rounded-[2rem] z-20 pointer-events-none"
                />
              )}
              
              {/* Point ID Label */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-10 font-mono text-[8px] font-black group-hover/part:opacity-40 transition-opacity">
                SYS_PT_{part.id.toUpperCase()}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={feedback}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-black/60 backdrop-blur-xl border border-white/10 px-12 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center text-center gap-4 max-w-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent italic" />
            <div className="text-[10px] text-blue-500 font-black tracking-[0.5em] mb-1 italic">DIAGNOSTIC_FEEDBACK</div>
            <div className="text-2xl font-black text-white italic tracking-tight leading-snug drop-shadow-lg">{feedback}</div>
            
            {discoveredParts.length < parts.length && (
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <div className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">Aguardando Input de Hardware...</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative HUD Elements */}
      <div className="flex justify-center mt-8">
        <div className="px-6 py-2 bg-black/40 rounded-full border border-white/5 text-[9px] font-black text-white/10 uppercase tracking-[0.6em] italic backdrop-blur-md">
          Neural_Interface_v4.2.0_Active
        </div>
      </div>
    </section>
  );
}
