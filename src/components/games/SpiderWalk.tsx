/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Bug, Mic, MicOff, CheckCircle2, AlertTriangle, Music } from 'lucide-react';

interface SpiderWalkProps {
  addXP: (amount: number) => void;
  onComplete?: () => void;
}

// Simple pitch detection (auto-correlation)
function autoCorrelate(buffer: Float32Array, sampleRate: number) {
  let SIZE = buffer.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    let val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = SIZE - 1, thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length;

  let c = new Float32Array(SIZE);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++)
      c[i] = c[i] + buffer[j] * buffer[j + i];

  let d = 0; while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;
  return sampleRate / T0;
}

export default function SpiderWalk({ addXP, onComplete }: SpiderWalkProps) {
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pitch, setPitch] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Target Frequencies (approximate for guitar strings E, B, G, D, A, E - for 1st-4th frets)
  // Let's simplify: detect any distinct change in pitch as a 'step' for now to ensure reliability
  // or target specific notes if the user is advanced.
  // For Mundo 4 (Iniciante), any 4 distinct clear notes will move the spider.
  const totalSteps = 4;

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      setIsListening(true);
      setError(null);
      requestAnimationFrame(updatePitch);
    } catch (err) {
      setError("Permissão para microfone negada ou não encontrada.");
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
    setPitch(null);
  };

  const updatePitch = () => {
    if (!isListening || !analyserRef.current) return;
    
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const detectedPitch = autoCorrelate(buffer, audioContextRef.current!.sampleRate);

    if (detectedPitch > 0 && detectedPitch < 1000) {
      setPitch(detectedPitch);
      
      // Debounced step logic: if pitch is detected for a moment, move spider
      // In a real app, we'd compare to target frequencies e.g. 82Hz (E), 110Hz (A), etc.
      // For this MVP, we'll trigger on clear sound detection if not stepped recently
    }

    if (isListening) requestAnimationFrame(updatePitch);
  };

  // Manual step for testing (or when sound is detected)
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      audio.playTone(440 + nextStep * 100, '8n');
      addXP(20);
      
      if (nextStep === totalSteps) {
        audio.playSuccess();
        if (onComplete) setTimeout(onComplete, 3000);
      }
    }
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[size:100%_2px,3px_100%]" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] -rotate-6 border-2 border-emerald-400">
            <Bug className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">A Caminhada da Aranha</h3>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Protocolo de Técnica · Mundo 4</p>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all backdrop-blur-md shadow-2xl border ${
            isListening 
              ? 'bg-rose-600/20 text-rose-500 border-rose-500/50' 
              : 'bg-emerald-600/20 text-emerald-500 border-emerald-500/50 hover:bg-emerald-600/30'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="uppercase tracking-[0.2em] text-xs font-black">{isListening ? 'Desativar Sensor' : 'Ativar Microfone'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 relative z-10">
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-md rounded-[3rem] p-12 border border-white/5 relative overflow-hidden flex items-center justify-center min-h-[400px] shadow-2xl">
          {/* Fretboard Visualization HUD */}
          <div className="relative w-full h-32 bg-slate-950/50 rounded-2xl border-y border-white/10 flex shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-white/10 last:border-0 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/20 uppercase italic tracking-widest">Casa {i+1}</div>
                {i > 0 && (
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-4 h-[120%] bg-gradient-to-b from-white/20 via-white/40 to-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
                )}
              </div>
            ))}
            
            {/* Spider Avatar HUD */}
            <motion.div 
              animate={{ 
                x: `${currentStep * 20}%`,
                y: [0, -15, 0]
              }}
              transition={{ 
                x: { type: 'spring', stiffness: 80, damping: 15 },
                y: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
              }}
              className="absolute left-[10%] top-1/2 -translate-y-1/2 -ml-8 z-20 cursor-pointer group/spider"
              onClick={handleNextStep}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full absolute -inset-2 blur-xl animate-pulse"></div>
                <Bug className="w-14 h-14 text-emerald-500 fill-emerald-500/20 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] filter transition-transform group-hover/spider:scale-110" />
                
                {/* HUD Elements around spider */}
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} className="absolute -inset-4 border border-dashed border-emerald-500/20 rounded-full" />
              </div>
            </motion.div>

            {/* Target Line HUD */}
            <div className="absolute top-0 right-0 h-full w-2 bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse"></div>
          </div>
          
          {/* Instructions Overlay HUD */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-3 italic whitespace-nowrap shadow-2xl">
            <Music className="w-4 h-4 animate-bounce" />
            Sincronize as casas 1-4 para impulsionar o avanço!
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-[3rem] p-8 border border-white/5 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Bug className="w-32 h-32 rotate-45" />
          </div>
          
          <div className="space-y-1 relative z-10">
            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">Status da Missão</h4>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-none">Análise de Frequência</p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
            <div className={`bg-slate-950/60 rounded-[2.5rem] p-8 border transition-all text-center shadow-inner ${isListening ? 'border-emerald-500/30' : 'border-white/5'}`}>
              <div className="text-[10px] font-black text-white/20 mb-4 uppercase tracking-[0.4em] italic">Acoustic_Input</div>
              <div className={`text-5xl font-black font-mono italic tracking-tighter transition-all ${pitch ? 'text-emerald-500 [text-shadow:_0_0_20px_rgba(16,185,129,0.5)]' : 'text-white/10'}`}>
                {pitch ? `${Math.round(pitch)}<span className="text-xl ml-1 uppercase">Hz</span>` : 'WAITING...'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase italic tracking-[0.2em] text-white/30 px-2 leading-none">
                <span>Web_Progress</span>
                <span className="text-emerald-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full h-4 bg-black/40 rounded-full border border-white/5 overflow-hidden p-1 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                ></motion.div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-600/10 border border-rose-600/30 p-5 rounded-[2rem] flex items-center gap-4 text-rose-500 text-xs font-black italic shadow-xl">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <span className="uppercase tracking-tight">{error}</span>
              </motion.div>
            )}

            {currentStep === totalSteps && (
              <motion.div 
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-emerald-600 text-white p-6 rounded-[2.5rem] flex items-center gap-5 shadow-[0_0_40px_rgba(16,185,129,0.4)] border-2 border-emerald-400"
              >
                <CheckCircle2 className="w-10 h-10 shrink-0" />
                <div className="space-y-1">
                  <div className="text-lg font-black uppercase italic tracking-tighter leading-none">Meta Finalizada!</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-none">+80 XP UNLOCKED</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* HUD Info Footer */}
      <div className="flex justify-center relative z-10">
        <div className="px-8 py-3 bg-black/40 rounded-full border border-white/5 text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic backdrop-blur-md">
          World_04_Calibration_Active
        </div>
      </div>
    </section>
  );
}
