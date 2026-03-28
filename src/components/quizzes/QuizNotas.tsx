import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, Music } from 'lucide-react';
import { audio } from '../../lib/audio';

const NOTES_MAP = [
  { note: "Dó", cifra: "C" },
  { note: "Ré", cifra: "D" },
  { note: "Mi", cifra: "E" },
  { note: "Fá", cifra: "F" },
  { note: "Sol", cifra: "G" },
  { note: "Lá", cifra: "A" },
  { note: "Si", cifra: "B" }
];

interface QuizNotasProps {
  onComplete: (score: number) => void;
  addXP: (amount: number) => void;
}

export default function QuizNotas({ onComplete, addXP }: QuizNotasProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizMode, setQuizMode] = useState<'note-to-cifra' | 'cifra-to-note'>('note-to-cifra');
  const [options, setOptions] = useState<string[]>([]);

  const currentPair = NOTES_MAP[currentStep];

  useEffect(() => {
    // Randomize mode and options for each step
    const mode = Math.random() > 0.5 ? 'note-to-cifra' : 'cifra-to-note';
    setQuizMode(mode);
    
    const correctAnswer = mode === 'note-to-cifra' ? currentPair.cifra : currentPair.note;
    const allPossible = mode === 'note-to-cifra' ? NOTES_MAP.map(n => n.cifra) : NOTES_MAP.map(n => n.note);
    
    const wrongOptions = allPossible.filter(o => o !== correctAnswer);
    const shuffledWrong = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 3);
    const finalOptions = [correctAnswer, ...shuffledWrong].sort(() => Math.random() - 0.5);
    
    setOptions(finalOptions);
    setSelectedOption(null);
    setIsCorrect(null);
  }, [currentStep]);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correctAnswer = quizMode === 'note-to-cifra' ? currentPair.cifra : currentPair.note;
    const correct = option === correctAnswer;
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
    if (currentStep < NOTES_MAP.length - 1) {
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
        <p className="text-redhouse-muted font-bold mb-8">Você acertou {score} de {NOTES_MAP.length} notas.</p>
        
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
          {NOTES_MAP.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-all ${
                i < currentStep ? 'bg-emerald-500' : i === currentStep ? 'bg-redhouse-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-redhouse-muted uppercase italic">Questão {currentStep + 1}/{NOTES_MAP.length}</span>
      </div>

      <motion.div
        key={currentStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="glass-card p-8 text-center"
      >
        <div className="mb-8">
          <p className="text-xs font-black text-redhouse-muted uppercase italic tracking-widest mb-4">
            {quizMode === 'note-to-cifra' ? "Qual a cifra desta nota?" : "Qual nota representa esta cifra?"}
          </p>
          <div className="w-32 h-32 bg-redhouse-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-redhouse-primary shadow-[0_0_30px_rgba(196,18,48,0.2)]">
            <span className="text-5xl font-black text-redhouse-primary italic">
              {quizMode === 'note-to-cifra' ? currentPair.note : currentPair.cifra}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {options.map((option) => {
            const isSelected = selectedOption === option;
            const correctAnswer = quizMode === 'note-to-cifra' ? currentPair.cifra : currentPair.note;
            const isCorrectOption = option === correctAnswer;
            
            let btnClass = "p-6 rounded-2xl font-black text-2xl transition-all border-2 ";
            if (!selectedOption) {
              btnClass += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
            } else if (isSelected) {
              btnClass += isCorrect ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : "bg-red-500/20 border-red-500 text-red-500";
            } else if (isCorrectOption && selectedOption) {
              btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-500";
            } else {
              btnClass += "bg-white/5 border-white/5 opacity-50";
            }

            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={!!selectedOption}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedOption && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-8"
            >
              <button 
                onClick={nextQuestion}
                className="bg-redhouse-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic flex items-center gap-2 mx-auto hover:scale-105 transition-transform shadow-xl"
              >
                {currentStep < NOTES_MAP.length - 1 ? "Próxima Nota" : "Ver Resultado"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
