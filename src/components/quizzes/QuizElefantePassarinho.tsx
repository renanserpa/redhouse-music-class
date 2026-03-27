import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../../lib/audio';
import { Trophy, Music, CheckCircle2, XCircle, Volume2 } from 'lucide-react';
import { getRandomDialogue } from '../../lib/npcDialogues';

interface QuizElefantePassarinhoProps {
  onComplete: (xp: number) => void;
  onUpdateNPC: (state: 'idle' | 'celebrating' | 'encouraging', message: string) => void;
  instrument: 'guitar' | 'ukulele';
}

const ROUNDS = 7;
const GRAVE_NOTES = ['E2', 'A2', 'D3'];
const AGUDO_NOTES = ['B4', 'E4', 'G4'];

export const QuizElefantePassarinho: React.FC<QuizElefantePassarinhoProps> = ({
  onComplete,
  onUpdateNPC,
  instrument
}) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'finished'>('start');
  const [targetType, setTargetType] = useState<'grave' | 'agudo'>('grave');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateRound = useCallback(() => {
    const type = Math.random() > 0.5 ? 'grave' : 'agudo';
    setTargetType(type);
    setGameState('playing');
    setIsCorrect(null);
    
    // Play the sound
    const notes = type === 'grave' ? GRAVE_NOTES : AGUDO_NOTES;
    const note = notes[Math.floor(Math.random() * notes.length)];
    setTimeout(() => audio.playNote(note, '2n'), 500);
  }, []);

  const handleAnswer = (type: 'grave' | 'agudo') => {
    if (gameState !== 'playing') return;

    const correct = type === targetType;
    setIsCorrect(correct);
    setGameState('feedback');

    if (correct) {
      setScore(prev => prev + 1);
      audio.playSuccess();
      onUpdateNPC('celebrating', getRandomDialogue('correct', instrument));
    } else {
      audio.playError();
      onUpdateNPC('encouraging', getRandomDialogue('wrong', instrument));
    }

    setTimeout(() => {
      if (round < ROUNDS) {
        setRound(prev => prev + 1);
        generateRound();
      } else {
        setGameState('finished');
        onComplete(score * 10);
      }
    }, 2000);
  };

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
            <h2 className="text-4xl font-black text-slate-900 mb-4">Quiz: Elefante ou Passarinho?</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
              Ouça o som e identifique se é um som 🐘 GRAVE ou 🐦 AGUDO.
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
            className="w-full flex flex-col items-center"
          >
            <div className="text-2xl font-black text-slate-400 mb-8">Pergunta {round} de {ROUNDS}</div>
            
            <button 
              onClick={() => {
                const notes = targetType === 'grave' ? GRAVE_NOTES : AGUDO_NOTES;
                audio.playNote(notes[0], '2n');
              }}
              className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl mb-12 hover:bg-slate-200 transition-colors"
            >
              <Volume2 className="w-16 h-16 text-redhouse-primary" />
            </button>

            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
              <button
                onClick={() => handleAnswer('grave')}
                disabled={gameState !== 'playing'}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-4 transition-all ${
                  gameState === 'feedback' && targetType === 'grave'
                    ? 'bg-green-100 border-green-500'
                    : gameState === 'feedback' && !isCorrect && targetType !== 'grave'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-900 hover:bg-white'
                }`}
              >
                <span className="text-8xl mb-4">🐘</span>
                <span className="text-2xl font-black text-slate-900">GRAVE</span>
              </button>

              <button
                onClick={() => handleAnswer('agudo')}
                disabled={gameState !== 'playing'}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-4 transition-all ${
                  gameState === 'feedback' && targetType === 'agudo'
                    ? 'bg-green-100 border-green-500'
                    : gameState === 'feedback' && !isCorrect && targetType !== 'agudo'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-900 hover:bg-white'
                }`}
              >
                <span className="text-8xl mb-4">🐦</span>
                <span className="text-2xl font-black text-slate-900">AGUDO</span>
              </button>
            </div>

            {gameState === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 flex items-center gap-2 font-black text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {isCorrect ? (
                  <><CheckCircle2 className="w-8 h-8" /> Excelente!</>
                ) : (
                  <><XCircle className="w-8 h-8" /> Ops! Tente ouvir novamente.</>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-900 shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Quiz Finalizado!</h2>
            <p className="text-xl text-slate-600 mb-8">
              Você acertou {score} de {ROUNDS} perguntas!
            </p>
            <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-900 inline-block mb-8">
              <div className="text-sm font-bold text-slate-500 uppercase mb-1">XP Ganhos</div>
              <div className="text-4xl font-black text-redhouse-primary">+{score * 10} XP</div>
            </div>
            <button
              onClick={() => {
                setRound(1);
                setScore(0);
                setGameState('start');
              }}
              className="block mx-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Tentar Novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
