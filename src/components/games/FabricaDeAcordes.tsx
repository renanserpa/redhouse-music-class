import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../lib/audio';
import { Trophy, Music, Heart, CheckCircle2, XCircle } from 'lucide-react';
import { getRandomDialogue } from '../../lib/npcDialogues';

interface FabricaDeAcordesProps {
  onComplete: (xp: number) => void;
  onUpdateNPC: (state: 'idle' | 'celebrating' | 'encouraging', message: string) => void;
  instrument: 'guitar' | 'ukulele';
}

interface ChordDefinition {
  name: string;
  guitar: { string: number; fret: number }[];
  ukulele: { string: number; fret: number }[];
}

const CHORDS: ChordDefinition[] = [
  { 
    name: 'Em', 
    guitar: [{ string: 5, fret: 2 }, { string: 4, fret: 2 }],
    ukulele: [{ string: 1, fret: 2 }]
  },
  { 
    name: 'Am', 
    guitar: [{ string: 4, fret: 2 }, { string: 3, fret: 2 }, { string: 2, fret: 1 }],
    ukulele: [{ string: 4, fret: 2 }]
  },
  { 
    name: 'C', 
    guitar: [{ string: 5, fret: 3 }, { string: 4, fret: 2 }, { string: 2, fret: 1 }],
    ukulele: [{ string: 1, fret: 3 }]
  },
  { 
    name: 'G', 
    guitar: [{ string: 6, fret: 3 }, { string: 5, fret: 2 }, { string: 2, fret: 3 }, { string: 1, fret: 3 }],
    ukulele: [{ string: 4, fret: 0 }, { string: 3, fret: 2 }, { string: 2, fret: 3 }, { string: 1, fret: 2 }]
  },
  { 
    name: 'D', 
    guitar: [{ string: 3, fret: 2 }, { string: 2, fret: 3 }, { string: 1, fret: 2 }],
    ukulele: [{ string: 4, fret: 2 }, { string: 3, fret: 2 }, { string: 2, fret: 2 }]
  }
];

