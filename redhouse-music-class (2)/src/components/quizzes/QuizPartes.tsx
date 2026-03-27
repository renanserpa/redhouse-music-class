import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy } from 'lucide-react';
import { audio } from '../../lib/audio';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Como se chamam os 'botõezinhos' que giramos para afinar o violão?",
    options: ["Trastes", "Tarraxas", "Ponte", "Boca"],
    correctAnswer: "Tarraxas",
    explanation: "As Tarraxas são como botõezinhos que giramos para deixar o violão afinado!"
  },
  {
    id: 2,
    question: "Qual é o nome da 'pequena pecinha' que segura as cordas no lugar certo perto das tarraxas?",
    options: ["Ponte", "Tampo", "Pestana ou Nut", "Casas"],
    correctAnswer: "Pestana ou Nut",
    explanation: "A Pestana (ou Nut) segura as cordas no lugar certo no início do braço."
  },
  {
    id: 3,
    question: "Onde colocamos os dedos para fazer as notas e os acordes?",
    options: ["Na Boca", "No Tampo", "No Braço", "Na Ponte"],
    correctAnswer: "No Braço",
    explanation: "O Braço é a parte longa onde colocamos os dedos para fazer as notas!"
  },
  {
    id: 4,
    question: "Como se chamam as barrinhas de metal que dividem as casas?",
    options: ["Trastes", "Pregos", "Barras", "Divisores"],
    correctAnswer: "Trastes",
    explanation: "Os Trastes ajudam a dividir as casas e deixam o som bem afinado."
  },
  {
    id: 5,
    question: "Qual parte do violão vibra e faz a música ficar ainda mais legal?",
    options: ["Boca", "Tampo", "Ponte", "Headstock"],
    correctAnswer: "Tampo",
    explanation: "O Tampo é a frente do violão. Quando tocamos as cordas, ele vibra!"
  }
];

interface QuizPartesProps {
  onComplete: (score: number) => void;
  addXP: (amount: number) => void;
}

export default function QuizPartes({ onComplete, addXP }: QuizPartesProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
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
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
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
        <p className="text-redhouse-muted font-bold mb-8">Você acertou {score} de {QUESTIONS.length} perguntas.</p>
        
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
          {QUESTIONS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full transition-all ${
                i < currentStep ? 'bg-emerald-500' : i === currentStep ? 'bg-redhouse-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-redhouse-muted uppercase italic">Questão {currentStep + 1}/{QUESTIONS.length}</span>
      </div>

      <motion.div
        key={currentStep}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        className="glass-card p-8"
      >
        <h3 className="text-2xl font-black text-redhouse-text mb-8 leading-tight">{currentQuestion.question}</h3>
        
        <div className="grid gap-4">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let btnClass = "w-full p-5 rounded-2xl font-bold text-left transition-all border-2 ";
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
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSelected && (isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
                  {isCorrectOption && selectedOption && !isSelected && <CheckCircle2 className="w-6 h-6" />}
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedOption && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="flex gap-4 items-start">
                <HelpCircle className="w-6 h-6 text-redhouse-primary shrink-0" />
                <div>
                  <p className="font-bold text-redhouse-text mb-4">{currentQuestion.explanation}</p>
                  <button 
                    onClick={nextQuestion}
                    className="flex items-center gap-2 text-redhouse-primary font-black uppercase italic text-sm hover:translate-x-2 transition-transform"
                  >
                    {currentStep < QUESTIONS.length - 1 ? "Próxima Questão" : "Ver Resultado"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
