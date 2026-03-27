import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { Trophy, CheckCircle2, XCircle } from 'lucide-react';
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
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[550px] p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 overflow-hidden relative group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center relative z-10"
          >
            <div className="w-24 h-24 bg-redhouse-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-redhouse-primary/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <Trophy className="w-12 h-12 text-redhouse-primary" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">Missão: Anatomia</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-md mx-auto font-bold italic uppercase tracking-tight">
              A nave {instrument === 'guitar' ? 'Violão' : 'Ukulele'} está em manutenção. Identifique as partes para decolar!
            </p>
            <button
              onClick={() => generateRound(1)}
              className="px-16 py-5 bg-redhouse-primary text-white font-black text-2xl rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:scale-105 transition-all active:scale-95 border border-white/20 uppercase italic tracking-widest"
            >
              INICIAR SCANNER
            </button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'feedback') && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center relative z-10"
          >
            <div className="text-2xl font-black text-white/20 mb-8 italic uppercase tracking-[0.2em]">Diagnóstico {round} de {ANATOMY_DATA.length}</div>
            
            <div className="bg-black/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 mb-10 w-full max-w-md text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <div className="text-7xl mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">{target.icon}</div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3 italic">PROTOCOLO_ID: {target.part.toUpperCase()}</div>
              <p className="text-2xl font-black text-white italic tracking-tight leading-snug">"{target.desc}"</p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={gameState !== 'playing'}
                  className={`p-6 rounded-2xl border-2 font-black text-lg italic uppercase tracking-tighter transition-all relative overflow-hidden group/opt ${
                    gameState === 'feedback' && option === target.part
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                      : gameState === 'feedback' && !isCorrect && option === target.part
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400/50'
                      : gameState === 'feedback' && !isCorrect && option !== target.part
                      ? 'bg-redhouse-primary/10 border-redhouse-primary/20 text-redhouse-primary/30 opacity-40'
                      : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                  {option}
                </button>
              ))}
            </div>

            {gameState === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-10 flex items-center gap-3 font-black text-2xl italic uppercase tracking-tighter ${isCorrect ? 'text-emerald-400' : 'text-redhouse-primary'}`}
              >
                {isCorrect ? (
                  <><CheckCircle2 className="w-8 h-8" /> Identificação Confirmada!</>
                ) : (
                  <><XCircle className="w-8 h-8" /> Falha: Componente é o {target.part}</>
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
            className="text-center relative z-10"
          >
            <div className="w-32 h-32 bg-yellow-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 italic uppercase tracking-tighter">Scanner Completo!</h2>
            <p className="text-xl text-slate-400 mb-12 font-bold italic uppercase">
              Diagnóstico de {score} / {ANATOMY_DATA.length} concluído com sucesso.
            </p>
            
            <div className="bg-black/40 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 inline-block mb-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-redhouse-primary/40 to-transparent" />
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2 italic">Recompensa_XP</div>
              <div className="text-6xl font-black text-redhouse-primary italic tracking-tighter">+{score * 10} XP</div>
            </div>
            <br />
            <button
              onClick={() => {
                setRound(1);
                setScore(0);
                setGameState('start');
              }}
              className="px-12 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase italic tracking-widest"
            >
              REINICIAR PROTOCOLO
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/5 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/5 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/5 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/5 rounded-br-2xl pointer-events-none" />
    </div>
  );
};
