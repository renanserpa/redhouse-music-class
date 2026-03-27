/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { CheckCircle2, Search, Info } from 'lucide-react';

interface AnatomyGameProps {
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
}

export default function AnatomyGame({ addXP, addCoins }: AnatomyGameProps) {
  const [discoveredParts, setDiscoveredParts] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("Aguardando toque...");
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const parts = [
    { id: 'tarraxas', label: 'Tarraxas (Orelhas de Afinar!)', x: 10, y: 45, width: 15, height: 10 },
    { id: 'braco', label: 'Braço e Trastes (Caminho da Aranha!)', x: 25, y: 45, width: 45, height: 10 },
    { id: 'corpo', label: 'Corpo e Boca (Onde o som mora!)', x: 70, y: 35, width: 25, height: 30 },
  ];

  const handlePartClick = (part: typeof parts[0]) => {
    setFeedback(part.label);
    setLastClicked(part.id);
    audio.playTone(440, '8n');
    
    if (!discoveredParts.includes(part.id)) {
      setDiscoveredParts(prev => [...prev, part.id]);
      addXP(10);
      if (discoveredParts.length + 1 === parts.length) {
        setFeedback("🎉 VOCÊ CONHECE O GIGANTE!");
        audio.playSuccess();
      }
    }

    setTimeout(() => setLastClicked(null), 1000);
  };

  return (
    <section className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black uppercase italic">Missão 1: O Gigante de Madeira</h3>
      </div>
      <p className="text-slate-500 font-bold mb-8 italic">Clique nas partes do violão para descobrir como elas se chamam!</p>
      
      <div className="bg-slate-50 rounded-[40px] p-8 border-4 border-dashed border-slate-200 relative overflow-hidden aspect-[2/1] flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl">
          {/* Guitar SVG (Simplified) */}
          <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-2xl">
            {/* Body */}
            <ellipse cx="300" cy="100" rx="80" ry="60" fill="#8B4513" />
            {/* Neck */}
            <rect x="50" y="90" width="200" height="20" fill="#4B2508" />
            {/* Soundhole */}
            <circle cx="280" cy="100" r="25" fill="#222" />
            {/* Headstock */}
            <rect x="20" y="85" width="40" height="30" fill="#4B2508" rx="4" />
            {/* Tuning Pegs */}
            <rect x="25" y="80" width="10" height="40" fill="#AAA" rx="2" />
            <rect x="40" y="80" width="10" height="40" fill="#AAA" rx="2" />
          </svg>

          {/* Interactive Overlays */}
          {parts.map(part => (
            <button
              key={part.id}
              onClick={() => handlePartClick(part)}
              className={`absolute border-4 border-dashed rounded-2xl transition-all flex items-center justify-center overflow-hidden ${
                discoveredParts.includes(part.id) 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-300 hover:border-orange-500 hover:bg-orange-500/5'
              }`}
              style={{
                left: `${part.x}%`,
                top: `${part.y}%`,
                width: `${part.width}%`,
                height: `${part.height}%`
              }}
            >
              <AnimatePresence>
                {discoveredParts.includes(part.id) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-emerald-500"
                  >
                    <CheckCircle2 className="w-8 h-8 fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              {lastClicked === part.id && (
                <motion.div 
                  initial={{ opacity: 1, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 2 }}
                  className="absolute inset-0 bg-orange-500/20 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={feedback}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest shadow-xl flex items-center gap-3 border-4 border-slate-800"
          >
            <Info className="w-6 h-6 text-orange-500" />
            {feedback}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex gap-4">
          {parts.map(part => (
            <motion.div 
              key={part.id} 
              animate={{ 
                scale: discoveredParts.includes(part.id) ? [1, 1.2, 1] : 1,
                backgroundColor: discoveredParts.includes(part.id) ? '#10b981' : '#e2e8f0'
              }}
              className="w-6 h-6 rounded-full shadow-inner border-2 border-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
