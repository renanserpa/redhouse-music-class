import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../lib/audio';
import { Trophy, Music, Heart, Timer } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 bg-white rounded-3xl shadow-xl border-4 border-slate-900 overflow-hidden relative">
      {/* Header Info */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border-2 border-slate-900">
          <Timer className="w-5 h-5 text-redhouse-primary" />
          <span className="font-black text-xl">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border-2 border-slate-900">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-black text-xl">{score}/{ROUNDS}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center"
          >
            <h2 className="text-4xl font-black text-slate-900 mb-4">Elefante ou Passarinho?</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
              Ouça o som e decida: é um som 🐘 GRAVE (grosso) ou 🐦 AGUDO (fino)?
            </p>
            <button
              onClick={generateRound}
              className="px-12 py-4 bg-redhouse-primary text-white font-black text-2xl rounded-2xl shadow-xl hover:scale-105 transition-transform border-4 border-slate-900"
            >
              COMEÇAR!
            </button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'feedback') && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center"
          >
            <div className="text-2xl font-black text-slate-400 mb-8">Rodada {round} de {ROUNDS}</div>
            
            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
              {/* Elefante - Grave */}
              <motion.button
                whileHover={gameState === 'playing' ? { scale: 1.05 } : {}}
                whileTap={gameState === 'playing' ? { scale: 0.95 } : {}}
                animate={lastResult === 'correct' && targetType === 'grave' ? { y: [0, -40, 0] } : {}}
                onClick={() => handleAnswer('grave')}
                disabled={gameState !== 'playing'}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-4 transition-all ${
                  gameState === 'feedback' && targetType === 'grave'
                    ? 'bg-green-100 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                    : gameState === 'feedback' && lastResult === 'wrong' && targetType !== 'grave'
                    ? 'bg-red-50 border-red-200 opacity-50'
                    : 'bg-slate-50 border-slate-900 hover:bg-white'
                }`}
              >
                <span className="text-8xl mb-4">🐘</span>
                <span className="text-2xl font-black text-slate-900">GRAVE</span>
                <span className="text-sm font-bold text-slate-500 uppercase">Cerdas Grossas</span>
              </motion.button>

              {/* Passarinho - Agudo */}
              <motion.button
                whileHover={gameState === 'playing' ? { scale: 1.05 } : {}}
                whileTap={gameState === 'playing' ? { scale: 0.95 } : {}}
                animate={lastResult === 'correct' && targetType === 'agudo' ? { y: [0, -40, 0] } : {}}
                onClick={() => handleAnswer('agudo')}
                disabled={gameState !== 'playing'}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-4 transition-all ${
                  gameState === 'feedback' && targetType === 'agudo'
                    ? 'bg-green-100 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                    : gameState === 'feedback' && lastResult === 'wrong' && targetType !== 'agudo'
                    ? 'bg-red-50 border-red-200 opacity-50'
                    : 'bg-slate-50 border-slate-900 hover:bg-white'
                }`}
              >
                <span className="text-8xl mb-4">🐦</span>
                <span className="text-2xl font-black text-slate-900">AGUDO</span>
                <span className="text-sm font-bold text-slate-500 uppercase">Cordas Finas</span>
              </motion.button>
            </div>

            <div className="mt-12">
              <button 
                onClick={() => {
                  const notes = targetType === 'grave' ? GRAVE_NOTES : AGUDO_NOTES;
                  audio.playNote(notes[0], '2n');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Music className="w-5 h-5" />
                Ouvir novamente
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-900 shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Treinamento Concluído!</h2>
            <p className="text-xl text-slate-600 mb-8">
              Você acertou {score} de {ROUNDS} sons!
            </p>
            <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-900 inline-block mb-8">
              <div className="text-sm font-bold text-slate-500 uppercase mb-1">XP Ganhos</div>
              <div className="text-4xl font-black text-redhouse-primary">+{score * 10 + 30} XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