export const FabricaDeAcordes: React.FC<FabricaDeAcordesProps> = ({
  onComplete,
  onUpdateNPC,
  instrument
}) => {
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [selectedDots, setSelectedDots] = useState<{ string: number; fret: number }[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const targetChord = CHORDS[currentChordIndex];
  const targetDots = instrument === 'guitar' ? targetChord.guitar : targetChord.ukulele;
  const numStrings = instrument === 'guitar' ? 6 : 4;
  const numFrets = 5;

  const handleDotClick = (string: number, fret: number) => {
    if (gameState !== 'playing') return;

    const exists = selectedDots.find(d => d.string === string && d.fret === fret);
    if (exists) {
      setSelectedDots(prev => prev.filter(d => !(d.string === string && d.fret === fret)));
    } else {
      setSelectedDots(prev => [...prev, { string, fret }]);
    }
  };

  const validateChord = () => {
    if (gameState !== 'playing') return;

    const correct = selectedDots.length === targetDots.length &&
      targetDots.every(td => selectedDots.find(sd => sd.string === td.string && sd.fret === td.fret));

    setIsCorrect(correct);
    setGameState('feedback');

    if (correct) {
      audio.playSuccess();
      onUpdateNPC('celebrating', getRandomDialogue('correct', instrument));
      // Play chord sound (mocked with a scale for now)
      audio.playChord(['C4', 'E4', 'G4']);
    } else {
      audio.playError();
      onUpdateNPC('encouraging', getRandomDialogue('wrong', instrument));
    }

    setTimeout(() => {
      if (correct) {
        if (currentChordIndex < CHORDS.length - 1) {
          setCurrentChordIndex(prev => prev + 1);
          setSelectedDots([]);
          setGameState('playing');
          setIsCorrect(null);
        } else {
          setGameState('finished');
          onComplete(40);
        }
      } else {
        // Let them try again
        setGameState('playing');
        setIsCorrect(null);
      }
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 overflow-hidden relative group">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <AnimatePresence mode="wait">
        {gameState !== 'finished' ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center relative z-10"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Fábrica de Acordes</h2>
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm font-black text-white/30 uppercase tracking-widest italic">Monte o Acorde:</span>
                <span className="text-6xl font-black text-redhouse-primary italic tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">{targetChord.name}</span>
              </div>
            </div>

            {/* Chord Diagram - HUD Style */}
            <div className="relative bg-black/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 mb-10 shadow-2xl">
              <svg width="240" height="300" viewBox="0 0 240 300">
                {/* Frets */}
                {[...Array(numFrets + 1)].map((_, i) => (
                  <line
                    key={`fret-${i}`}
                    x1="20"
                    y1={20 + i * 50}
                    x2={20 + (numStrings - 1) * 40}
                    y2={20 + i * 50}
                    stroke={i === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.05)"}
                    strokeWidth={i === 0 ? "8" : "3"}
                    className={i === 0 ? "drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}
                  />
                ))}

                {/* Strings */}
                {[...Array(numStrings)].map((_, i) => (
                  <line
                    key={`string-${i}`}
                    x1={20 + i * 40}
                    y1="20"
                    x2={20 + i * 40}
                    y2={20 + numFrets * 50}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="3"
                  />
                ))}

                {/* Clickable Areas and Dots */}
                {[...Array(numStrings)].map((_, s) => (
                  [...Array(numFrets)].map((_, f) => {
                    const stringNum = numStrings - s;
                    const fretNum = f + 1;
                    const isSelected = selectedDots.find(d => d.string === stringNum && d.fret === fretNum);
                    const isTarget = targetDots.find(d => d.string === stringNum && d.fret === fretNum);
                    const showCorrect = gameState === 'feedback' && isTarget;
                    const showWrong = gameState === 'feedback' && isSelected && !isTarget;

                    return (
                      <g key={`dot-${s}-${f}`} onClick={() => handleDotClick(stringNum, fretNum)} className="cursor-pointer group/dot">
                        <rect
                          x={20 + s * 40 - 20}
                          y={20 + f * 50}
                          width="40"
                          height="50"
                          fill="transparent"
                        />
                        {(isSelected || showCorrect) && (
                          <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            cx={20 + s * 40}
                            cy={20 + f * 50 + 25}
                            r="16"
                            fill={showCorrect ? "rgba(16,185,129,0.2)" : showWrong ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)"}
                            stroke={showCorrect ? "#10b981" : showWrong ? "#ef4444" : "#3b82f6"}
                            strokeWidth="3"
                          />
                        )}
                        {/* Shadow for the dot */}
                        {(isSelected || showCorrect) && (
                          <circle
                            cx={20 + s * 40}
                            cy={20 + f * 50 + 25}
                            r="16"
                            fill="none"
                            stroke={showCorrect ? "#10b981" : showWrong ? "#ef4444" : "#3b82f6"}
                            strokeWidth="8"
                            className="opacity-20 blur-md"
                          />
                        )}
                      </g>
                    );
                  })
                ))}
              </svg>
            </div>

            <button
              onClick={validateChord}
              disabled={gameState !== 'playing' || selectedDots.length === 0}
              className={`px-16 py-5 font-black text-2xl rounded-2xl shadow-xl transition-all border border-white/20 uppercase italic tracking-widest ${
                selectedDots.length === 0 || gameState !== 'playing'
                  ? 'bg-white/5 text-white/20 cursor-not-allowed'
                  : 'bg-redhouse-primary text-white shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95'
              }`}
            >
              VALIDAR ACORDE
            </button>

            <AnimatePresence>
              {gameState === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-8 flex items-center gap-3 font-black text-2xl italic uppercase tracking-tighter ${isCorrect ? 'text-emerald-400' : 'text-redhouse-primary'}`}
                >
                  {isCorrect ? (
                    <><CheckCircle2 className="w-8 h-8" /> Sincronia Perfeita!</>
                  ) : (
                    <><XCircle className="w-8 h-8" /> Erro de Posicionamento</>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center relative z-10"
          >
            <div className="w-32 h-32 bg-yellow-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 italic uppercase tracking-tighter">Mestre dos Acordes!</h2>
            <p className="text-xl text-slate-400 mb-12 font-bold italic uppercase">
              Você dominou as estruturas fundamentais!
            </p>
            <div className="bg-black/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 inline-block mb-12 shadow-2xl">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">Experiência Adquirida</div>
              <div className="text-6xl font-black text-redhouse-primary italic tracking-tighter">+40 XP</div>
            </div>
            <br />
            <button
              onClick={() => {
                setCurrentChordIndex(0);
                setSelectedDots([]);
                setGameState('playing');
                setIsCorrect(null);
              }}
              className="px-12 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase italic tracking-widest"
            >
              REINICIAR PRODUÇÃO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
