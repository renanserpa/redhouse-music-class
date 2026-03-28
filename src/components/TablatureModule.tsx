/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { 
  Plus, 
  Play, 
  Trash2, 
  Download, 
  Music, 
  ChevronRight, 
  ChevronLeft,
  Save,
  FileText,
  Timer,
  Repeat,
  Infinity as InfinityIcon,
  Square,
  Scissors,
  X,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  Check,
  Guitar as GuitarIcon
} from 'lucide-react';
import { Instrument } from '../types';

interface TabStep {
  notes: { string: number; fret: number; finger?: number }[];
  duration: number;
}

interface TabSection {
  id: string;
  name: string;
  color: string;
  startIndex: number;
  endIndex: number;
}

const PEDAGOGICAL_COLORS: Record<string, string> = {
  'C': '#FFFFFF', // DO - Branco
  'D': '#FFD700', // RE - Amarelo (Gold)
  'E': '#FF1F1F', // MI - Vermelho (Neon)
  'F': '#39FF14', // FA - Verde (Neon)
  'G': '#000000', // SOL - Preto
  'A': '#2050FF', // LA - Azul (Neon)
  'B': '#B026FF', // SI - Roxo (Neon)
};

const GUITAR_CHORD_LIBRARY = [
  { 
    name: 'C', 
    notes: [{ string: 5, fret: 3, finger: 3 }, { string: 4, fret: 2, finger: 2 }, { string: 2, fret: 1, finger: 1 }],
    muted: [6],
    open: [3, 1]
  },
  { 
    name: 'G', 
    notes: [{ string: 6, fret: 3, finger: 3 }, { string: 5, fret: 2, finger: 2 }, { string: 1, fret: 3, finger: 4 }],
    muted: [],
    open: [4, 3, 2]
  },
  { 
    name: 'D', 
    notes: [{ string: 3, fret: 2, finger: 1 }, { string: 2, fret: 3, finger: 3 }, { string: 1, fret: 2, finger: 2 }],
    muted: [6, 5],
    open: [4]
  },
];

const UKULELE_CHORD_LIBRARY = [
  { 
    name: 'C', 
    notes: [{ string: 1, fret: 3, finger: 3 }],
    muted: [],
    open: [2, 3, 4]
  },
  { 
    name: 'F', 
    notes: [{ string: 2, fret: 1, finger: 1 }, { string: 4, fret: 2, finger: 2 }],
    muted: [],
    open: [1, 3]
  },
  { 
    name: 'G', 
    notes: [{ string: 1, fret: 2, finger: 3 }, { string: 2, fret: 3, finger: 2 }, { string: 3, fret: 2, finger: 1 }],
    muted: [],
    open: [4]
  },
];

