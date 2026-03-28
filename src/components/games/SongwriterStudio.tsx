/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Songwriter Studio (Emotional Chord Blocks) — Mundo 5, Palco das Músicas
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { audio } from '../../lib/audio';
import { Music, Play, Trash2, Save, Sparkles, Heart, Cloud, Zap, CheckCircle, RotateCcw } from 'lucide-react';

interface ChordBlock {
  id: string;
  chord: string;
  emotion: 'happy' | 'sad' | 'tense' | 'bright';
  color: string;
  glow: string;
  freqs: number[];
}

const EMOTIONAL_CHORDS: ChordBlock[] = [
  { id: 'c-maj', chord: 'C', emotion: 'happy', color: 'bg-emerald-500', glow: 'shadow-emerald-500/50', freqs: [261, 329, 392] },
  { id: 'g-maj', chord: 'G', emotion: 'happy', color: 'bg-emerald-600', glow: 'shadow-emerald-600/50', freqs: [196, 246, 293] },
  { id: 'a-min', chord: 'Am', emotion: 'sad', color: 'bg-amber-500', glow: 'shadow-amber-500/50', freqs: [220, 261, 329] },
  { id: 'e-min', chord: 'Em', emotion: 'sad', color: 'bg-amber-600', glow: 'shadow-amber-600/50', freqs: [164, 196, 246] },
  { id: 'f-maj', chord: 'F', emotion: 'bright', color: 'bg-cyan-500', glow: 'shadow-cyan-500/50', freqs: [174, 220, 261] },
  { id: 'd-min', chord: 'Dm', emotion: 'sad', color: 'bg-orange-500', glow: 'shadow-orange-500/50', freqs: [146, 174, 220] },
  { id: 'g7', chord: 'G7', emotion: 'tense', color: 'bg-rose-500', glow: 'shadow-rose-500/50', freqs: [196, 246, 293, 349] },
  { id: 'e7', chord: 'E7', emotion: 'tense', color: 'bg-rose-600', glow: 'shadow-rose-600/50', freqs: [164, 207, 246, 329] },
];

interface SongwriterStudioProps {
  addXP: (amount: number) => void;
  onComplete: () => void;
}

