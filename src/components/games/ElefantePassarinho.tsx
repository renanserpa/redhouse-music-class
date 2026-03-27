import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../lib/audio';
import { Trophy, Music, Heart, Timer, Ear } from 'lucide-react';
import { getRandomDialogue } from '../../lib/npcDialogues';

interface ElefantePassarinhoProps {
  onComplete: (xp: number) => void;
  onUpdateNPC: (state: 'idle' | 'celebrating' | 'encouraging', message: string) => void;
  instrument: 'guitar' | 'ukulele';
}

const ROUNDS = 10;
const TIME_LIMIT = 5;

const GRAVE_NOTES = ['E2', 'A2', 'D3'];
const AGUDO_NOTES = ['B4', 'E4', 'G4'];

export const ElefantePassarinho: React.FC<ElefantePassarinhoProps> = ({
  onComplete,
  onUpdateNPC,
  instrument
}) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [targetType, setTargetType] = useState<'grave' | 'agudo'>('grave');
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'finished'>('start');
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | 'timeout' | null>(null);

  const generateRound = useCallback(() => {
    const type = Math.random() > 0.5 ? 'grave' : 'agudo';
    setTargetType(type);
    setGameState('playing');
    setTimeLeft(TIME_LIMIT);
    setLastResult(null);
    
    // Play the sound
    const notes = type === 'grave' ? GRAVE_NOTES : AGUDO_NOTES;
    const note = notes[Math.floor(Math.random() * notes.length)];
    setTimeout(() => audio.playNote(note, '2n'), 500);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleAnswer(null);
    }
  }, [gameState, timeLeft]);

  const handleAnswer = (type: 'grave' | 'agudo' | null) => {
    if (gameState !== 'playing') return;

    if (type === targetType) {
      setScore(prev => prev + 1);
      setLastResult('correct');
      audio.playSuccess();
      onUpdateNPC('celebrating', getRandomDialogue('correct', instrument));
    } else {
      setLastResult(type === null ? 'timeout' : 'wrong');
      audio.playError();
      onUpdateNPC('encouraging', getRandomDialogue('wrong', instrument));
    }

    setGameState('feedback');
    
    setTimeout(() => {
      if (round < ROUNDS) {
        setRound(prev => prev + 1);
        generateRound();
      } else {
        setGameState('finished');
        const finalXP = score * 10 + 30;
        onComplete(finalXP);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 overflow-hidden relative group">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Header Info */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-redhouse-primary animate-pulse shadow-[0_0_8px_var(--color-redhouse-primary)]" />
          <Timer className="w-5 h-5 text-redhouse-primary" />
          <span className="font-black text-2xl italic tracking-tighter text-white">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-black text-2xl italic tracking-tighter text-white">{score}<span className="text-white/30 mx-1">/</span>{ROUNDS}</span>
        </div>
      </div>

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
              <Ear className="w-12 h-12 text-redhouse-primary" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">Elefante ou Passarinho?</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-md mx-auto font-bold italic uppercase tracking-tight">
              Sintonize seu ouvido: é um som <span className="text-emerald-400">🐘 GRAVE</span> ou <span className="text-blue-400">🐦 AGUDO</span>?
            </p>
            <button
              onClick={generateRound}
              className="px-16 py-5 bg-redhouse-primary text-white font-black text-2xl rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:scale-105 transition-all active:scale-95 border border-white/20 uppercase italic tracking-widest"
            >
              INICIAR PROTOCOLO
            </button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'feedback') && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center relative z-10"
          >
            <div className="text-3xl font-black text-white/20 mb-12 italic uppercase tracking-[0.2em]">Rodada {round} <span className="text-white/5 mx-2">_</span> {ROUNDS}</div>
            
            <div className="grid grid-cols-2 gap-10 w-full max-w-3xl">
              {/* Elefante - Grave */}
              <motion.button
                whileHover={gameState === 'playing' ? { scale: 1.02, y: -5 } : {}}
                whileTap={gameState === 'playing' ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer('grave')}
                disabled={gameState !== 'playing'}
                className={`flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 transition-all relative group/btn ${
                  gameState === 'feedback' && targetType === 'grave'
                    ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                    : gameState === 'feedback' && lastResult === 'wrong' && targetType !== 'grave'
                    ? 'bg-red-500/5 border-red-500/20 opacity-30'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />
                <span className="text-9xl mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">🐘</span>
                <span className="text-3xl font-black text-white italic uppercase tracking-tighter">GRAVE</span>
                <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mt-2">{instrument === 'guitar' ? 'Cordas Grossas' : 'Som Encorpado'}</span>
              </motion.button>

              {/* Passarinho - Agudo */}
              <motion.button
                whileHover={gameState === 'playing' ? { scale: 1.02, y: -5 } : {}}
                whileTap={gameState === 'playing' ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer('agudo')}
                disabled={gameState !== 'playing'}
                className={`flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 transition-all relative group/btn ${
                  gameState === 'feedback' && targetType === 'agudo'
                    ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
                    : gameState === 'feedback' && lastResult === 'wrong' && targetType !== 'agudo'
                    ? 'bg-red-500/5 border-red-500/20 opacity-30'
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />
                <span className="text-9xl mb-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">🐦</span>
                <span className="text-3xl font-black text-white italic uppercase tracking-tighter">AGUDO</span>
                <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mt-2">{instrument === 'guitar' ? 'Cordas Finas' : 'Som Brilhante'}</span>
              </motion.button>
            </div>

            <div className="mt-16 flex flex-col items-center gap-4">
              <button 
                onClick={() => {
                  const notes = targetType === 'grave' ? GRAVE_NOTES : AGUDO_NOTES;
                  audio.playNote(notes[Math.floor(Math.random() * notes.length)], '2n');
                }}
                className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-white/60 hover:text-white transition-all border border-white/5 group/replay"
              >
                <Music className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                REPETIR SINAL SONORO
              </button>
              
              <AnimatePresence>
                {gameState === 'feedback' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-lg font-black uppercase italic tracking-widest ${lastResult === 'correct' ? 'text-emerald-400' : 'text-redhouse-primary'}`}
                  >
                    {lastResult === 'correct' ? 'Sinal Identificado!' : lastResult === 'timeout' ? 'Tempo Esgotado' : 'Frequência Incorreta'}
                  </motion.div>
                )}
              </AnimatePresence>
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
            <div className="w-32 h-32 bg-yellow-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 italic uppercase tracking-tighter">Missão Cumprida!</h2>
            <p className="text-xl text-slate-400 mb-12 font-bold italic uppercase">
              Você identificou {score} de {ROUNDS} sinais com precisão!
            </p>
            
            <div className="flex justify-center gap-8 mb-12">
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 min-w-[180px]">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Recompensa XP</div>
                <div className="text-5xl font-black text-redhouse-primary italic tracking-tighter">+{score * 10 + 30}</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 min-w-[180px]">
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Precisão</div>
                <div className="text-5xl font-black text-emerald-500 italic tracking-tighter">{Math.round((score/ROUNDS)*100)}%</div>
              </div>
            </div>

            <button
              onClick={() => {
                setGameState('start');
                setRound(1);
                setScore(0);
              }}
              className="px-12 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase italic tracking-widest"
            >
              REPETIR TREINAMENTO
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
