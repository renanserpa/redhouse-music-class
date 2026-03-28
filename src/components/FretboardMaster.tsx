/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { Zap, Trophy, Timer, Star, CheckCircle2, XCircle } from 'lucide-react';

interface FretboardMasterProps {
  addXP: (amount: number) => void;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STRINGS = [
  { note: 'E', baseIndex: 4 }, // High E
  { note: 'B', baseIndex: 11 },
  { note: 'G', baseIndex: 7 },
  { note: 'D', baseIndex: 2 },
  { note: 'A', baseIndex: 9 },
  { note: 'E', baseIndex: 4 }, // Low E
];

export default function FretboardMaster({ addXP }: FretboardMasterProps) {
  const [currentChallenge, setCurrentChallenge] = useState<{ string: number; fret: number; note: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const generateChallenge = useCallback(() => {
    const stringIdx = Math.floor(Math.random() * 6);
    const fret = Math.floor(Math.random() * 13); // 0 to 12
    const stringBase = STRINGS[stringIdx].baseIndex;
    const noteIdx = (stringBase + fret) % 12;
    const correctNote = NOTE_NAMES[noteIdx];

    // Generate options
    const otherNotes = NOTE_NAMES.filter(n => n !== correctNote);
    const shuffledOthers = [...otherNotes].sort(() => Math.random() - 0.5);
    const challengeOptions = [correctNote, ...shuffledOthers.slice(0, 3)].sort(() => Math.random() - 0.5);

    setCurrentChallenge({ string: stringIdx + 1, fret, note: correctNote });
    setOptions(challengeOptions);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateChallenge();
    audio.playTone(440, '8n');
  };

  const handleAnswer = (selectedNote: string) => {
    if (!currentChallenge || gameState !== 'playing') return;

    if (selectedNote === currentChallenge.note) {
      setScore(prev => prev + 10);
      setFeedback({ type: 'success', message: 'PERFEITO!' });
      audio.playSuccess();
      addXP(5);
      setTimeout(generateChallenge, 800);
    } else {
      setFeedback({ type: 'error', message: `ERROU! ERA ${currentChallenge.note}` });
      audio.playError();
      setTimeout(generateChallenge, 1200);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('result');
            addXP(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, addXP]);

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden text-white">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black uppercase italic">Mestre do Braço</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
            <Timer className="w-5 h-5 text-cyan-400" />
            <span className="font-black text-xl">{timeLeft}s</span>
          </div>
          <div className="bg-white border-4 border-slate-900 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-black text-xl">{score}</span>
          </div>
        </div>
      </header>

      <main className="bg-slate-900 rounded-[48px] p-12 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center border-8 border-slate-800 shadow-2xl mb-8">
        {gameState === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-cyan-500 text-white px-12 py-6 rounded-[32px] font-black text-2xl uppercase tracking-widest shadow-2xl border-b-8 border-cyan-700 active:border-b-0 transition-all"
          >
            Começar Desafio
          </motion.button>
        )}

        {gameState === 'playing' && currentChallenge && (
          <div className="w-full max-w-4xl">
            {/* Fretboard Visualization */}
            <div className="relative h-64 bg-slate-800 rounded-3xl mb-12 border-4 border-slate-700 overflow-hidden shadow-inner">
              {/* Strings */}
              <div className="absolute inset-0 flex flex-col justify-between py-8 px-12">
                {[1, 2, 3, 4, 5, 6].map(s => (
                  <div key={s} className="h-1 w-full bg-slate-600 relative">
                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">
                      {STRINGS[s-1].note}
                    </span>
                  </div>
                ))}
              </div>

              {/* Frets */}
              <div className="absolute inset-0 flex justify-between px-12">
                {Array.from({ length: 13 }).map((_, f) => (
                  <div key={f} className="w-1.5 bg-slate-900 h-full relative">
                    {f > 0 && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-600 font-black text-[10px]">{f}</span>}
                  </div>
                ))}
              </div>

              {/* Challenge Marker */}
              <motion.div
                key={`${currentChallenge.string}-${currentChallenge.fret}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  borderColor: feedback?.type === 'success' ? ['#ffffff', '#22d3ee', '#ffffff'] : '#ffffff',
                  boxShadow: feedback?.type === 'success' 
                    ? ['0 0 0px rgba(34, 211, 238, 0)', '0 0 20px rgba(34, 211, 238, 0.8)', '0 0 0px rgba(34, 211, 238, 0)']
                    : '0 0 20px rgba(6, 182, 212, 0.5)'
                }}
                transition={{
                  borderColor: { duration: 0.4, repeat: feedback?.type === 'success' ? Infinity : 0 },
                  boxShadow: { duration: 0.4, repeat: feedback?.type === 'success' ? Infinity : 0 }
                }}
                className="absolute z-20 w-12 h-12 bg-cyan-500 rounded-full border-4 border-white flex items-center justify-center"
                style={{
                  left: `${(currentChallenge.fret * (100 / 12.5)) + 4}%`,
                  top: `${((currentChallenge.string - 1) * (100 / 5.5)) + 8}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-4 h-4 bg-white rounded-full animate-ping" />
              </motion.div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm ${
                      feedback.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    <div className={`px-10 py-5 rounded-3xl border-4 shadow-2xl flex items-center gap-4 ${
                      feedback.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'
                    }`}>
                      {feedback.type === 'success' ? <CheckCircle2 className="text-white w-8 h-8" /> : <XCircle className="text-white w-8 h-8" />}
                      <span className="text-white font-black text-3xl italic uppercase tracking-tighter">{feedback.message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map(note => (
                <motion.button
                  key={note}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(note)}
                  className="bg-white p-6 rounded-[32px] border-4 border-slate-700 font-black text-3xl text-slate-900 shadow-xl hover:border-cyan-500 transition-all"
                >
                  {note}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white"
          >
            <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6 animate-bounce" />
            <h4 className="text-5xl font-black uppercase italic mb-2">Fim de Jogo!</h4>
            <p className="text-xl font-bold text-slate-400 mb-8 uppercase tracking-widest">Você identificou {score / 10} notas</p>
            <div className="bg-white/10 p-8 rounded-[40px] border-4 border-white/10 mb-10">
              <span className="block text-xs font-black text-slate-400 uppercase mb-2">Recompensa Total</span>
              <span className="text-6xl font-black text-emerald-400">+{score} XP</span>
            </div>
            <button
              onClick={startGame}
              className="bg-white text-slate-900 px-12 py-6 rounded-[32px] font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all"
            >
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </main>

      <footer className="bg-slate-50 p-8 rounded-[40px] border-4 border-slate-900 flex items-start gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center text-3xl shadow-lg shrink-0">💡</div>
        <div>
          <h4 className="font-black text-xl mb-2 uppercase italic">Dica de Mestre</h4>
          <p className="text-slate-600 font-bold leading-relaxed">
            "Lembre-se que as notas se repetem a cada 12 casas! A casa 12 é exatamente a mesma nota da corda solta, só que mais aguda. Use isso para se localizar mais rápido!"
          </p>
        </div>
      </footer>
    </section>
  );
}
