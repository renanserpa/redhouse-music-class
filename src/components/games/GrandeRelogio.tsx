import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../lib/audio';
import { Trophy, Music, Heart, Clock, Zap } from 'lucide-react';
import { getRandomDialogue } from '../../lib/npcDialogues';

interface GrandeRelogioProps {
  onComplete: (xp: number) => void;
  onUpdateNPC: (state: 'idle' | 'celebrating' | 'encouraging', message: string) => void;
  instrument: 'guitar' | 'ukulele';
}

const PULSES_PER_ROUND = 16;
const TOLERANCE_MS = 150;

export const GrandeRelogio: React.FC<GrandeRelogioProps> = ({
  onComplete,
  onUpdateNPC,
  instrument
}) => {
  const [bpm, setBpm] = useState(60);
  const [pulseCount, setPulseCount] = useState(0);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [lastHitResult, setLastHitResult] = useState<'perfect' | 'miss' | null>(null);
  
  const lastPulseTime = useRef<number>(0);
  const nextPulseTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPulse = useCallback(() => {
    const interval = (60 / bpm) * 1000;
    nextPulseTime.current = Date.now() + interval;
    
    const tick = () => {
      const now = Date.now();
      lastPulseTime.current = now;
      nextPulseTime.current = now + interval;
      
      setPulseCount(prev => {
        if (prev + 1 >= PULSES_PER_ROUND) {
          stopPulse();
          setGameState('finished');
          return prev + 1;
        }
        return prev + 1;
      });
      
      audio.playClick();
      timerRef.current = setTimeout(tick, interval);
    };

    tick();
  }, [bpm]);

  const stopPulse = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTap = () => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const diff = Math.abs(now - lastPulseTime.current);
    const nextDiff = Math.abs(now - nextPulseTime.current);
    const minDiff = Math.min(diff, nextDiff);

    if (minDiff <= TOLERANCE_MS) {
      setHits(prev => prev + 1);
      setCombo(prev => prev + 1);
      setLastHitResult('perfect');
      audio.playSuccess();
    } else {
      setCombo(0);
      setLastHitResult('miss');
      audio.playError();
    }

    setTimeout(() => setLastHitResult(null), 200);
  };

  useEffect(() => {
    if (gameState === 'finished') {
      const accuracy = (hits / PULSES_PER_ROUND) * 100;
      if (accuracy >= 70) {
        onComplete(30);
        onUpdateNPC('celebrating', getRandomDialogue('correct', instrument));
      } else {
        onUpdateNPC('encouraging', getRandomDialogue('wrong', instrument));
      }
    }
    return () => stopPulse();
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 overflow-hidden relative group">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center relative z-10"
          >
            <div className="w-24 h-24 bg-redhouse-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-redhouse-primary/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Clock className="w-12 h-12 text-redhouse-primary animate-pulse" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">O Grande Relógio</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-md mx-auto font-bold italic uppercase tracking-tight">
              Sincronia Temporal: Siga a pulsação e clique exatamente no ápice do <span className="text-redhouse-primary underline decoration-2 underline-offset-4">Sinal Luminoso</span>.
            </p>
            
            <div className="flex gap-4 mb-10 justify-center">
              {[60, 80, 100].map(b => (
                <button
                  key={b}
                  onClick={() => setBpm(b)}
                  className={`px-8 py-4 rounded-2xl font-black border transition-all uppercase italic tracking-widest ${
                    bpm === b ? 'bg-redhouse-primary text-white border-white/20 scale-110 shadow-[0_0_25px_rgba(239,68,68,0.4)]' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'
                  }`}
                >
                  {b} BPM
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setGameState('playing');
                setPulseCount(0);
                setHits(0);
                setCombo(0);
                startPulse();
              }}
              className="px-16 py-5 bg-redhouse-primary text-white font-black text-2xl rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:scale-105 transition-all active:scale-95 border border-white/20 uppercase italic tracking-widest"
            >
              INICIAR PROTOCOLO
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center relative z-10"
          >
            <div className="flex justify-between w-full max-w-lg mb-12">
              <div className="bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 italic">Scan Progress</div>
                <div className="text-3xl font-black text-white italic tracking-tighter">{pulseCount}<span className="text-white/20 mx-1">/</span>{PULSES_PER_ROUND}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 italic">Rhythm Combo</div>
                <div className="text-3xl font-black text-redhouse-primary italic tracking-tighter flex items-center gap-2">
                  <Zap className="w-6 h-6 fill-current animate-pulse" /> {combo}x
                </div>
              </div>
            </div>

            {/* Groove Circle - HUD Style */}
            <motion.button
              onMouseDown={handleTap}
              onTouchStart={handleTap}
              animate={{
                scale: lastHitResult === 'perfect' ? 1.05 : lastHitResult === 'miss' ? 0.95 : 1,
              }}
              className={`w-72 h-72 rounded-full border-4 transition-all flex items-center justify-center relative overflow-hidden shadow-2xl ${
                lastHitResult === 'perfect' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 
                lastHitResult === 'miss' ? 'border-red-500 bg-red-500/10 shadow-[0_0_50px_rgba(239,68,68,0.3)]' :
                'border-white/10 bg-black/40'
              }`}
            >
              {/* Visual Pulse - Animated Ring */}
              <motion.div
                key={pulseCount}
                initial={{ scale: 0.5, opacity: 1, borderWidth: '10px' }}
                animate={{ scale: 1.5, opacity: 0, borderWidth: '1px' }}
                transition={{
                  duration: 60 / bpm,
                  ease: "easeOut"
                }}
                className="absolute inset-0 border-redhouse-primary rounded-full"
              />
              
              <div className="relative z-10 text-4xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                {lastHitResult === 'perfect' ? 'HIT!' : lastHitResult === 'miss' ? 'FAIL' : 'SYNC'}
              </div>

              {/* Central Core */}
              <div className="absolute inset-[35%] bg-white/5 rounded-full border border-white/10 blur-sm" />
            </motion.button>

            <div className="mt-16 text-white/30 font-black uppercase italic tracking-[0.3em] text-[10px] animate-pulse">
              Mantenha o pulso constante para sincronização total
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center relative z-10"
          >
            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border transition-all ${
              (hits / PULSES_PER_ROUND) >= 0.7 
                ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
                : 'bg-redhouse-primary/20 border-redhouse-primary shadow-[0_0_50px_rgba(239,68,68,0.2)]'
            }`}>
              <Trophy className={`w-16 h-16 ${ (hits / PULSES_PER_ROUND) >= 0.7 ? 'text-emerald-400' : 'text-redhouse-primary' }`} />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 italic uppercase tracking-tighter">
              {(hits / PULSES_PER_ROUND) >= 0.7 ? 'Sincronia Estável!' : 'Falha na Frequência'}
            </h2>
            <p className="text-xl text-slate-400 mb-12 font-bold italic uppercase">
              Você estabilizou {hits} de {PULSES_PER_ROUND} ciclos temporais!
            </p>
            
            <div className="flex gap-8 justify-center mb-12">
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 min-w-[180px]">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 italic">Precisão HUD</div>
                <div className="text-5xl font-black text-white italic tracking-tighter">
                  {Math.round((hits / PULSES_PER_ROUND) * 100)}%
                </div>
              </div>
              {(hits / PULSES_PER_ROUND) >= 0.7 && (
                <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 min-w-[180px]">
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 italic">XP Capturado</div>
                  <div className="text-5xl font-black text-redhouse-primary italic tracking-tighter">+30</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setGameState('start')}
              className="px-12 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase italic tracking-widest"
            >
              REBOOT PROTOCOLO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
