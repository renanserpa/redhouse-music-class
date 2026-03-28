import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Trophy, CheckCircle2, XCircle, Info } from 'lucide-react';
import { getRandomDialogue } from '../../lib/npcDialogues';

interface QuizAnatomiaProps {
  onComplete: (xp: number) => void;
  onUpdateNPC: (state: 'idle' | 'celebrating' | 'encouraging', message: string) => void;
  instrument: 'guitar' | 'ukulele';
}

const ANATOMY_DATA = [
  { part: 'Headstock', desc: 'Onde ficam as tarraxas para afinar as cordas.', icon: '🎸' },
  { part: 'Tarraxas', desc: 'As peças que giramos para esticar ou soltar as cordas.', icon: '⚙️' },
  { part: 'Pestana', desc: 'A peça branca que separa o braço do headstock.', icon: '⚪' },
  { part: 'Braço', desc: 'A parte longa onde colocamos os dedos para fazer as notas.', icon: '📏' },
  { part: 'Traste', desc: 'Os ferrinhos que dividem o braço em casas.', icon: '➖' },
  { part: 'Casa', desc: 'O espaço entre dois trastes onde apertamos a corda.', icon: '🏠' },
  { part: 'Boca', desc: 'O buraco no corpo do violão por onde sai o som.', icon: '🕳️' },
  { part: 'Ponte', desc: 'Onde as cordas ficam presas no corpo do instrumento.', icon: '🌉' }
];

export const QuizAnatomia: React.FC<QuizAnatomiaProps> = ({
  onComplete,
  onUpdateNPC,
  instrument
}) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'finished'>('start');
  const [target, setTarget] = useState<typeof ANATOMY_DATA[0]>(ANATOMY_DATA[0]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const generateRound = useCallback((roundNum: number) => {
    const currentTarget = ANATOMY_DATA[roundNum - 1];
    setTarget(currentTarget);
    
    const otherParts = ANATOMY_DATA.filter(p => p.part !== currentTarget.part).map(p => p.part);
    const shuffledOthers = otherParts.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [currentTarget.part, ...shuffledOthers].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
    setGameState('playing');
    setIsCorrect(null);
  }, []);

  const handleAnswer = (answer: string) => {
    if (gameState !== 'playing') return;

    const correct = answer === target.part;
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
      if (round < ANATOMY_DATA.length) {
        const nextRound = round + 1;
        setRound(nextRound);
        generateRound(nextRound);
      } else {
        setGameState('finished');
        onComplete(score * 10);
      }
    }, 2500);
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
            <h2 className="text-4xl font-black text-slate-900 mb-4">Quiz: Anatomia do Instrumento</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
              Você conhece as partes do seu {instrument === 'guitar' ? 'violão' : 'ukulele'}?
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
            <div className="text-2xl font-black text-slate-400 mb-8">Pergunta {round} de {ANATOMY_DATA.length}</div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border-4 border-slate-900 mb-8 w-full max-w-md text-center">
              <div className="text-6xl mb-4">{target.icon}</div>
              <div className="text-sm font-bold text-slate-500 uppercase mb-2">Qual parte é esta?</div>
              <p className="text-xl font-medium text-slate-700 italic">"{target.desc}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={gameState !== 'playing'}
                  className={`p-6 rounded-2xl border-4 font-black text-xl transition-all ${
                    gameState === 'feedback' && option === target.part
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : gameState === 'feedback' && !isCorrect && option !== target.part
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
                  <><CheckCircle2 className="w-8 h-8" /> Isso mesmo!</>
                ) : (
                  <><XCircle className="w-8 h-8" /> Ops! Esta parte é o {target.part}.</>
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
              Você acertou {score} de {ANATOMY_DATA.length} partes!
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
