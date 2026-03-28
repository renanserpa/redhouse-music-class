/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Music, Play, Trash2, Plus, Drum, Sparkles, Pause, RotateCcw, Infinity as InfinityIcon, Repeat } from 'lucide-react';

interface KonnakkolBuilderProps {
  addXP: (amount: number) => void;
}

interface Syllable {
  id: string;
  text: string;
  color: string;
  duration: number;
}

export default function KonnakkolBuilder({ addXP }: KonnakkolBuilderProps) {
  const [rhythmQueue, setRhythmQueue] = useState<Syllable[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isInfinite, setIsInfinite] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const [loopsRemaining, setLoopsRemaining] = useState(0);

  const syllables: Syllable[] = [
    { id: 'ta', text: 'TA', color: 'bg-orange-500', duration: 500 },
    { id: 'taka', text: 'TA-KA', color: 'bg-blue-500', duration: 500 },
    { id: 'takita', text: 'TA-KI-TA', color: 'bg-emerald-500', duration: 750 },
    { id: 'takadimi', text: 'TA-KA-DI-MI', color: 'bg-indigo-500', duration: 1000 },
  ];

  const addSyllable = (syllable: Syllable) => {
    setRhythmQueue(prev => [...prev, { ...syllable, id: Math.random().toString(36).substr(2, 9) }]);
    audio.playTone(440, '8n');
  };

  const clearRhythm = () => {
    setRhythmQueue([]);
    stopRhythm();
    audio.playError();
  };

  const stopRhythm = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(-1);
    setLoopsRemaining(0);
  };

  const togglePlay = () => {
    if (rhythmQueue.length === 0) return;

    if (isPlaying) {
      setIsPaused(!isPaused);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentIndex(0);
      setLoopsRemaining(isInfinite ? 999999 : loopCount);
      addXP(10);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && !isPaused && currentIndex >= 0 && currentIndex < rhythmQueue.length) {
      const syllable = rhythmQueue[currentIndex];
      
      // Visual feedback and sound
      audio.playKick();
      if (syllable.text.includes('KA')) {
        setTimeout(() => audio.playSnare(), 250);
      }

      timeout = setTimeout(() => {
        if (currentIndex < rhythmQueue.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          // End of sequence
          if (isInfinite) {
            setCurrentIndex(0);
          } else if (loopsRemaining > 1) {
            setLoopsRemaining(prev => prev - 1);
            setCurrentIndex(0);
          } else {
            stopRhythm();
            audio.playSuccess();
          }
        }
      }, syllable.duration);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, isPaused, currentIndex, rhythmQueue, isInfinite, loopsRemaining]);

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden text-white">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
          <Drum className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black uppercase italic">Missão 4: Konnakkol Builder</h3>
      </div>
      <p className="text-slate-500 font-bold mb-8 italic">Toque nas sílabas mágicas para criar o seu próprio ritmo!</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {syllables.map(s => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={s.id}
            onClick={() => addSyllable(s)}
            className={`${s.color} text-white p-6 rounded-3xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-2 border-b-8 border-black/20`}
          >
            <Plus className="w-5 h-5" />
            {s.text}
          </motion.button>
        ))}
      </div>

      <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px] p-10 min-h-[180px] flex flex-wrap items-center justify-center gap-4 relative overflow-hidden">
        <AnimatePresence>
          {rhythmQueue.length === 0 ? (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-300 font-black italic text-xl uppercase tracking-widest"
            >
              Sua sequência aparecerá aqui...
            </motion.span>
          ) : (
            rhythmQueue.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ 
                  scale: currentIndex === index ? 1.1 : 1, 
                  opacity: 1, 
                  y: 0,
                  boxShadow: currentIndex === index ? '0 0 20px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)'
                }}
                exit={{ scale: 0, opacity: 0 }}
                className={`${item.color} text-white px-6 py-4 rounded-2xl font-black text-lg shadow-md flex items-center gap-3 relative border-b-4 border-black/10`}
              >
                {currentIndex === index && (
                  <motion.div 
                    layoutId="beat"
                    className="absolute -top-2 -right-2 bg-white text-slate-900 p-1 rounded-full shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </motion.div>
                )}
                {item.text}
                <button 
                  onClick={() => setRhythmQueue(prev => prev.filter(s => s.id !== item.id))}
                  className="hover:text-white/70 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Playback Controls */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border-4 border-slate-100 shadow-inner">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Modo de Loop</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsInfinite(!isInfinite)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                  isInfinite ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border-2 border-slate-100'
                }`}
              >
                <InfinityIcon className="w-6 h-6" />
              </button>
              <span className="text-xs font-black uppercase text-slate-600">Infinito</span>
            </div>
          </div>

          <div className="w-px h-12 bg-slate-200"></div>

          <div className={`flex flex-col gap-2 transition-all ${isInfinite ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Repetições</span>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="1" 
                max="99"
                value={loopCount}
                onChange={(e) => setLoopCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 bg-white border-4 border-slate-100 rounded-2xl px-4 py-2 font-black text-xl text-slate-700 focus:border-emerald-500 outline-none shadow-sm"
              />
              <span className="text-xs font-black uppercase text-slate-600">Vezes</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={togglePlay}
            disabled={rhythmQueue.length === 0}
            className={`flex-1 py-6 rounded-[32px] font-black text-xl shadow-xl flex items-center justify-center gap-4 transition-all border-4 ${
              rhythmQueue.length === 0
                ? 'bg-slate-200 text-slate-400 border-slate-300'
                : isPlaying && !isPaused
                  ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                  : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-8 h-8 fill-white" />
                PAUSAR
              </>
            ) : isPaused ? (
              <>
                <Play className="w-8 h-8 fill-white" />
                RETOMAR
              </>
            ) : (
              <>
                <Play className="w-8 h-8 fill-white" />
                OUVIR RITMO
              </>
            )}
          </button>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={stopRhythm}
              disabled={!isPlaying}
              className={`p-4 rounded-2xl transition-all border-2 ${
                !isPlaying ? 'bg-slate-50 text-slate-200 border-slate-100' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={clearRhythm}
              className="p-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] hover:bg-slate-200 transition-all border-2 border-slate-200"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
