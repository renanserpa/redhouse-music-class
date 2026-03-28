import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 bg-white rounded-3xl shadow-xl border-4 border-slate-900 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Clock className="w-16 h-16 text-redhouse-primary mx-auto mb-6" />
            <h2 className="text-4xl font-black text-slate-900 mb-4">O Grande Relógio</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
              Siga o pulso do relógio! Clique exatamente quando o círculo brilhar.
            </p>
            
            <div className="flex gap-4 mb-8 justify-center">
              {[60, 80, 100].map(b => (
                <button
                  key={b}
                  onClick={() => setBpm(b)}
                  className={`px-6 py-3 rounded-xl font-black border-4 transition-all ${
                    bpm === b ? 'bg-redhouse-primary text-white border-slate-900 scale-110' : 'bg-slate-100 text-slate-500 border-transparent'
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
              className="px-12 py-4 bg-redhouse-primary text-white font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-transform border-4 border-slate-900"
            >
              COMEÇAR!
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="flex justify-between w-full max-w-md mb-12">
              <div className="bg-slate-100 px-6 py-3 rounded-2xl border-2 border-slate-900">
                <div className="text-xs font-bold text-slate-500 uppercase">Pulso</div>
                <div className="text-2xl font-black text-slate-900">{pulseCount}/{PULSES_PER_ROUND}</div>
              </div>
              <div className="bg-slate-100 px-6 py-3 rounded-2xl border-2 border-slate-900">
                <div className="text-xs font-bold text-slate-500 uppercase">Combo</div>
                <div className="text-2xl font-black text-redhouse-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-current" /> {combo}x
                </div>
              </div>
            </div>

            {/* Groove Circle */}
            <motion.button
              onMouseDown={handleTap}
              onTouchStart={handleTap}
              animate={{
                scale: lastHitResult === 'perfect' ? 1.2 : lastHitResult === 'miss' ? 0.9 : 1,
                backgroundColor: lastHitResult === 'perfect' ? '#22c55e' : lastHitResult === 'miss' ? '#ef4444' : '#ffffff'
              }}
              className="w-64 h-64 rounded-full border-8 border-slate-900 shadow-2xl flex items-center justify-center relative overflow-hidden"
            >
              {/* Visual Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 60 / bpm,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 bg-redhouse-primary rounded-full"
              />
              <div className="relative z-10 text-4xl font-black text-slate-900">TOQUE!</div>
            </motion.button>

            <div className="mt-12 text-slate-400 font-bold">
              Mantenha o ritmo constante!
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-900 shadow-xl ${
              (hits / PULSES_PER_ROUND) >= 0.7 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">
              {(hits / PULSES_PER_ROUND) >= 0.7 ? 'Ritmo Perfeito!' : 'Quase lá!'}
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Você acertou {hits} de {PULSES_PER_ROUND} pulsos!
            </p>
            
            <div className="flex gap-4 justify-center">
              <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-900">
                <div className="text-sm font-bold text-slate-500 uppercase mb-1">Precisão</div>
                <div className="text-4xl font-black text-slate-900">
                  {Math.round((hits / PULSES_PER_ROUND) * 100)}%
                </div>
              </div>
              {(hits / PULSES_PER_ROUND) >= 0.7 && (
                <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-900">
                  <div className="text-sm font-bold text-slate-500 uppercase mb-1">XP Ganhos</div>
                  <div className="text-4xl font-black text-redhouse-primary">+30 XP</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setGameState('start')}
              className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
