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
        audio.playTone(freq, '4n');
      }, i * 60);
    });
    addXP(5);
    setTimeout(() => setIsStrumming(false), 600);
  };

  const playIndividualNotes = () => {
    const chordToPlay = isProfessorMode && customChord ? customChord : selectedChord;
    chordToPlay.notes.forEach((freq, i) => {
      setTimeout(() => {
        audio.playTone(freq, '4n');
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
    <section className="bg-slate-950 rounded-[40px] p-6 md:p-8 shadow-2xl border-4 border-slate-900 transition-all relative overflow-hidden text-white font-sans">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%] opacity-10"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3 border-2 border-slate-700">
            <GuitarIcon className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter shrink-0">Chord Laboratory</h3>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Mapeamento de Ressonância</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-800 shadow-xl">
            <button
              onClick={() => { audio.playClick(); setInstrument('guitar'); }}
              className={`px-5 py-2.5 rounded-xl font-black uppercase italic text-xs transition-all flex items-center gap-2 ${
                instrument === 'guitar' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <GuitarIcon className="w-4 h-4" /> Violão
            </button>
            <button
              onClick={() => { audio.playClick(); setInstrument('ukulele'); }}
              className={`px-5 py-2.5 rounded-xl font-black uppercase italic text-xs transition-all flex items-center gap-2 ${
                instrument === 'ukulele' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Music className="w-4 h-4" /> Ukulele
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { audio.playClick(); toggleProfessorMode(); }}
            className={`px-6 py-3 rounded-2xl font-black uppercase italic text-sm transition-all flex items-center gap-2 border-2 shadow-xl shrink-0 ${
              isProfessorMode 
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Pencil className="w-4 h-4" />
            {isProfessorMode ? 'Sair do Modo' : 'Professor'}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Chord Selection Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Chord Library DB</h4>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{chords.length} SLOTS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[520px] overflow-y-auto pr-2 scrollbar-hide">
            {chords.map((chord) => (
              <motion.button
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                key={chord.name}
                onClick={() => {
                  audio.playClick();
                  setSelectedChord(chord);
                  if (isProfessorMode) setCustomChord({ ...chord });
                }}
                className={`w-full p-5 rounded-[2.5rem] border-4 transition-all flex items-center justify-between group relative overflow-hidden ${
                  selectedChord.name === chord.name 
                    ? 'border-white bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.2)] z-10' 
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 shadow-xl'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl ${chord.color} flex items-center justify-center text-white shadow-inner border-2 border-white/20 -rotate-3 transition-transform group-hover:rotate-0`}>
                    <Music className="w-6 h-6" />
                  </div>
                  <span className="font-black text-xl italic tracking-tighter uppercase">{chord.name}</span>
                </div>
                {selectedChord.name === chord.name && <motion.div layoutId="active-dot" className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></motion.div>}
              </motion.button>
            ))}
            
            {isProfessorMode && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                className="w-full p-5 rounded-[2.5rem] border-4 border-dashed border-slate-800 text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-3 font-black uppercase italic text-sm bg-indigo-500/5"
              >
                <Plus className="w-5 h-5" /> Novo Acorde
              </motion.button>
            )}
          </div>
        </div>

        {/* Visualization and Details Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900 rounded-[4rem] p-6 md:p-10 border-4 border-slate-800 shadow-inner flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]"></div>
            
            <div className="w-full max-w-[340px] bg-black rounded-[3.5rem] p-12 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] mb-12 border-[12px] border-slate-800">
              {/* Nut */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-600 to-slate-800 rounded-t-[2.5rem] border-b-4 border-slate-950 flex items-center justify-center text-[10px] font-black text-slate-900 tracking-widest uppercase">NUT_PRIMARY</div>
              
              {/* Strings */}
              <div className="flex justify-between h-[450px] px-8 relative">
                {strings.map((s) => (
                  <motion.div 
                    key={s} 
                    animate={isStrumming ? { x: [0, 1, -1, 0], opacity: [1, 0.8, 1] } : {}}
                    transition={{ duration: 0.1, repeat: isStrumming ? 3 : 0 }}
                    className="w-[3px] bg-slate-700 h-full relative"
                  >
                    {/* Shadow for strings */}
                    <div className="absolute inset-0 blur-[1px] bg-cyan-500/10 mix-blend-screen"></div>

                    {/* Muted/Open Markers */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 font-black text-3xl italic">
                      {(isProfessorMode && customChord ? customChord : selectedChord).mutedStrings.includes(s) && <span className="text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">×</span>}
                      {(isProfessorMode && customChord ? customChord : selectedChord).openStrings.includes(s) && <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">○</span>}
                    </div>

                    {/* Fret Click Areas (Professor Mode) */}
                    {isProfessorMode && [1, 2, 4, 6].map((fret, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleFretClick(s, idx + 1)}
                        className="absolute w-12 h-20 -left-6 cursor-pointer z-50 hover:bg-white/10 transition-colors rounded-xl"
                        style={{ top: `${(idx * 25) + 5}%` }}
                      />
                    ))}
                  </motion.div>
                ))}

                {/* Fingers */}
                <AnimatePresence mode="popLayout">
                  {(isProfessorMode && customChord ? customChord : selectedChord).fingers.map((f, i) => (
                    <motion.div
                      key={`${selectedChord.name}-${i}`}
                      initial={{ scale: 0, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`
                        absolute w-12 h-12 rounded-full border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center font-black text-white text-xl 
                        ${selectedChord.color} z-[60] group/finger
                      `}
                      style={{
                        left: `${((f.string - 1) * (100 / (numStrings - 1))) + 0}%`,
                        top: `${(f.fret * 25) - 12.5}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
                      {f.finger}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Frets */}
              <div className="flex flex-col justify-between h-[450px] absolute inset-0 py-12 pointer-events-none px-6">
                {[1, 2, 3, 4].map((f) => (
                  <div key={f} className="h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 w-full shadow-2xl border-y border-slate-900/50"></div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { audio.playStart(); playChord(); }}
                className="flex-1 bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 text-xl border-b-8 border-emerald-800 active:border-b-0"
              >
                <Play className="w-8 h-8 fill-white" /> TOCAR ACORDE
              </motion.button>
              
              <div className="bg-slate-950 p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center min-w-[140px] border-4 border-slate-800 shadow-xl">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Ressonância</p>
                <p className="font-black text-xl text-emerald-500 italic tracking-tighter leading-none">+5 XP</p>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { audio.playClick(); playIndividualNotes(); }}
              className="mt-6 w-full max-w-lg bg-slate-800 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-xl flex items-center justify-center gap-3 text-sm border-b-4 border-slate-950 active:border-b-0"
            >
              <Music className="w-5 h-5 text-cyan-400" />
              Tocar Notas Individuais
            </motion.button>
          </div>

          {/* Composition Details Column */}
          <div className="bg-slate-900 p-8 rounded-[4rem] border-4 border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <Info className="w-4 h-4 text-cyan-500" />
              </div>
              Composition Analysis
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(isProfessorMode && customChord ? customChord : selectedChord).notes.map((freq, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex flex-col p-5 bg-slate-950 rounded-[2rem] border-2 border-slate-800 transition-all hover:border-emerald-500/30 group"
                >
                  <span className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">OSN_{i+1}</span>
                  <span className="font-black text-2xl text-white italic tracking-tighter group-hover:text-emerald-500 transition-colors">{(isProfessorMode && customChord ? customChord : selectedChord).noteNames[i]}</span>
                  <div className="w-full h-1 bg-slate-900 rounded-full mt-3 relative overflow-hidden">
                    <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ delay: 0.5 + i * 0.1 }} className="absolute inset-0 bg-cyan-500 opacity-30"></motion.div>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 mt-2 font-mono">{freq.toFixed(2)} Hz</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-slate-900/50 p-8 rounded-[4rem] flex flex-col md:flex-row items-center gap-8 border-4 border-slate-800/50 backdrop-blur-sm relative z-10">
        <div className="w-20 h-20 bg-slate-950 rounded-3xl border-4 border-slate-800 flex items-center justify-center text-4xl shadow-2xl shrink-0 -rotate-6">💡</div>
        <div className="flex-1">
          <h4 className="font-black text-xl mb-3 uppercase italic text-white tracking-tight">Guia de Leitura Dinâmica</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-slate-950 rounded-xl border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg italic shadow-[0_0_15px_rgba(52,211,153,0.2)]">○</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Corda Solta / Ressonante</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-slate-950 rounded-xl border-2 border-rose-500/30 flex items-center justify-center text-rose-500 font-black text-lg shadow-[0_0_15px_rgba(244,63,94,0.2)]">×</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Corda Abafada / Silenciosa</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-slate-950 rounded-xl border-2 border-slate-800 flex items-center justify-center text-white font-black text-lg italic shadow-xl">#</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posicionamento Digital</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
