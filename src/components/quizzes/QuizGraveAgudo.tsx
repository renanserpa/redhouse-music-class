import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, Volume2, Play } from 'lucide-react';
import { audio } from '../../lib/audio';

interface QuizGraveAgudoProps {
  onComplete: (score: number) => void;
  addXP: (amount: number) => void;
}

const ROUNDS = 5;

export default function QuizGraveAgudo({ onComplete, addXP }: QuizGraveAgudoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'grave' | 'agudo' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentType, setCurrentType] = useState<'grave' | 'agudo'>('grave');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    generateNewRound();
  }, [currentStep]);

  const generateNewRound = () => {
    const type = Math.random() > 0.5 ? 'grave' : 'agudo';
    setCurrentType(type);
    setSelectedOption(null);
    setIsCorrect(null);
    setIsPlaying(false);
  };

  const playSound = async () => {
    setIsPlaying(true);
    // Grave: E2 (low), Agudo: E4 (high)
    const freq = currentType === 'grave' ? 82.41 : 329.63;
    await audio.playGuitar(freq, 1.5, 0.8);
    setIsPlaying(false);
  };

  const handleOptionSelect = (option: 'grave' | 'agudo') => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === currentType;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      audio.playSuccess();
      addXP(10);
    } else {
      audio.playError();
    }
  };

  const nextQuestion = () => {
    if (currentStep < ROUNDS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-black text-redhouse-text uppercase italic mb-2">Quiz Concluído!</h2>
        <p className="text-redhouse-muted font-bold mb-8">Você acertou {score} de {ROUNDS} sons.</p>
        
        <button 
          onClick={() => onComplete(score)}
          className="bg-redhouse-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic hover:scale-105 transition-transform shadow-xl"
        >
          Continuar Jornada
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-2">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-all ${
                i < currentStep ? 'bg-emerald-500' : i === currentStep ? 'bg-redhouse-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-redhouse-muted uppercase italic">Rodada {currentStep + 1}/{ROUNDS}</span>
      </div>

      <motion.div
        key={currentStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="glass-card p-8 text-center"
      >
        <div className="mb-12">
          <p className="text-xs font-black text-redhouse-muted uppercase italic tracking-widest mb-6">
            Ouça o som e identifique:
          </p>
          
          <button
            onClick={playSound}
            disabled={isPlaying}
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 transition-all shadow-xl ${
              isPlaying 
                ? 'bg-redhouse-primary border-redhouse-primary scale-110 shadow-redhouse-primary/40' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {isPlaying ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Volume2 className="w-12 h-12 text-white" />
              </motion.div>
            ) : (
              <Play className="w-12 h-12 text-redhouse-primary fill-current" />
            )}
          </button>
          <p className="mt-4 text-sm font-black text-redhouse-muted uppercase italic">Clique para ouvir</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          <button
            onClick={() => handleOptionSelect('grave')}
            disabled={!!selectedOption}
            className={`p-8 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 ${
              !selectedOption 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : selectedOption === 'grave'
                ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-red-500/20 border-red-500 text-red-500')
                : (currentType === 'grave' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/5 opacity-50')
            }`}
          >
            <span className="text-5xl">🐘</span>
            <span className="font-black uppercase italic text-xl">Grave</span>
          </button>

          <button
            onClick={() => handleOptionSelect('agudo')}
            disabled={!!selectedOption}
            className={`p-8 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 ${
              !selectedOption 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                : selectedOption === 'agudo'
                ? (isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-red-500/20 border-red-500 text-red-500')
                : (currentType === 'agudo' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-white/5 border-white/5 opacity-50')
            }`}
          >
            <span className="text-5xl">🐦</span>
            <span className="font-black uppercase italic text-xl">Agudo</span>
          </button>
        </div>

        <AnimatePresence>
          {selectedOption && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-12"
            >
              <div className="mb-6">
                {isCorrect ? (
                  <p className="text-emerald-500 font-black uppercase italic">Isso sim é música! Você está voando! 🚀</p>
                ) : (
                  <p className="text-red-500 font-black uppercase italic">Quase! Toda corda desafina às vezes — vamos tentar de novo? 🎸</p>
                )}
              </div>
              <button 
                onClick={nextQuestion}
                className="bg-redhouse-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 mx-auto hover:scale-105 transition-transform shadow-xl"
              >
                {currentStep < ROUNDS - 1 ? "Próximo Som" : "Ver Resultado"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
