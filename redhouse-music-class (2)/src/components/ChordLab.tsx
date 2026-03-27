import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Play, Info, Star, Music, Guitar as GuitarIcon, Pencil, Save, Trash2, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { Instrument } from '../types';

interface Finger {
  string: number;
  fret: number;
  finger: number;
}

interface ChordData {
  name: string;
  instrument: Instrument;
  fingers: Finger[];
  openStrings: number[];
  mutedStrings: number[];
  notes: number[];
  noteNames: string[];
  color: string;
  gradient: string;
}

interface ChordLabProps {
  addXP: (amount: number) => void;
}

const GUITAR_CHORDS: ChordData[] = [
  { 
    name: 'D (Ré Maior)', 
    instrument: 'guitar',
    fingers: [
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 3, finger: 3 },
      { string: 3, fret: 2, finger: 1 },
    ],
    openStrings: [4],
    mutedStrings: [5, 6],
    notes: [146.83, 220.00, 293.66, 369.99],
    noteNames: ['Ré', 'Lá', 'Ré', 'Fá#'],
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  { 
    name: 'G (Sol Maior)', 
    instrument: 'guitar',
    fingers: [
      { string: 1, fret: 3, finger: 4 },
      { string: 5, fret: 2, finger: 1 },
      { string: 6, fret: 3, finger: 2 },
    ],
    openStrings: [2, 3, 4],
    mutedStrings: [],
    notes: [98.00, 123.47, 146.83, 196.00, 246.94, 392.00],
    noteNames: ['Sol', 'Si', 'Ré', 'Sol', 'Si', 'Sol'],
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  { 
    name: 'C (Dó Maior)', 
    instrument: 'guitar',
    fingers: [
      { string: 2, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 3, finger: 3 },
    ],
    openStrings: [1, 3],
    mutedStrings: [6],
    notes: [130.81, 164.81, 196.00, 261.63, 329.63],
    noteNames: ['Dó', 'Mi', 'Sol', 'Dó', 'Mi'],
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600'
  },
];

const UKULELE_CHORDS: ChordData[] = [
  { 
    name: 'C (Dó Maior)', 
    instrument: 'ukulele',
    fingers: [
      { string: 1, fret: 3, finger: 3 },
    ],
    openStrings: [2, 3, 4],
    mutedStrings: [],
    notes: [261.63, 329.63, 392.00, 523.25],
    noteNames: ['Dó', 'Mi', 'Sol', 'Dó'],
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600'
  },
  { 
    name: 'F (Fá Maior)', 
    instrument: 'ukulele',
    fingers: [
      { string: 2, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
    ],
    openStrings: [1, 3],
    mutedStrings: [],
    notes: [349.23, 440.00, 523.25, 698.46],
    noteNames: ['Fá', 'Lá', 'Dó', 'Fá'],
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  { 
    name: 'G (Sol Maior)', 
    instrument: 'ukulele',
    fingers: [
      { string: 1, fret: 2, finger: 3 },
      { string: 2, fret: 3, finger: 2 },
      { string: 3, fret: 2, finger: 1 },
    ],
    openStrings: [4],
    mutedStrings: [],
    notes: [392.00, 493.88, 587.33, 783.99],
    noteNames: ['Sol', 'Si', 'Ré', 'Sol'],
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
];

export default function ChordLab({ addXP }: ChordLabProps) {
  const [instrument, setInstrument] = useState<Instrument>('guitar');
  const [chords, setChords] = useState<ChordData[]>(GUITAR_CHORDS);
  const [selectedChord, setSelectedChord] = useState<ChordData>(GUITAR_CHORDS[0]);
  const [isStrumming, setIsStrumming] = useState(false);
  const [isProfessorMode, setIsProfessorMode] = useState(false);
  const [customChord, setCustomChord] = useState<ChordData | null>(null);

  useEffect(() => {
    const initialChords = instrument === 'guitar' ? GUITAR_CHORDS : UKULELE_CHORDS;
    setChords(initialChords);
    setSelectedChord(initialChords[0]);
  }, [instrument]);

  const playChord = () => {
    setIsStrumming(true);
    const chordToPlay = isProfessorMode && customChord ? customChord : selectedChord;
    chordToPlay.notes.forEach((freq, i) => {
      setTimeout(() => {
        audio.playTone(freq, 'triangle', 1.5, 0.2);
      }, i * 60);
    });
    addXP(5);
    setTimeout(() => setIsStrumming(false), 600);
  };

  const playIndividualNotes = () => {
    const chordToPlay = isProfessorMode && customChord ? customChord : selectedChord;
    chordToPlay.notes.forEach((freq, i) => {
      setTimeout(() => {
        audio.playTone(freq, 'triangle', 1.0, 0.2);
      }, i * 500);
    });
    addXP(10);
  };

  const toggleProfessorMode = () => {
    if (!isProfessorMode) {
      setCustomChord({ ...selectedChord, name: 'Novo Acorde' });
    }
    setIsProfessorMode(!isProfessorMode);
  };

  const handleFretClick = (string: number, fret: number) => {
    if (!isProfessorMode || !customChord) return;

    const existingFingerIndex = customChord.fingers.findIndex(f => f.string === string && f.fret === fret);
    let newFingers = [...customChord.fingers];

    if (existingFingerIndex >= 0) {
      newFingers.splice(existingFingerIndex, 1);
    } else {
      // Remove other fingers on same string
      newFingers = newFingers.filter(f => f.string !== string);
      newFingers.push({ string, fret, finger: 1 });
    }

    setCustomChord({ ...customChord, fingers: newFingers });
  };

  const numStrings = instrument === 'guitar' ? 6 : 4;
  const strings = Array.from({ length: numStrings }, (_, i) => i + 1);

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-[40px] p-6 md:p-8 shadow-xl border-4 border-zinc-900 dark:border-zinc-800 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧪</span>
          <h3 className="text-2xl font-black uppercase italic text-zinc-900 dark:text-white">Laboratório de Acordes</h3>
        </div>

        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setInstrument('guitar')}
            className={`px-4 py-2 rounded-xl font-black uppercase italic text-xs transition-all flex items-center gap-2 ${
              instrument === 'guitar' ? 'bg-redhouse-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <GuitarIcon className="w-4 h-4" />
            Violão
          </button>
          <button
            onClick={() => setInstrument('ukulele')}
            className={`px-4 py-2 rounded-xl font-black uppercase italic text-xs transition-all flex items-center gap-2 ${
              instrument === 'ukulele' ? 'bg-redhouse-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Music className="w-4 h-4" />
            Ukulele
          </button>
        </div>

        <button
          onClick={toggleProfessorMode}
          className={`px-6 py-3 rounded-2xl font-black uppercase italic text-sm transition-all flex items-center gap-2 border-2 ${
            isProfessorMode 
              ? 'bg-purple-500 border-purple-600 text-white shadow-lg' 
              : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-purple-500'
          }`}
        >
          <Pencil className="w-4 h-4" />
          {isProfessorMode ? 'Sair do Modo Professor' : 'Modo Professor'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chord Selection Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Biblioteca de Acordes</h4>
            <span className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{chords.length} Acordes</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {chords.map((chord) => (
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                key={chord.name}
                onClick={() => {
                  setSelectedChord(chord);
                  if (isProfessorMode) setCustomChord({ ...chord });
                }}
                className={`w-full p-4 rounded-[24px] border-4 transition-all flex items-center justify-between group relative overflow-hidden ${
                  selectedChord.name === chord.name 
                    ? 'border-zinc-900 dark:border-zinc-700 bg-zinc-900 dark:bg-zinc-800 text-white shadow-2xl z-10' 
                    : 'border-white dark:border-zinc-800 bg-white dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-200 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl ${chord.color} bg-gradient-to-br ${chord.gradient} flex items-center justify-center text-white shadow-inner border-2 border-white/20`}>
                    <Music className="w-5 h-5" />
                  </div>
                  <span className="font-black text-lg tracking-tight">{chord.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${chord.color} bg-gradient-to-br ${chord.gradient} shadow-[0_0_10px_rgba(0,0,0,0.1)] group-hover:scale-125 transition-transform`}></div>
              </motion.button>
            ))}
            
            {isProfessorMode && (
              <button className="w-full p-4 rounded-[24px] border-4 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:border-purple-500 hover:text-purple-500 transition-all flex items-center justify-center gap-2 font-black uppercase italic text-sm">
                <Plus className="w-5 h-5" />
                Novo Acorde
              </button>
            )}
          </div>
        </div>

        {/* Visualization and Details Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[48px] p-6 md:p-10 border-4 border-zinc-100 dark:border-zinc-800 shadow-inner flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-redhouse-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="w-full max-w-md bg-zinc-900 dark:bg-black rounded-[40px] p-8 md:p-12 relative shadow-2xl mb-10 border-8 border-zinc-800 dark:border-zinc-950">
              {/* Nut */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-500 to-zinc-600 rounded-t-[32px] border-b-4 border-zinc-700"></div>
              
              {/* Strings */}
              <div className="flex justify-between h-96 px-10 relative">
                {strings.map((s) => (
                  <motion.div 
                    key={s} 
                    animate={isStrumming ? { x: [0, 2, -2, 0] } : {}}
                    transition={{ duration: 0.1, repeat: isStrumming ? 5 : 0 }}
                    className="w-1 bg-zinc-700 h-full relative"
                  >
                    {/* Muted/Open Markers */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-black text-2xl">
                      {(isProfessorMode && customChord ? customChord : selectedChord).mutedStrings.includes(s) && <span className="text-red-500 drop-shadow-sm">×</span>}
                      {(isProfessorMode && customChord ? customChord : selectedChord).openStrings.includes(s) && <span className="text-emerald-500 drop-shadow-sm">○</span>}
                    </div>

                    {/* Fret Click Areas (Professor Mode) */}
                    {isProfessorMode && [1, 2, 3, 4].map(fret => (
                      <div 
                        key={fret}
                        onClick={() => handleFretClick(s, fret)}
                        className="absolute w-12 h-20 -left-6 cursor-pointer z-20 hover:bg-white/5 transition-colors"
                        style={{ top: `${(fret * 25) - 25}%` }}
                      />
                    ))}
                  </motion.div>
                ))}

                {/* Fingers */}
                <AnimatePresence mode="popLayout">
                  {(isProfessorMode && customChord ? customChord : selectedChord).fingers.map((f, i) => (
                    <motion.div
                      key={`${selectedChord.name}-${i}`}
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shadow-2xl flex items-center justify-center font-black text-white text-lg md:text-xl ${selectedChord.color} bg-gradient-to-br ${selectedChord.gradient} z-30`}
                      style={{
                        left: `${((f.string - 1) * (100 / (numStrings - 1))) + 0}%`,
                        top: `${(f.fret * 25) - 12.5}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {f.finger}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Frets */}
              <div className="flex flex-col justify-between h-96 absolute inset-0 py-12 pointer-events-none">
                {[1, 2, 3, 4].map((f) => (
                  <div key={f} className="h-1.5 bg-zinc-800 w-full shadow-sm"></div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={playChord}
                className="flex-1 bg-redhouse-primary text-white py-5 rounded-[28px] font-black uppercase tracking-widest hover:bg-redhouse-primary/90 transition-all shadow-xl flex items-center justify-center gap-4 text-lg border-b-8 border-redhouse-primary/70 active:border-b-0"
              >
                <Play className="w-6 h-6 fill-white" />
                Tocar Acorde
              </motion.button>
              
              <div className="bg-zinc-900 dark:bg-black text-white p-5 rounded-[28px] flex flex-col items-center justify-center text-center min-w-[120px] border-4 border-zinc-800 shadow-lg">
                <Star className="w-5 h-5 text-yellow-400 mb-1 animate-pulse" />
                <span className="text-[9px] font-black uppercase opacity-60">Recompensa</span>
                <span className="font-black text-lg text-redhouse-primary">+5 XP</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={playIndividualNotes}
              className="mt-4 w-full max-w-lg bg-blue-500 text-white py-4 rounded-[28px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 text-md border-b-8 border-blue-700 active:border-b-0"
            >
              <Music className="w-5 h-5" />
              Tocar Notas Individuais
            </motion.button>
          </div>

          {/* Notes and Frequencies Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[40px] border-4 border-zinc-900 dark:border-zinc-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-redhouse-primary"></div>
            <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <Info className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              Composição do Som
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(isProfessorMode && customChord ? customChord : selectedChord).notes.map((freq, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex flex-col p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border-2 border-zinc-100 dark:border-zinc-800 transition-colors shadow-sm"
                >
                  <span className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Nota {i+1}</span>
                  <span className="font-black text-xl text-zinc-900 dark:text-white">{(isProfessorMode && customChord ? customChord : selectedChord).noteNames[i]}</span>
                  <span className="text-[10px] font-black text-blue-500 mt-2">{freq.toFixed(2)} Hz</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-zinc-100 dark:bg-zinc-800/50 p-6 md:p-8 rounded-[40px] flex items-start gap-6 border-4 border-zinc-900 dark:border-zinc-800">
        <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl border-4 border-zinc-900 dark:border-zinc-800 flex items-center justify-center text-3xl shadow-lg shrink-0">💡</div>
        <div>
          <h4 className="font-black text-xl mb-2 uppercase italic text-zinc-900 dark:text-white">Como ler o diagrama?</h4>
          <ul className="text-zinc-600 dark:text-zinc-400 font-bold space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-emerald-600 font-black">○</span> significa corda solta (pode tocar!)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-red-600 font-black">×</span> significa corda abafada (não toque!)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-zinc-900 dark:bg-white rounded-full"></span>
              Os números dentro das bolinhas indicam qual dedo usar (1=Indicador, 2=Médio...)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
