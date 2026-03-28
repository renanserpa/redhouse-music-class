import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-white rounded-3xl shadow-xl border-4 border-slate-900 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {gameState !== 'finished' ? (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900">Fábrica de Acordes</h2>
              <p className="text-xl text-slate-600">Forme o acorde: <span className="text-redhouse-primary font-black text-4xl">{targetChord.name}</span></p>
            </div>

            {/* Chord Diagram */}
            <div className="relative bg-slate-50 p-8 rounded-3xl border-4 border-slate-900 mb-8 shadow-inner">
              <svg width="240" height="300" viewBox="0 0 240 300">
                {/* Frets */}
                {[...Array(numFrets + 1)].map((_, i) => (
                  <line
                    key={`fret-${i}`}
                    x1="20"
                    y1={20 + i * 50}
                    x2={20 + (numStrings - 1) * 40}
                    y2={20 + i * 50}
                    stroke={i === 0 ? "#334155" : "#94a3b8"}
                    strokeWidth={i === 0 ? "8" : "4"}
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
                    stroke="#334155"
                    strokeWidth="4"
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
                      <g key={`dot-${s}-${f}`} onClick={() => handleDotClick(stringNum, fretNum)} className="cursor-pointer">
                        <rect
                          x={20 + s * 40 - 20}
                          y={20 + f * 50}
                          width="40"
                          height="50"
                          fill="transparent"
                        />
                        {(isSelected || showCorrect) && (
                          <motion.circle
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            cx={20 + s * 40}
                            cy={20 + f * 50 + 25}
                            r="15"
                            fill={showCorrect ? "#22c55e" : showWrong ? "#ef4444" : "#3b82f6"}
                            stroke="white"
                            strokeWidth="3"
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
              className={`px-12 py-4 font-black text-2xl rounded-2xl shadow-xl transition-all border-4 border-slate-900 ${
                selectedDots.length === 0 || gameState !== 'playing'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-redhouse-primary text-white hover:scale-105 active:scale-95'
              }`}
            >
              PRONTO!
            </button>

            {gameState === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 flex items-center gap-2 font-black text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {isCorrect ? (
                  <><CheckCircle2 className="w-6 h-6" /> Acertou em cheio!</>
                ) : (
                  <><XCircle className="w-6 h-6" /> Quase! Veja a posição correta.</>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-900 shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Mestre dos Acordes!</h2>
            <p className="text-xl text-slate-600 mb-8">
              Você aprendeu os acordes fundamentais!
            </p>
            <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-900 inline-block mb-8">
              <div className="text-sm font-bold text-slate-500 uppercase mb-1">XP Ganhos</div>
              <div className="text-4xl font-black text-redhouse-primary">+40 XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
