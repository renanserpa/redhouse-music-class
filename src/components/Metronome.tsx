/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Square, 
  Plus, 
  Minus, 
  Zap, 
  Music, 
  Settings2,
  Volume2,
  Activity
} from 'lucide-react';
import { audio } from '../lib/audio';

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isAccentOn, setIsAccentOn] = useState(true);
  const [isVisualOnly, setIsVisualOnly] = useState(false);
  const [soundPreset, setSoundPreset] = useState('click');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickTime = useRef<number>(0);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  const startMetronome = () => {
    setIsPlaying(true);
    setCurrentBeat(0);
    
    const interval = (60 / bpm) * 1000;
    
    const tick = () => {
      setCurrentBeat(prev => {
        const nextBeat = (prev + 1) % beatsPerMeasure;
        const isAccent = nextBeat === 0;
        
        if (!isVisualOnly) {
          audio.playClick(isAccent && isAccentOn, soundPreset);
        }
        
        return nextBeat;
      });
      
      timerRef.current = setTimeout(tick, interval);
    };

    // Initial tick
    if (!isVisualOnly) {
      audio.playClick(isAccentOn, soundPreset);
    }
    timerRef.current = setTimeout(tick, interval);
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCurrentBeat(0);
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, beatsPerMeasure, isVisualOnly, isAccentOn, soundPreset]);

  useEffect(() => {
    return () => stopMetronome();
  }, []);

  const changeBpm = (delta: number) => {
    setBpm(prev => Math.max(30, Math.min(300, prev + delta)));
  };

  const bpmPresets = [60, 80, 100, 120, 140, 160];

  return (
    <section className="bg-redhouse-card rounded-[40px] p-8 shadow-xl border-4 border-redhouse-border overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

      <header className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-redhouse-primary rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3 text-redhouse-text">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic text-redhouse-text">Metrônomo Rockstar</h3>
            <p className="text-xs font-bold text-redhouse-muted uppercase tracking-widest">Mantenha o Pulso Firme</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsVisualOnly(!isVisualOnly)}
            className={`p-3 rounded-xl border-2 transition-all ${
              isVisualOnly 
                ? 'bg-redhouse-primary text-white border-redhouse-primary' 
                : 'bg-redhouse-card text-redhouse-muted border-redhouse-border hover:border-redhouse-primary/50'
            }`}
            title={isVisualOnly ? "Modo Visual Ativo" : "Ativar Modo Visual (Mudo)"}
          >
            <Volume2 className={`w-5 h-5 ${isVisualOnly ? 'opacity-30' : ''}`} />
          </button>
          <button 
            onClick={() => setIsAccentOn(!isAccentOn)}
            className={`p-3 rounded-xl border-2 transition-all ${
              isAccentOn 
                ? 'bg-orange-500 text-white border-orange-500' 
                : 'bg-redhouse-card text-redhouse-muted border-redhouse-border hover:border-orange-300'
            }`}
            title={isAccentOn ? "Acento Ativo" : "Acento Desativado"}
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* BPM Display & Controls */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative mb-10">
            <motion.div 
              animate={isPlaying ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
              transition={{ duration: 60/bpm, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-64 bg-redhouse-bg/50 rounded-full border-8 border-redhouse-primary flex flex-col items-center justify-center shadow-2xl relative"
            >
              <span className="text-xs font-black text-redhouse-muted uppercase tracking-widest mb-1">BPM</span>
              <motion.span 
                animate={isPlaying ? { 
                  color: currentBeat === 0 ? '#f97316' : 'var(--color-redhouse-text)',
                  scale: [1, 1.05, 1]
                } : { color: 'var(--color-redhouse-text)' }}
                transition={{ duration: 0.1 }}
                className="text-7xl font-black tracking-tighter leading-none"
              >
                {bpm}
              </motion.span>
              <div className="mt-2 px-4 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase">
                {bpm < 60 ? 'Lento' : bpm < 90 ? 'Andante' : bpm < 120 ? 'Moderato' : bpm < 160 ? 'Allegro' : 'Presto'}
              </div>
              
              {/* Visual Pulse */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div 
                    key={currentBeat}
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`absolute inset-0 rounded-full border-8 ${currentBeat === 0 ? 'border-orange-500' : 'border-blue-500'}`}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex items-center gap-6 mb-10">
            <button 
              onClick={() => changeBpm(-5)}
              className="w-14 h-14 bg-redhouse-card border-4 border-redhouse-border rounded-2xl flex items-center justify-center text-redhouse-text hover:bg-redhouse-primary/10 active:scale-95 transition-all shadow-lg"
            >
              <Minus className="w-6 h-6" />
            </button>
            <button 
              onClick={handleTogglePlay}
              className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl transition-all border-b-8 active:border-b-0 active:translate-y-2 ${
                isPlaying 
                  ? 'bg-rose-500 border-rose-700 text-white' 
                  : 'bg-emerald-500 border-emerald-700 text-white'
              }`}
            >
              {isPlaying ? <Square className="w-10 h-10 fill-white" /> : <Play className="w-10 h-10 fill-white ml-2" />}
            </button>
            <button 
              onClick={() => changeBpm(5)}
              className="w-14 h-14 bg-redhouse-card border-4 border-redhouse-border rounded-2xl flex items-center justify-center text-redhouse-text hover:bg-redhouse-primary/10 active:scale-95 transition-all shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {bpmPresets.map(p => (
              <button 
                key={p}
                onClick={() => setBpm(p)}
                className={`px-6 py-2 rounded-xl font-black text-xs transition-all border-2 ${
                  bpm === p 
                    ? 'bg-redhouse-primary text-white border-redhouse-primary shadow-md' 
                    : 'bg-redhouse-card text-redhouse-muted border-redhouse-border hover:border-redhouse-primary/50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Settings & Visualizer */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-50 p-8 rounded-[40px] border-4 border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Configurações
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Fórmula de Compasso</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 6].map(b => (
                    <button
                      key={b}
                      onClick={() => setBeatsPerMeasure(b)}
                      className={`py-3 rounded-xl font-black transition-all border-2 ${
                        beatsPerMeasure === b 
                          ? 'bg-white border-orange-500 text-orange-500 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {b}/4
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Som do Clique</label>
                  <button 
                    onClick={() => setIsVisualOnly(!isVisualOnly)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isVisualOnly ? 'bg-slate-200' : 'bg-emerald-500'}`}
                  >
                    <motion.div 
                      animate={{ x: isVisualOnly ? 4 : 28 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                <p className="text-[10px] font-bold text-slate-400 italic">
                  {isVisualOnly ? 'Apenas feedback visual (Mudo)' : 'Som e feedback visual ativos'}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Timbre do Clique</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'click', label: 'Padrão', icon: '🔘' },
                    { id: 'woodblock', label: 'Madeira', icon: '🪵' },
                    { id: 'cowbell', label: 'Cowbell', icon: '🔔' },
                    { id: 'electronic', label: 'Digital', icon: '⚡' },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSoundPreset(preset.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all border-2 ${
                        soundPreset === preset.id 
                          ? 'bg-white border-blue-500 text-blue-500 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Visualizador de Batida</label>
                <div className="flex gap-3">
                  {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={isPlaying && currentBeat === i ? { 
                        scale: [1, 1.2, 1],
                        backgroundColor: [
                          '#ffffff',
                          i === 0 ? '#f97316' : '#3b82f6'
                        ],
                        boxShadow: i === 0 
                          ? '0 0 25px rgba(249, 115, 22, 0.8)' 
                          : '0 0 20px rgba(59, 130, 246, 0.8)',
                        borderColor: i === 0 ? '#fdba74' : '#93c5fd'
                      } : {
                        backgroundColor: '#e2e8f0',
                        boxShadow: '0 0 0px rgba(0,0,0,0)',
                        borderColor: '#ffffff'
                      }}
                      transition={{ 
                        duration: 0.15,
                        backgroundColor: { duration: 0.1 }
                      }}
                      className={`flex-1 h-14 rounded-2xl border-4 shadow-sm transition-all`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-[40px] border-4 border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-orange-500" />
              <h4 className="font-black text-orange-900 uppercase italic">Dica do Professor</h4>
            </div>
            <p className="text-xs font-bold text-orange-700 leading-relaxed">
              "Tocar com metrônomo é como ter um baterista robô que nunca erra! Comece devagar (60 BPM) e só aumente quando estiver confortável."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