export default function SongwriterStudio({ addXP, onComplete }: SongwriterStudioProps) {
  const [progression, setProgression] = useState<ChordBlock[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'editing' | 'complete'>('editing');

  const addToProgression = (chord: ChordBlock) => {
    if (progression.length >= 8) return;
    audio.playChord(chord.freqs);
    setProgression([...progression, { ...chord, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeFromProgression = (id: string) => {
    setProgression(progression.filter(c => c.id !== id));
  };

  const playProgression = async () => {
    if (isPlaying || progression.length === 0) return;
    setIsPlaying(true);
    
    for (let i = 0; i < progression.length; i++) {
      setActiveIndex(i);
      await audio.playChord(progression[i].freqs);
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setActiveIndex(null);
    setIsPlaying(false);
  };

  const saveSong = () => {
    if (progression.length < 4) return;
    audio.playLevelUp();
    addXP(100);
    setPhase('complete');
    if (onComplete) onComplete();
  };

  const reset = () => {
    setProgression([]);
    setPhase('editing');
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden text-white group min-h-[600px]">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] -rotate-3 border-2 border-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Songwriter Studio</h3>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Laboratório de Emoções · Mundo 5</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {progression.length >= 4 && (
             <motion.button 
               whileHover={{ scale: 1.05 }} 
               whileTap={{ scale: 0.95 }}
               onClick={saveSong}
               className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 border-b-4 border-emerald-800 transition-all shadow-xl"
             >
               <Save className="w-5 h-5" /> EXPURGAR OBRA 🚀
             </motion.button>
           )}
           <div className="bg-slate-900 px-6 py-3 rounded-2xl border-2 border-slate-800 flex flex-col items-end shadow-xl">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Compassos</p>
             <p className="text-2xl font-black text-cyan-500 font-mono italic leading-none">{progression.length}/8</p>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'editing' ? (
          <motion.div key="editing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 relative z-10">
            
            {/* Timeline Area */}
            <div className="bg-slate-900/80 backdrop-blur-md rounded-[3rem] p-8 border-4 border-slate-800 shadow-inner min-h-[160px] relative overflow-hidden flex items-center justify-center">
              {progression.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-8 opacity-30">
                  <Music className="w-16 h-16 animate-bounce" />
                  <p className="text-xl font-black italic tracking-widest uppercase">Arraste emoções para a linha do tempo</p>
                </div>
              ) : (
                <div className="flex gap-4 w-full overflow-x-auto pb-4 px-4 scrollbar-hide">
                  <Reorder.Group axis="x" values={progression} onReorder={setProgression} className="flex gap-4 w-full justify-center">
                    {progression.map((item, idx) => (
                      <Reorder.Item 
                        key={item.id} 
                        value={item}
                        className={`
                          min-w-[120px] aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-2 border-4 transition-all relative group
                          ${activeIndex === idx ? 'border-white scale-110 shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'border-white/10 shadow-xl'}
                          ${item.color}
                        `}
                      >
                        <button 
                          onClick={() => removeFromProgression(item.id)}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <span className="text-4xl font-black drop-shadow-lg text-white italic">{item.chord}</span>
                        <div className="text-[9px] font-black text-white/60 uppercase tracking-tighter flex items-center gap-1">
                          {item.emotion === 'happy' && <Heart className="w-2.5 h-2.5 fill-current" />}
                          {item.emotion === 'sad' && <Cloud className="w-2.5 h-2.5 fill-current" />}
                          {item.emotion === 'tense' && <Zap className="w-2.5 h-2.5 fill-current" />}
                          {item.emotion === 'bright' && <Sparkles className="w-2.5 h-2.5 fill-current" />}
                          {item.emotion}
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={playProgression}
                disabled={isPlaying || progression.length === 0}
                className={`
                  px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xl flex items-center gap-4 transition-all shadow-2xl
                  ${isPlaying ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-950 hover:bg-cyan-50'}
                `}
              >
                {isPlaying ? <RotateCcw className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                {isPlaying ? 'EXECUTANDO...' : 'OUVIR COMPOSIÇÃO'}
              </motion.button>
              
              {progression.length > 0 && !isPlaying && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={reset}
                  className="bg-slate-900 text-slate-500 border-2 border-slate-800 px-8 py-6 rounded-[2.5rem] font-black uppercase tracking-widest hover:text-rose-500 hover:border-rose-500/50 transition-all"
                >
                  LIMPAR TUDO
                </motion.button>
              )}
            </div>

            {/* Chord Shelf */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                 <div className="h-px flex-1 bg-slate-800"></div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-4 whitespace-nowrap">Emoticon Chord Bank</p>
                 <div className="h-px flex-1 bg-slate-800"></div>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
                {EMOTIONAL_CHORDS.map(chord => (
                  <motion.button
                    key={chord.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToProgression(chord)}
                    className={`
                      ${chord.color} p-6 rounded-[2rem] border-4 border-white/10 shadow-2xl flex flex-col items-center gap-2 transition-all group/chord relative overflow-hidden
                      hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
                    `}
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20"></div>
                    <span className="text-3xl font-black text-white italic drop-shadow-md">{chord.chord}</span>
                    <div className="flex flex-col items-center">
                       <span className="text-[9px] font-black text-white/50 uppercase tracking-tighter mb-1">{chord.emotion}</span>
                       <div className="flex gap-0.5">
                         {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-white/30 rounded-full group-hover/chord:bg-white/70 transition-colors"></div>)}
                       </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-12 py-16 relative z-10">
            <div className="relative inline-block">
               <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} className="w-72 h-72 border-4 border-dashed border-emerald-500/20 rounded-full absolute -inset-10"></motion.div>
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-9xl filter drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]">🎭</motion.div>
            </div>

            <div className="space-y-4">
              <h4 className="text-6xl font-black uppercase italic text-white tracking-tighter [text-shadow:_0_0_40px_rgba(16,185,129,0.3)]">Obra Maestra Registrada!</h4>
              <p className="text-slate-400 font-bold text-2xl italic max-w-lg mx-auto leading-relaxed">Sua composição emocional foi gravada nos arquivos centrais do Palco das Músicas.</p>
            </div>

            <div className="flex items-center justify-center gap-6 bg-emerald-500/10 border-2 border-emerald-500/50 w-fit mx-auto px-12 py-6 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
              <div className="text-left">
                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Empowerment Reward</p>
                <p className="font-black text-emerald-500 text-5xl italic tracking-tighter leading-none">+100 XP</p>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={reset}
                className="bg-white text-slate-950 px-16 py-7 rounded-[3rem] font-black uppercase tracking-[0.3em] text-xl shadow-2xl hover:bg-emerald-50 transition-colors"
              >
                Nova Composição
              </motion.button>
              <audio.playLevelUp />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
