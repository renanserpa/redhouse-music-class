import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy, User } from 'lucide-react';
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
    question: "Qual é o jeito certo de sentar para tocar violão?",
    options: [
      "Deitado no sofá", 
      "Em uma cadeira confortável com as costas retinhas", 
      "No chão com as pernas cruzadas", 
      "Em pé pulando"
    ],
    correctAnswer: "Em uma cadeira confortável com as costas retinhas",
    explanation: "Sentar com as costas retas ajuda você a tocar melhor e não cansar!"
  },
  {
    id: 2,
    question: "Em qual perna o violão deve ficar apoiado?",
    options: ["Perna Direita", "Perna Esquerda", "Nas duas pernas", "No colo"],
    correctAnswer: "Perna Direita",
    explanation: "Apoiar na perna direita deixa o violão firme e pronto para tocar!"
  },
  {
    id: 3,
    question: "Onde deve ficar o polegar da mão esquerda?",
    options: [
      "Na frente das cordas", 
      "Atrás do braço do violão", 
      "Escondido no bolso", 
      "Segurando a tarraxa"
    ],
    correctAnswer: "Atrás do braço do violão",
    explanation: "O polegar atrás do braço dá o apoio necessário para os outros dedos apertarem as cordas."
  },
  {
    id: 4,
    question: "Como os dedos da mão esquerda devem apertar as cordas?",
    options: [
      "Usando a palma da mão", 
      "Usando a ponta dos dedos, formando um arco", 
      "Deitados sobre todas as cordas", 
      "Com muita força até doer"
    ],
    correctAnswer: "Usando a ponta dos dedos, formando um arco",
    explanation: "Formar um arco com os dedos evita que você encoste nas cordas vizinhas!"
  },
  {
    id: 5,
    question: "Na mão direita, qual dedo toca as cordas mais grossas?",
    options: ["Indicador", "Médio", "Anelar", "Polegar (P)"],
    correctAnswer: "Polegar (P)",
    explanation: "O Polegar (P) é o responsável pelos sons mais graves nas cordas grossas."
  }
];

interface QuizPosturaProps {
  onComplete: (score: number) => void;
  addXP: (amount: number) => void;
}

export default function QuizPostura({ onComplete, addXP }: QuizPosturaProps) {
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
        <h2 className="text-3xl font-black text-redhouse-text uppercase italic mb-2">Mestre da Postura!</h2>
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-redhouse-primary/10 rounded-xl flex items-center justify-center text-redhouse-primary">
            <User className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-redhouse-muted uppercase italic tracking-widest">Desafio de Postura</p>
        </div>

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
