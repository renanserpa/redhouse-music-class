/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Play, RotateCcw, Trophy, Music, Volume2, CheckCircle2, XCircle } from 'lucide-react';

interface EchoGameProps {
  addXP: (amount: number) => void;
}

const STRINGS = [
  { id: 0, label: 'E (Grave)', color: 'bg-orange-500', freq: 82.41 },
  { id: 1, label: 'A', color: 'bg-blue-500', freq: 110.00 },
  { id: 2, label: 'D', color: 'bg-emerald-500', freq: 146.83 },
  { id: 3, label: 'G', color: 'bg-teal-500', freq: 196.00 },
  { id: 4, label: 'B', color: 'bg-rose-500', freq: 246.94 },
  { id: 5, label: 'E (Agudo)', color: 'bg-amber-500', freq: 329.63 },
];

export default function EchoGame({ addXP }: EchoGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeString, setActiveString] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'repeating' | 'success' | 'fail'>('idle');
  const [level, setLevel] = useState(1);

  const playString = useCallback((id: number, duration = 0.5) => {
    setActiveString(id);
    audio.playTone(STRINGS[id].freq, '4n');
    setTimeout(() => setActiveString(null), duration * 1000);
  }, []);

  const startNewLevel = useCallback((currentLevel: number) => {
    const newSequence = Array.from({ length: currentLevel + 1 }, () => Math.floor(Math.random() * 6));
    setSequence(newSequence);
    setUserSequence([]);
    setGameState('playing');
    setIsPlayingSequence(true);
  }, []);

  useEffect(() => {
    if (isPlayingSequence && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        playString(sequence[i]);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsPlayingSequence(false);
            setGameState('repeating');
          }, 600);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isPlayingSequence, sequence, playString]);

  const handleStringClick = (id: number) => {
    if (gameState !== 'repeating' || isPlayingSequence) return;

    playString(id, 0.3);
    const newUserSequence = [...userSequence, id];
    setUserSequence(newUserSequence);

    // Check if correct so far
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameState('fail');
      audio.playError();
      return;
    }

    // Check if finished sequence
    if (newUserSequence.length === sequence.length) {
      setGameState('success');
      audio.playSuccess();
      addXP(10 * level);
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startNewLevel(level + 1);
      }, 1500);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setUserSequence([]);
    setGameState('idle');
    startNewLevel(1);
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden text-white flex flex-col items-center">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      <div className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
            <Volume2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black uppercase italic">Eco do Lucca</h3>
        </div>
        <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-xl shadow-lg border-2 border-slate-800">
          Nível {level}
        </div>
      </div>

      <div className="w-full max-w-4xl bg-slate-900 rounded-[40px] p-12 mb-12 relative shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-center border-8 border-slate-800">
        {/* Character Visual */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <motion.div 
            animate={{ 
              scale: isPlayingSequence ? [1, 1.1, 1] : 1,
              y: isPlayingSequence ? [0, -5, 0] : 0
            }}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 transition-colors ${
              isPlayingSequence ? 'bg-blue-500 border-white' : 'bg-slate-800 border-slate-700'
            }`}
          >
            👦🏻
            {isPlayingSequence && (
              <motion.div 
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute inset-0 bg-blue-400 rounded-full -z-10"
              />
            )}
          </motion.div>
          <span className="text-white font-black uppercase text-xs tracking-widest bg-slate-800 px-3 py-1 rounded-full">
            {isPlayingSequence ? 'Lucca Toca...' : gameState === 'repeating' ? 'Sua Vez!' : 'Pronto?'}
          </span>
        </div>

        {/* Strings Visualization */}
        <div className="flex flex-col gap-6 w-full mt-24">
          {STRINGS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleStringClick(s.id)}
              disabled={gameState !== 'repeating'}
              className={`h-4 w-full rounded-full transition-all relative group ${
                activeString === s.id ? 'bg-white scale-y-150 shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className={`absolute -left-12 top-1/2 -translate-y-1/2 font-black text-sm transition-colors ${activeString === s.id ? 'text-white scale-125' : 'text-slate-500'}`}>
                {s.label}
              </div>
              {activeString === s.id && (
                <motion.div 
                  layoutId="glow"
                  className={`absolute inset-0 rounded-full blur-md opacity-50 ${s.color}`}
                />
              )}
              {/* Progress dots for the current sequence */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex gap-1">
                {userSequence.filter(id => id === s.id).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${s.color}`} />
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Game Status Overlay */}
        <AnimatePresence>
          {gameState === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-30"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startNewLevel(1)}
                className="bg-orange-500 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl flex items-center gap-4 text-2xl border-4 border-orange-400"
              >
                <Play className="w-8 h-8 fill-white" />
                Começar Desafio
              </motion.button>
            </motion.div>
          )}

          {gameState === 'fail' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-red-500/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 text-white p-8 text-center"
            >
              <XCircle className="w-20 h-20 mb-4 animate-bounce" />
              <h4 className="text-4xl font-black uppercase mb-2 tracking-tighter">Ops! Erramos o tom!</h4>
              <p className="text-xl font-bold italic mb-8">Não desista, Rockstar! Tente novamente.</p>
              <button 
                onClick={resetGame}
                className="bg-white text-red-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl border-4 border-white/50"
              >
                Tentar de Novo
              </button>
            </motion.div>
          )}

          {gameState === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 text-white p-8 text-center"
            >
              <CheckCircle2 className="w-20 h-20 mb-4 animate-pulse" />
              <h4 className="text-4xl font-black uppercase mb-2 tracking-tighter">PERFEITO!</h4>
              <p className="text-xl font-bold italic mb-4">Você ouviu cada detalhe!</p>
              <div className="bg-white/20 px-6 py-2 rounded-full font-black text-2xl">
                +{level * 10} XP
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className={`p-6 rounded-3xl border-4 border-slate-900 flex flex-col items-center text-center transition-all ${
          gameState === 'playing' ? 'bg-blue-500 text-white scale-105 shadow-xl border-blue-600' : 'bg-slate-50 opacity-50'
        }`}>
          <Music className="w-8 h-8 mb-2" />
          <span className="text-xs font-black uppercase tracking-widest">O Lucca Toca</span>
          <p className="font-bold italic">Ouça com atenção!</p>
        </div>

        <div className={`p-6 rounded-3xl border-4 border-slate-900 flex flex-col items-center text-center transition-all ${
          gameState === 'repeating' ? 'bg-orange-500 text-white scale-105 shadow-xl border-orange-600' : 'bg-slate-50 opacity-50'
        }`}>
          <span className="text-3xl mb-2">🎸</span>
          <span className="text-xs font-black uppercase tracking-widest">Sua Vez</span>
          <p className="font-bold italic">Repita a sequência!</p>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl border-4 border-slate-800 flex flex-col items-center text-center shadow-lg">
          <Trophy className="w-8 h-8 mb-2 text-yellow-400" />
          <span className="text-xs font-black uppercase tracking-widest">Recompensa</span>
          <p className="text-2xl font-black">+{level * 10} XP</p>
        </div>
      </div>

      <div className="mt-12 bg-slate-100 p-6 rounded-2xl relative border-l-8 border-blue-500 w-full max-w-4xl shadow-inner">
        <div className="absolute -top-4 right-8 bg-blue-500 text-white px-4 py-1 rounded-full font-bold text-xs">DICA DO LUCCA 👦🏻</div>
        <p className="text-lg font-bold italic text-slate-600">
          "Feche os olhos se precisar! O som de cada corda é único, como a voz de um amigo."
        </p>
      </div>
    </section>
  );
}