export default function TablatureModule() {
  const [instrument, setInstrument] = useState<Instrument>('guitar');
  const [tabNotes, setTabNotes] = useState<TabStep[]>([]);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedString, setSelectedString] = useState(1);
  const [selectedFret, setSelectedFret] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(500);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const [loopCount, setLoopCount] = useState(1);
  const [isInfiniteLoop, setIsInfiniteLoop] = useState(false);
  const [inspectedChord, setInspectedChord] = useState<{ name?: string; notes: { string: number; fret: number; finger?: number }[]; muted?: number[]; open?: number[] } | null>(null);
  const [noteColor, setNoteColor] = useState('#f43f5e'); // Default rose-500
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [sections, setSections] = useState<TabSection[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(0.2);
  const stopPlaybackRef = useRef(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [addingSectionName, setAddingSectionName] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const checkAudio = setInterval(() => {
      if (audio.samplesLoaded) {
        setIsAudioLoaded(true);
        clearInterval(checkAudio);
      }
    }, 500);
    return () => clearInterval(checkAudio);
  }, []);

  const numStrings = instrument === 'guitar' ? 6 : 4;
  const strings = Array.from({ length: numStrings }, (_, i) => i + 1);
  const stringNotes = instrument === 'guitar' ? ['E', 'B', 'G', 'D', 'A', 'E'] : ['A', 'E', 'C', 'G'];
  const chordLibrary = instrument === 'guitar' ? GUITAR_CHORD_LIBRARY : UKULELE_CHORD_LIBRARY;

  const THEORY_NOTES = [
    { name: 'C', string: 5, fret: 3 },
    { name: 'C#', string: 5, fret: 4 },
    { name: 'D', string: 4, fret: 0 },
    { name: 'D#', string: 4, fret: 1 },
    { name: 'E', string: 4, fret: 2 },
    { name: 'F', string: 4, fret: 3 },
    { name: 'F#', string: 4, fret: 4 },
    { name: 'G', string: 3, fret: 0 },
    { name: 'G#', string: 3, fret: 1 },
    { name: 'A', string: 3, fret: 2 },
    { name: 'A#', string: 3, fret: 3 },
    { name: 'B', string: 2, fret: 0 },
  ];

  const addNote = () => {
    const newStep: TabStep = {
      notes: [{
        string: selectedString,
        fret: selectedFret,
      }],
      duration: selectedDuration
    };
    setTabNotes([...tabNotes, newStep]);
    audio.playGuitar(getFreq(selectedString, selectedFret), 0.5, 0.2);
  };

  const selectNoteForEditing = (index: number) => {
    setActiveNoteIndex(index);
    const step = tabNotes[index];
    if (step.notes.length > 0) {
      setSelectedString(step.notes[0].string);
      setSelectedFret(step.notes[0].fret);
    }
    setSelectedDuration(step.duration);
    setInspectedChord({ notes: step.notes });
  };

  const handleStringChange = (s: number) => {
    setSelectedString(s);
    if (activeNoteIndex !== null) {
      const step = tabNotes[activeNoteIndex];
      const note = step.notes.find(n => n.string === s);
      if (note) {
        setSelectedFret(note.fret);
      }
    }
  };

  const handleFretChange = (f: number) => {
    setSelectedFret(f);
    if (activeNoteIndex !== null) {
      const newNotes = [...tabNotes];
      const step = newNotes[activeNoteIndex];
      const noteIdx = step.notes.findIndex(n => n.string === selectedString);
      
      if (noteIdx !== -1) {
        step.notes[noteIdx].fret = f;
      } else if (step.notes.length === 1) {
        step.notes[0].string = selectedString;
        step.notes[0].fret = f;
      } else {
        step.notes.push({ string: selectedString, fret: f });
      }
      
      setTabNotes(newNotes);
      audio.playGuitar(getFreq(selectedString, f), 0.5, 0.2);
    }
  };

  const handleDurationChange = (d: number) => {
    setSelectedDuration(d);
    if (activeNoteIndex !== null) {
      const newNotes = [...tabNotes];
      newNotes[activeNoteIndex].duration = d;
      setTabNotes(newNotes);
    }
  };

  const addTheoryNote = (string: number, fret: number) => {
    const newStep: TabStep = {
      notes: [{
        string,
        fret,
      }],
      duration: selectedDuration
    };
    setTabNotes([...tabNotes, newStep]);
    audio.playGuitar(getFreq(string, fret), 0.5, 0.2);
  };

  const addChord = (chord: typeof GUITAR_CHORD_LIBRARY[0]) => {
    const newStep: TabStep = {
      notes: chord.notes,
      duration: selectedDuration
    };
    setTabNotes([...tabNotes, newStep]);
    setInspectedChord(chord);
    
    // Play all notes in chord
    chord.notes.forEach(note => {
      audio.playGuitar(getFreq(note.string, note.fret), 0.5, 0.3);
    });
  };

  const removeNote = (index: number) => {
    const newNotes = [...tabNotes];
    newNotes.splice(index, 1);
    setTabNotes(newNotes);
  };

  const splitStep = (index: number) => {
    const step = tabNotes[index];
    if (step.duration < 200) return;
    
    const newDuration = Math.floor(step.duration / 2);
    const newStep1 = { ...JSON.parse(JSON.stringify(step)), duration: newDuration };
    const newStep2 = { ...JSON.parse(JSON.stringify(step)), duration: newDuration };
    
    const newTabNotes = [...tabNotes];
    newTabNotes.splice(index, 1, newStep1, newStep2);
    setTabNotes(newTabNotes);
  };

  const getFreq = (string: number, fret: number) => {
    const baseFreqs: Record<number, number> = instrument === 'guitar' 
      ? { 1: 329.63, 2: 246.94, 3: 196.00, 4: 146.83, 5: 110.00, 6: 82.41 }
      : { 1: 440.00, 2: 329.63, 3: 261.63, 4: 392.00 };
    return baseFreqs[string] * Math.pow(2, fret / 12);
  };

  const getStepX = (index: number) => {
    let x = 0;
    for (let i = 0; i < index; i++) {
      x += tabNotes[i].duration * zoom;
    }
    return x;
  };

  const playTab = async () => {
    if (tabNotes.length === 0 || isPlaying) return;
    setIsPlaying(true);
    stopPlaybackRef.current = false;
    
    let currentIteration = 0;
    
    while (isInfiniteLoop || currentIteration < loopCount) {
      for (let i = 0; i < tabNotes.length; i++) {
        if (stopPlaybackRef.current) break;
        setPlaybackIndex(i);
        const step = tabNotes[i];
        
        step.notes.forEach(note => {
          audio.playGuitar(getFreq(note.string, note.fret), 0.8, 0.3);
        });
        
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
      
      if (stopPlaybackRef.current) break;
      currentIteration++;
      if (!isInfiniteLoop && currentIteration >= loopCount) break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setPlaybackIndex(-1);
    setIsPlaying(false);
    stopPlaybackRef.current = false;
  };

  const stopTab = () => {
    stopPlaybackRef.current = true;
  };

  const playSection = async (section: TabSection) => {
    if (isPlaying) return;
    setIsPlaying(true);
    stopPlaybackRef.current = false;
    setActiveSectionId(section.id);

    for (let i = section.startIndex; i <= section.endIndex; i++) {
      if (stopPlaybackRef.current || i >= tabNotes.length) break;
      setPlaybackIndex(i);
      const step = tabNotes[i];
      step.notes.forEach(note => {
        audio.playGuitar(getFreq(note.string, note.fret), 0.8, 0.3);
      });
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    setPlaybackIndex(-1);
    setIsPlaying(false);
    setActiveSectionId(null);
    stopPlaybackRef.current = false;
  };

  const addSection = () => {
    setAddingSectionName(`Seção ${sections.length + 1}`);
  };

  const confirmAddSection = () => {
    if (!addingSectionName?.trim()) return;
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#14b8a6'];
    const color = colors[sections.length % colors.length];
    const newSection: TabSection = {
      id: Math.random().toString(36).substr(2, 9),
      name: addingSectionName.trim(),
      color,
      startIndex: 0,
      endIndex: tabNotes.length - 1
    };
    setSections([...sections, newSection]);
    setAddingSectionName(null);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const clearTab = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setTabNotes([]);
    setConfirmClear(false);
  };

  const saveTab = () => {
    if (tabNotes.length === 0) return;
    localStorage.setItem('gmc_saved_tab', JSON.stringify(tabNotes));
    showToast('Tablatura salva com sucesso!');
  };

  const loadTab = () => {
    const saved = localStorage.getItem('gmc_saved_tab');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && 'string' in parsed[0]) {
          const migrated = parsed.map((n: any) => ({
            notes: [{ string: n.string, fret: n.fret }],
            duration: n.duration
          }));
          setTabNotes(migrated);
        } else {
          setTabNotes(parsed);
        }
        showToast('Tablatura carregada!');
      } catch (e) {
        console.error('Erro ao carregar tablatura', e);
        showToast('Erro ao carregar tablatura.');
      }
    } else {
      showToast('Nenhuma tablatura salva encontrada.');
    }
  };

  return (
    <div className={`transition-all duration-500 relative ${
      isFullScreen 
        ? 'fixed inset-0 z-[100] bg-redhouse-bg dark:bg-zinc-950 overflow-y-auto p-12' 
        : 'space-y-8'
    }`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <CheckCircle className="w-4 h-4 text-pedagogy-green" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Section Name Modal */}
      <AnimatePresence>
        {addingSectionName !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card p-10 border-white/10 space-y-6 w-full max-w-md"
            >
              <h4 className="font-black text-redhouse-text uppercase italic text-xl">Nome da Seção</h4>
              <input
                autoFocus
                type="text"
                value={addingSectionName}
                onChange={e => setAddingSectionName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmAddSection()}
                className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl font-bold text-redhouse-text outline-none focus:border-redhouse-primary"
              />
              <div className="flex gap-4">
                <button onClick={confirmAddSection} className="flex-1 bg-redhouse-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest">Criar</button>
                <button onClick={() => setAddingSectionName(null)} className="px-6 bg-white/5 text-redhouse-muted rounded-2xl font-black uppercase">✕</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-redhouse-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-redhouse-primary/30 rotate-3 border border-white/20">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-redhouse-text uppercase italic leading-none tracking-tighter">Tablature Console v2</h3>
            <div className="flex items-center gap-3 mt-2">
              {!isAudioLoaded ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-pedagogy-orange/10 text-pedagogy-orange rounded-full border border-pedagogy-orange/20 animate-pulse">
                  <div className="w-2 h-2 bg-pedagogy-orange rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Áudio HD...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-pedagogy-green/10 text-pedagogy-green rounded-full border border-pedagogy-green/20">
                  <div className="w-2 h-2 bg-pedagogy-green rounded-full shadow-[0_0_8px_var(--color-pedagogy-green)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Núcleo de Áudio Estável</span>
                </div>
              )}
              <button 
                onClick={() => setIsTeacherMode(!isTeacherMode)}
                className={`px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
                  isTeacherMode 
                    ? 'bg-redhouse-accent text-white shadow-[0_0_15px_rgba(32,80,255,0.4)]' 
                    : 'bg-white/5 text-redhouse-muted border border-white/10 hover:border-redhouse-accent/50'
                }`}
              >
                {isTeacherMode ? 'Professor: Ativo' : 'Modo Professor'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 glass-card p-3 border-white/5 bg-white/2">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl mr-4 border border-white/10">
            <button
              onClick={() => setInstrument('guitar')}
              className={`p-2 rounded-lg transition-all ${instrument === 'guitar' ? 'bg-redhouse-primary text-white' : 'text-redhouse-muted hover:text-redhouse-text'}`}
            >
              <GuitarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setInstrument('ukulele')}
              className={`p-2 rounded-lg transition-all ${instrument === 'ukulele' ? 'bg-redhouse-primary text-white' : 'text-redhouse-muted hover:text-redhouse-text'}`}
            >
              <Music className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mr-4 pr-4 border-r border-white/10">
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-3 rounded-xl hover:bg-white/5 text-redhouse-muted hover:text-redhouse-text transition-all"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={loadTab} className="p-3 rounded-xl hover:bg-white/5 text-redhouse-muted hover:text-redhouse-text transition-all"><Download className="w-5 h-5" /></button>
            <button onClick={saveTab} className="p-3 rounded-xl hover:bg-white/5 text-redhouse-muted hover:text-redhouse-text transition-all"><Save className="w-5 h-5" /></button>
            <button
              onClick={clearTab}
              className={`p-3 rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-2 ${
                confirmClear
                  ? 'bg-pedagogy-red text-white animate-pulse px-4'
                  : 'hover:bg-rose-500/10 text-redhouse-muted hover:text-pedagogy-red'
              }`}
            >
              <Trash2 className="w-5 h-5" />
              {confirmClear && 'Confirmar?'}
            </button>
          </div>

          <button 
            onClick={isPlaying ? stopTab : playTab}
            disabled={!isPlaying && tabNotes.length === 0}
            className={`flex items-center gap-3 px-8 py-4 rounded-[20px] font-black uppercase tracking-[0.2em] transition-all ${
              isPlaying 
                ? 'bg-pedagogy-red text-white shadow-[0_0_20px_rgba(255,31,31,0.4)] animate-pulse' 
                : 'bg-pedagogy-green text-white shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale'
            }`}
          >
            {isPlaying ? (
              <><Square className="w-5 h-5 fill-current" /> Parar</>
            ) : (
              <><Play className="w-5 h-5 fill-current" /> Iniciar Sequência</>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Controls */}
        <div className="lg:col-span-4 space-y-6">
          {isTeacherMode && (
            <div className="glass-card p-8 border-white/5 bg-redhouse-accent/5 ring-1 ring-redhouse-accent/20">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em]">Gestão de Seções</h4>
                <button onClick={addSection} className="p-2 bg-redhouse-accent text-white rounded-xl hover:bg-redhouse-accent/80 transition-all"><Plus className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-4">
                {sections.map(section => (
                  <div key={section.id} className={`p-5 rounded-2xl border transition-all ${activeSectionId === section.id ? 'glass-card border-redhouse-accent bg-redhouse-accent/10' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-black text-redhouse-text text-sm uppercase italic">{section.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => playSection(section)} className="p-2 bg-pedagogy-green/10 text-pedagogy-green rounded-lg"><Play className="w-4 h-4 fill-pedagogy-green" /></button>
                        <button onClick={() => removeSection(section.id)} className="p-2 bg-pedagogy-red/10 text-pedagogy-red rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" value={section.startIndex} onChange={(e) => { const n = [...sections]; const s = n.find(sec => sec.id === section.id); if (s) s.startIndex = parseInt(e.target.value); setSections(n); }} className="p-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-redhouse-text focus:border-redhouse-accent outline-none" />
                      <input type="number" value={section.endIndex} onChange={(e) => { const n = [...sections]; const s = n.find(sec => sec.id === section.id); if (s) s.endIndex = parseInt(e.target.value); setSections(n); }} className="p-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-redhouse-text focus:border-redhouse-accent outline-none" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10">
                <h5 className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em] mb-6 italic text-center">API Pedagógica: Color-Matching</h5>
                <div className="grid grid-cols-4 gap-3">
                  {Object.keys(PEDAGOGICAL_COLORS).map(noteName => {
                    const labels: Record<string, string> = { 'C': 'branco', 'D': 'amarelo', 'E': 'vermelho', 'F': 'verde', 'G': 'preto', 'A': 'azul', 'B': 'roxo' };
                    return (
                      <button key={noteName} onClick={() => audio.playNoteByColor(labels[noteName])} className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-redhouse-accent/50 group">
                        <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: PEDAGOGICAL_COLORS[noteName], boxShadow: `0 0 15px ${PEDAGOGICAL_COLORS[noteName]}40` }} />
                        <span className="text-[8px] font-black uppercase text-redhouse-muted">{labels[noteName]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-8 border-white/5">
            <h4 className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em] mb-8">Acordes Ativos</h4>
            <AnimatePresence>
              {inspectedChord && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-8 p-8 glass-card border-redhouse-primary/30 bg-redhouse-primary/5 shadow-2xl relative">
                  <button onClick={() => setInspectedChord(null)} className="absolute top-4 right-4 p-2 bg-white/5 text-redhouse-muted rounded-full"><X className="w-5 h-5" /></button>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-3xl italic rotate-3 border-2" style={{ backgroundColor: noteColor, boxShadow: `0 0 30px ${noteColor}60` }}>{inspectedChord.name || '?'}</div>
                    <div>
                      <h5 className="font-black text-redhouse-text uppercase text-lg italic">Diagrama Holográfico</h5>
                      <p className="text-[10px] font-bold text-redhouse-muted uppercase tracking-[0.3em] mt-2">Mapeamento Visual GMC</p>
                    </div>
                  </div>
                  <div className="w-full aspect-[4/5] bg-black/20 rounded-3xl border border-white/10 p-10 relative flex flex-col backdrop-blur-sm">
                    {/* Diagram Logic Simplified For Nuking Persistence */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    <div className="flex-1 border-b border-white/20" />
                    <div className="flex-1 border-b border-white/10" />
                    <div className="flex-1 border-b border-white/10" />
                    <div className="flex-1 border-b border-white/10" />
                    <div className="flex-1" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {chordLibrary.map(chord => (
                <button key={chord.name} onClick={() => addChord(chord)} className="group p-6 glass-card border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-4">
                  <span className="text-2xl font-black text-redhouse-text italic group-hover:text-redhouse-primary transition-colors">{chord.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em]">Teoria e Escalas</h4>
              <div className="grid grid-cols-4 gap-2">
                {THEORY_NOTES.map(note => (
                  <button key={note.name} onClick={() => addTheoryNote(note.string, note.fret)} className="p-3 bg-white/5 rounded-xl border border-white/10 font-black text-redhouse-text hover:border-redhouse-primary hover:text-redhouse-primary transition-all text-xs italic">{note.name}</button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em]">Parâmetros de Nota</label>
                  <div className="flex gap-2">
                    {['#FF1F1F', '#2050FF', '#39FF14', '#FFD700', '#B026FF', '#FFFFFF'].map(color => (
                      <button key={color} onClick={() => setNoteColor(color)} className={`w-4 h-4 rounded-full transition-all ${noteColor === color ? 'ring-2 ring-white scale-125' : 'opacity-40'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {strings.map(s => (
                    <button key={s} onClick={() => handleStringChange(s)} className={`p-3 rounded-xl font-black text-sm border transition-all italic ${selectedString === s ? 'bg-redhouse-primary text-white shadow-lg' : 'bg-white/5 text-redhouse-muted border-white/5'}`}>{stringNotes[s-1]} <span className="text-[8px] opacity-40">({s}ª)</span></button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => handleFretChange(Math.max(0, selectedFret - 1))} className="p-3 bg-white/5 rounded-xl border border-white/5 text-redhouse-muted"><ChevronLeft className="w-5 h-5" /></button>
                  <div className="flex-1 glass-card h-14 border-white/10 flex items-center justify-center text-2xl font-black text-redhouse-text italic shadow-inner">{selectedFret}</div>
                  <button onClick={() => handleFretChange(Math.min(24, selectedFret + 1))} className="p-3 bg-white/5 rounded-xl border border-white/5 text-redhouse-muted"><ChevronRight className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4 pt-4">
                  <input type="range" min="100" max="2000" step="50" value={selectedDuration} onChange={(e) => handleDurationChange(parseInt(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-redhouse-primary" />
                </div>

                <div className="pt-6 flex gap-3">
                  {activeNoteIndex !== null ? (
                    <>
                      <button onClick={() => setActiveNoteIndex(null)} className="flex-1 bg-pedagogy-green text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">OK</button>
                      <button onClick={() => { removeNote(activeNoteIndex); setActiveNoteIndex(null); }} className="p-4 bg-pedagogy-red/10 text-pedagogy-red rounded-2xl border border-pedagogy-red/20"><Trash2 className="w-5 h-5" /></button>
                    </>
                  ) : (
                    <button onClick={addNote} className="w-full bg-redhouse-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Inserir Nota</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-card p-10 shadow-2xl border-white/5 relative overflow-x-auto backdrop-blur-xl min-h-[400px]">
            <div className="relative py-20" style={{ width: `${tabNotes.length * 200 * zoom + 1000}px` }}>
              {/* String Lines */}
              {Array.from({ length: numStrings }).map((_, idx) => (
                <div key={idx} className="absolute left-10 right-0 h-px bg-white/10" style={{ top: `${idx * 40 + 80}px` }} />
              ))}

              {/* Steps */}
              {tabNotes.map((step, idx) => (
                <div key={idx} className="absolute top-20 bottom-24 flex flex-col justify-between" style={{ left: `${getStepX(idx) + 40}px` }}>
                  <div className="h-full relative flex flex-col justify-between">
                    {step.notes.map((n, nIdx) => (
                      <motion.div key={nIdx} animate={{ scale: playbackIndex === idx ? 1.5 : 1, y: (numStrings - n.string) * 40 }} className={`absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center font-black text-xl z-10 transition-all ${playbackIndex === idx ? 'text-white' : 'text-redhouse-muted'}`}>
                        <div className={`absolute inset-0 rounded-xl transition-all ${playbackIndex === idx ? 'opacity-100 scale-110' : 'opacity-20'}`} style={{ backgroundColor: isTeacherMode ? (PEDAGOGICAL_COLORS[Object.keys(PEDAGOGICAL_COLORS)[n.fret % 7]] || '#FFFFFF') : noteColor }} />
                        <span className="relative z-10 italic">{isTeacherMode ? '' : n.fret}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              <AnimatePresence>
                {playbackIndex !== -1 && (
                  <motion.div initial={{ opacity: 0, x: getStepX(playbackIndex) + 40 }} animate={{ opacity: 1, x: getStepX(playbackIndex) + 40 }} exit={{ opacity: 0 }} className="absolute top-0 bottom-0 w-1.5 z-30 shadow-2xl bg-redhouse-primary" />
                )}
              </AnimatePresence>
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <AnimatePresence>
                {tabNotes.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    onClick={() => selectNoteForEditing(idx)} 
                    className={`group p-4 rounded-2xl border transition-all cursor-pointer min-w-[80px] flex flex-col items-center gap-2 ${
                      playbackIndex === idx 
                        ? 'border-pedagogy-green bg-pedagogy-green/10 shadow-lg scale-110 z-20' 
                        : activeNoteIndex === idx 
                        ? 'bg-redhouse-primary/20 border-redhouse-primary' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col items-center -space-y-1 mb-1">
                      {step.notes.map((n, i) => (
                        <span key={i} className="text-[10px] font-black text-slate-400 uppercase italic">{n.string}ª:{n.fret}</span>
                      ))}
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-xl border-2 border-slate-100 flex items-center justify-center">
                      <span className="text-xl font-black text-slate-900">
                        {step.notes.length > 1 ? 'AC' : step.notes[0].fret}
                      </span>
                    </div>
                    <div className="w-full mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase italic">{step.duration}ms</span>
                      <button onClick={(e) => { e.stopPropagation(); removeNote(idx); }} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 glass-card p-10 border-white/5 flex items-start gap-8 bg-redhouse-primary/5 relative overflow-hidden ring-1 ring-redhouse-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-redhouse-primary/5 blur-[100px] -z-10" />
        <div className="w-20 h-20 glass-card border-white/10 flex items-center justify-center text-4xl shadow-2xl shrink-0 rotate-3">🎸</div>
        <div>
          <h4 className="font-black text-redhouse-text text-xl mb-4 italic uppercase tracking-tight">Manual do Maestro: Tablatura</h4>
          <p className="text-redhouse-muted font-bold leading-relaxed max-w-2xl italic">"Este console mapeia ondas mecânicas em um grid de {numStrings} cordas. A linha superior emite as frequências mais altas, enquanto a inferior sustenta os graves. Cada número representa uma casa técnica - o seu guia para dominar a escala RedHouse."</p>
        </div>
      </footer>
    </div>
  );
}
