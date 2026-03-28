import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../../lib/audio';
import { CheckCircle2, XCircle, Music, Zap, Volume2 } from 'lucide-react';

interface QuizRitmoAvancadoProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  feedback: {
    correct: string;
    wrong: string;
  };
  hasAudio?: boolean;
  audioPattern?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Qual sílaba usamos para a Semínima (1 tempo longo)?",
    options: ["Ti-ti", "Tá", "Chiu"],
    correct: 1,
    feedback: {
      correct: "Tááá! Muito bem, som no tempo 1.",
      wrong: "Ti-ti são duas notinhas rápidas. Tente a outra."
    }
  },
  {
    id: 2,
    question: "A Mínima vale a metade de qual nota?",
    options: ["Semínima", "Semibreve"],
    correct: 1,
    feedback: {
      correct: "Matemática musical perfeita!",
      wrong: "A Semibreve é a figura mais longa de todas!"
    }
  },
  {
    id: 3,
    question: "Ouça o padrão rítmico. Qual é a ordem correta?",
    options: ["Tá - Tá - Tá - Tá", "Tá - Chiu - Tá - Chiu", "Ti-ti - Ti-ti - Tá - Tá"],
    correct: 1,
    hasAudio: true,
    audioPattern: ['Tá', 'Chiu', 'Tá', 'Chiu'],
    feedback: {
      correct: "Isso! Você capturou o silêncio perfeitamente.",
      wrong: "Faltou ouvir o 'Chiu' de dedo na boca!"
    }
  },
  {
    id: 4,
    question: "O 'P' na mão direita (PIMA) significa:",
    options: ["Pestana", "Polegar", "Pular"],
    correct: 1,
    feedback: {
      correct: "Polegar! O dono das cordas grossas.",
      wrong: "Estamos falando dos dedos da mão direita (PIMA)."
    }
  }
];

export default function QuizRitmoAvancado({ onComplete, addXP }: QuizRitmoAvancadoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];

  const playPattern = async () => {
    if (!currentQuestion.audioPattern || isPlaying) return;
    setIsPlaying(true);
    
    for (const beat of currentQuestion.audioPattern) {
      if (beat === 'Tá') {
        await audio.playClick(true, 'woodblock');
      } else if (beat === 'Ti-ti') {
        await audio.playClick(false, 'woodblock');
        await new Promise(r => setTimeout(r, 250));
        await audio.playClick(false, 'woodblock');
      } else {
        // Chiu (silence)
        await new Promise(r => setTimeout(r, 500));
      }
      await new Promise(r => setTimeout(r, 500));
    }
    
    setIsPlaying(false);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correct) {
      audio.playSuccess();
      addXP(15);
    } else {
      audio.playError();
    }

    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(s => s + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        onComplete();
      }
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-4 border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500 fill-current" />
          <span className="font-black italic text-slate-400 uppercase tracking-widest text-xs">Desafio de Ritmo</span>
        </div>
        <div className="text-slate-400 font-black italic text-xs uppercase tracking-widest">
          Questão {currentStep + 1} / {QUESTIONS.length}
        </div>
      </div>

      <div className="w-full mb-12">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-8">
          {currentQuestion.question}
        </h2>

        {currentQuestion.hasAudio && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playPattern}
            disabled={isPlaying}
            className="w-full p-6 mb-8 bg-redhouse-primary/10 border-2 border-redhouse-primary/20 rounded-2xl flex items-center justify-center gap-4 text-redhouse-primary"
          >
            <Volume2 className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="font-black uppercase italic tracking-tighter text-xl">
              {isPlaying ? 'Ouvindo...' : 'Ouvir Padrão'}
            </span>
          </motion.button>
        )}

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              className={`p-6 rounded-2xl border-2 text-left font-black uppercase italic tracking-tighter text-xl transition-all flex items-center justify-between ${
                isAnswered
                  ? index === currentQuestion.correct
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : index === selectedOption
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-slate-100 dark:border-slate-800 opacity-50'
                  : 'border-slate-100 dark:border-slate-800 hover:border-redhouse-primary bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {option}
              {isAnswered && index === currentQuestion.correct && <CheckCircle2 className="w-6 h-6" />}
              {isAnswered && index === selectedOption && index !== currentQuestion.correct && <XCircle className="w-6 h-6" />}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`w-full p-6 rounded-2xl border-2 flex items-start gap-4 ${
              selectedOption === currentQuestion.correct
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            <div className={`p-2 rounded-xl ${selectedOption === currentQuestion.correct ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
              {selectedOption === currentQuestion.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-black uppercase italic tracking-tighter text-lg leading-none mb-1">
                {selectedOption === currentQuestion.correct ? 'Mandou bem!' : 'Quase lá!'}
              </p>
              <p className="text-sm font-medium opacity-80">
                {selectedOption === currentQuestion.correct ? currentQuestion.feedback.correct : currentQuestion.feedback.wrong}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
