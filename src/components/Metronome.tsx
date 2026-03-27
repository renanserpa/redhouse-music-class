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
    <section className="bg-slate-950 rounded-[40px] p-8 shadow-2xl border-4 border-slate-900 overflow-hidden relative text-white">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%] opacity-10"></div>
      
      <header className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3 border-2 border-slate-700">
            <Activity className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Metrônomo Pulse</h3>
            <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">Sincronia de Navegação</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { audio.playClick(); setIsVisualOnly(!isVisualOnly); }}
            className={`p-4 rounded-2xl border-2 transition-all shadow-xl ${
              isVisualOnly 
                ? 'bg-slate-800 text-slate-500 border-slate-700' 
                : 'bg-slate-900 text-cyan-400 border-cyan-500/30'
            }`}
            title={isVisualOnly ? "Modo Visual Ativo" : "Ativar Modo Visual (Mudo)"}
          >
            <Volume2 className={`w-6 h-6 ${isVisualOnly ? 'opacity-30' : ''}`} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { audio.playClick(); setIsAccentOn(!isAccentOn); }}
            className={`p-4 rounded-2xl border-2 transition-all shadow-xl ${
              isAccentOn 
                ? 'bg-orange-600 text-white border-orange-400' 
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={isAccentOn ? "Acento Ativo" : "Acento Desativado"}
          >
            <Zap className="w-6 h-6" />
          </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* BPM Display & Controls */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative mb-12">
            <motion.div 
              animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 60/bpm, repeat: Infinity, ease: "easeInOut" }}
              className="w-72 h-72 bg-slate-900 rounded-full border-[10px] border-slate-800 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(6,182,212,0.1),transparent_70%)]"></div>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">Sync Velocity</span>
              <motion.span 
                animate={isPlaying ? { 
                  color: currentBeat === 0 ? '#f97316' : '#22d3ee',
                  textShadow: currentBeat === 0 ? '0 0 20px rgba(249,115,22,0.5)' : '0 0 20px rgba(34,211,238,0.5)'
                } : { color: '#ffffff' }}
                className="text-8xl font-black font-mono italic tracking-tighter leading-none relative z-10"
              >
                {bpm}
              </motion.span>
              <div className="mt-4 px-6 py-1.5 bg-slate-800 text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-cyan-500/20 relative z-10">
                {bpm < 60 ? 'Lento' : bpm < 90 ? 'Andante' : bpm < 120 ? 'Moderato' : bpm < 160 ? 'Allegro' : 'Presto'}
              </div>
              
              {/* Visual Pulse Rings */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div 
                    key={currentBeat}
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`absolute inset-0 rounded-full border-[12px] ${currentBeat === 0 ? 'border-orange-500/50' : 'border-cyan-500/30'}`}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex items-center gap-8 mb-12">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { audio.playClick(); changeBpm(-5); }}
              className="w-16 h-16 bg-slate-900 border-4 border-slate-800 rounded-2xl flex items-center justify-center text-white hover:border-cyan-500/50 transition-all shadow-xl"
            >
              <Minus className="w-8 h-8" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { audio.playStart(); handleTogglePlay(); }}
              className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all border-b-8 active:border-b-0 active:translate-y-2 ${
                isPlaying 
                  ? 'bg-rose-600 border-rose-800 text-white' 
                  : 'bg-emerald-600 border-emerald-800 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              }`}
            >
              {isPlaying ? <Square className="w-12 h-12 fill-white" /> : <Play className="w-12 h-12 fill-white ml-2" />}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { audio.playClick(); changeBpm(5); }}
              className="w-16 h-16 bg-slate-900 border-4 border-slate-800 rounded-2xl flex items-center justify-center text-white hover:border-cyan-500/50 transition-all shadow-xl"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {bpmPresets.map(p => (
              <motion.button 
                key={p}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { audio.playClick(); setBpm(p); }}
                className={`px-8 py-3 rounded-2xl font-black text-xs transition-all border-2 ${
                  bpm === p 
                    ? 'bg-white text-slate-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-200'
                }`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings & Visualizer */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[40px] border-4 border-slate-800 shadow-inner">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> System Configuration
            </h4>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Compasse Formula</label>
                <div className="grid grid-cols-4 gap-3">
                  {[2, 3, 4, 6].map(b => (
                    <button
                      key={b}
                      onClick={() => { audio.playClick(); setBeatsPerMeasure(b); }}
                      className={`py-4 rounded-xl font-black transition-all border-2 ${
                        beatsPerMeasure === b 
                          ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]' 
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {b}/4
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audio Output</label>
                  <button 
                    onClick={() => { audio.playClick(); setIsVisualOnly(!isVisualOnly); }}
                    className={`relative w-14 h-7 rounded-full transition-colors ${isVisualOnly ? 'bg-slate-700' : 'bg-emerald-600'}`}
                  >
                    <motion.div 
                      animate={{ x: isVisualOnly ? 4 : 32 }}
                      className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
                <p className="text-[9px] font-bold text-slate-600 italic tracking-wider">
                  {isVisualOnly ? 'VISUAL_SYNC_MODE: ON' : 'FULL_SYNC_MODE: ON'}
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Beat Visualizer</label>
                <div className="flex gap-2">
                  {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={isPlaying && currentBeat === i ? { 
                        scaleY: [1, 1.2, 1],
                        backgroundColor: i === 0 ? '#f97316' : '#22d3ee',
                        boxShadow: i === 0 
                          ? '0 0 30px rgba(249,115,22,0.6)' 
                          : '0 0 25px rgba(34,211,238,0.5)',
                      } : {
                        backgroundColor: '#1e293b',
                        boxShadow: '0 0 0px rgba(0,0,0,0)',
                      }}
                      className={`flex-1 h-14 rounded-xl border-2 border-slate-800 transition-all`}
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
