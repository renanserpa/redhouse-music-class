import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Trophy, CheckCircle2, XCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { Instrument } from '../../types';

interface ChordFactoryGameProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  instrument?: Instrument;
}

interface FingerPosition {
  string: number;
  fret: number;
  finger: number;
}

interface ChordTarget {
  name: string;
  positions: FingerPosition[];
}

const CHORDS: Record<Instrument, ChordTarget[]> = {
  guitar: [
    { name: 'Em', positions: [{ string: 5, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }] },
    { name: 'Am', positions: [{ string: 4, fret: 2, finger: 2 }, { string: 3, fret: 2, finger: 3 }, { string: 2, fret: 1, finger: 1 }] },
    { name: 'C', positions: [{ string: 5, fret: 3, finger: 3 }, { string: 4, fret: 2, finger: 2 }, { string: 2, fret: 1, finger: 1 }] },
  ],
  ukulele: [
    { name: 'C', positions: [{ string: 1, fret: 3, finger: 3 }] },
    { name: 'Am', positions: [{ string: 4, fret: 2, finger: 2 }] },
    { name: 'F', positions: [{ string: 4, fret: 2, finger: 2 }, { string: 2, fret: 1, finger: 1 }] },
  ]
};

export default function ChordFactoryGame({ onComplete, addXP, instrument = 'guitar' }: ChordFactoryGameProps) {
  const [targetChord, setTargetChord] = useState<ChordTarget | null>(null);
  const [placedFingers, setPlacedFingers] = useState<FingerPosition[]>([]);
  const [selectedFinger, setSelectedFinger] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const stringsCount = instrument === 'guitar' ? 6 : 4;
  const fretsCount = 4;

  useEffect(() => {
    const chords = CHORDS[instrument] || CHORDS.guitar;
    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    setTargetChord(randomChord);
    setPlacedFingers([]);
    setIsCorrect(false);
  }, [instrument]);

  const handleFretClick = (string: number, fret: number) => {
    if (isCorrect) return;

    // Toggle finger at position
    const existing = placedFingers.find(f => f.string === string && f.fret === fret);
    if (existing) {
      setPlacedFingers(prev => prev.filter(f => f !== existing));
      audio.playClick();
    } else {
      // Remove any finger with the same number if it exists elsewhere
      const filtered = placedFingers.filter(f => f.finger !== selectedFinger);
      setPlacedFingers([...filtered, { string, fret, finger: selectedFinger }]);
      audio.playClick();
    }
  };

  const checkChord = () => {
    if (!targetChord) return;

    const isMatch = targetChord.positions.every(target => 
      placedFingers.some(placed => 
        placed.string === target.string && 
        placed.fret === target.fret && 
        placed.finger === target.finger
      )
    ) && placedFingers.length === targetChord.positions.length;

    if (isMatch) {
      setIsCorrect(true);
      audio.playSuccess();
      addXP(50);
      setTimeout(() => onComplete(), 2000);
    } else {
      audio.playError();
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
          Fábrica de Acordes
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Monte o acorde de <span className="text-redhouse-primary font-black">{targetChord?.name}</span> no braço do {instrument === 'guitar' ? 'violão' : 'ukulele'}.
        </p>
      </div>

      {/* Fretboard SVG */}
      <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border-4 border-slate-100 dark:border-slate-800">
        <svg width="300" height="400" viewBox="0 0 300 400" className="overflow-visible">
          {/* Nut */}
          <rect x="50" y="40" width="200" height="10" fill="#334155" rx="2" />
          
          {/* Frets */}
          {[1, 2, 3, 4].map(f => (
            <line 
              key={f} 
              x1="50" y1={50 + f * 80} 
              x2="250" y2={50 + f * 80} 
              stroke="#94a3b8" 
              strokeWidth="4" 
            />
          ))}

          {/* Strings */}
          {Array.from({ length: stringsCount }).map((_, s) => {
            const x = 50 + (s * (200 / (stringsCount - 1)));
            return (
              <line 
                key={s} 
                x1={x} y1="50" 
                x2={x} y2="370" 
                stroke="#cbd5e1" 
                strokeWidth={2 + (stringsCount - s) * 0.5} 
              />
            );
          })}

          {/* Interaction Areas & Placed Fingers */}
          {Array.from({ length: stringsCount }).map((_, s) => {
            const stringNum = stringsCount - s; // 1 is bottom, 6 is top for guitar
            const x = 50 + (s * (200 / (stringsCount - 1)));
            
            return Array.from({ length: fretsCount }).map((_, f) => {
              const fretNum = f + 1;
              const y = 50 + f * 80 + 40;
              const isPlaced = placedFingers.find(pf => pf.string === stringNum && pf.fret === fretNum);
              const isTarget = targetChord?.positions.find(tp => tp.string === stringNum && tp.fret === fretNum);

              return (
                <g key={`${stringNum}-${fretNum}`} onClick={() => handleFretClick(stringNum, fretNum)} className="cursor-pointer group">
                  <circle 
                    cx={x} cy={y} r="25" 
                    fill="transparent" 
                    className="group-hover:fill-redhouse-primary/5 transition-colors"
                  />
                  {isPlaced && (
                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <circle 
                        cx={x} cy={y} r="18" 
                        fill={isCorrect ? "#10b981" : "#ef4444"} 
                        className="shadow-lg"
                      />
                      <text 
                        x={x} y={y + 5} 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="14" 
                        fontWeight="900"
                        className="pointer-events-none"
                      >
                        {isPlaced.finger}
                      </text>
                    </motion.g>
                  )}
                  {showHint && isTarget && !isPlaced && (
                    <circle 
                      cx={x} cy={y} r="15" 
                      fill="transparent" 
                      stroke="#ef4444" 
                      strokeWidth="2" 
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            });
          })}
        </svg>

        {/* Finger Selector */}
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          {[1, 2, 3, 4].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFinger(f)}
              className={`w-12 h-12 rounded-2xl font-black transition-all flex items-center justify-center shadow-lg ${
                selectedFinger === f 
                  ? 'bg-redhouse-primary text-white scale-110 rotate-6' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPlacedFingers([])}
          className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Limpar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={checkChord}
          disabled={isCorrect}
          className="flex-[2] py-4 bg-redhouse-primary text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-lg shadow-redhouse-primary/30 disabled:opacity-50"
        >
          {isCorrect ? 'Acorde Perfeito!' : 'Verificar Acorde'}
        </motion.button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <HelpCircle className="w-5 h-5 text-blue-500" />
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 italic">
          Dica: Use os números para selecionar qual dedo você vai usar!
        </p>
      </div>
    </div>
  );
}
