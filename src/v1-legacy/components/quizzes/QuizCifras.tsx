import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
import { getRandomDialogue } from '../../lib/npcDialogues';

interface QuizCifrasProps {
  onComplete: (xp: number) => void;
  onUpdateNPC: (state: 'idle' | 'celebrating' | 'encouraging', message: string) => void;
  instrument: 'guitar' | 'ukulele';
}

const CIFRAS_DATA = [
  { note: 'Dó', cifra: 'C' },
  { note: 'Ré', cifra: 'D' },
  { note: 'Mi', cifra: 'E' },
  { note: 'Fá', cifra: 'F' },
  { note: 'Sol', cifra: 'G' },
  { note: 'Lá', cifra: 'A' },
  { note: 'Si', cifra: 'B' }
];

export const QuizCifras: React.FC<QuizCifrasProps> = ({
  onComplete,
  onUpdateNPC,
  instrument
}) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'finished'>('start');
  const [target, setTarget] = useState<{ note: string; cifra: string }>(CIFRAS_DATA[0]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const generateRound = useCallback((roundNum: number) => {
    const currentTarget = CIFRAS_DATA[roundNum - 1];
    setTarget(currentTarget);
    
    // Generate options: always include correct answer + 3 random others
    const otherCifras = CIFRAS_DATA.filter(d => d.cifra !== currentTarget.cifra).map(d => d.cifra);
    const shuffledOthers = otherCifras.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [currentTarget.cifra, ...shuffledOthers].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
    setGameState('playing');
    setIsCorrect(null);
  }, []);

  const handleAnswer = (cifra: string) => {
    if (gameState !== 'playing') return;

    const correct = cifra === target.cifra;
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
      if (round < CIFRAS_DATA.length) {
        const nextRound = round + 1;
        setRound(nextRound);
        generateRound(nextRound);
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
            <h2 className="text-4xl font-black text-slate-900 mb-4">Quiz: Cifras Musicais</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
              Qual é a cifra correta para cada nota? Vamos testar seu conhecimento!
            </p>
            <button
              onClick={() => generateRound(1)}
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
            <div className="text-2xl font-black text-slate-400 mb-8">Pergunta {round} de {CIFRAS_DATA.length}</div>
            
            <div className="text-center mb-12">
              <div className="text-sm font-bold text-slate-500 uppercase mb-2">Qual é a cifra da nota:</div>
              <div className="text-7xl font-black text-redhouse-primary">{target.note}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={gameState !== 'playing'}
                  className={`p-6 rounded-2xl border-4 font-black text-4xl transition-all ${
                    gameState === 'feedback' && option === target.cifra
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : gameState === 'feedback' && !isCorrect && option !== target.cifra
                      ? 'bg-red-50 border-red-200 text-red-300'
                      : 'bg-slate-50 border-slate-900 text-slate-900 hover:bg-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {gameState === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 flex items-center gap-2 font-black text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {isCorrect ? (
                  <><CheckCircle2 className="w-8 h-8" /> Perfeito!</>
                ) : (
                  <><XCircle className="w-8 h-8" /> Ops! {target.note} é {target.cifra}.</>
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
              Você acertou {score} de {CIFRAS_DATA.length} cifras!
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
