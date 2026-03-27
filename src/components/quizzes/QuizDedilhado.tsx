/**
 * @license SPDX-License-Identifier: Apache-2.0
 * Quiz Dedilhado — P-I-M-A (Mão Direita)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy } from 'lucide-react';
import { audio } from '../../lib/audio';

interface Question { id: number; question: string; options: string[]; correctAnswer: string; explanation: string; }

const QUESTIONS: Question[] = [
  { id: 1, question: 'O "P" da mão direita significa:', options: ['Pestana', 'Polegar', 'Pular', 'Pinçar'], correctAnswer: 'Polegar', explanation: 'P de Polegar! O dono das cordas grossas (4ª, 5ª, 6ª).' },
  { id: 2, question: 'O "I" da mão direita significa:', options: ['Íntimo', 'Indicador', 'Isolado', 'Inferior'], correctAnswer: 'Indicador', explanation: 'I de Indicador! Ele cuida da 3ª corda (Sol/G).' },
  { id: 3, question: 'O "M" da mão direita significa:', options: ['Musica', 'Menor', 'Médio', 'Manual'], correctAnswer: 'Médio', explanation: 'M de Médio! O fiel parceiro da 2ª corda.' },
  { id: 4, question: 'O "A" da mão direita significa:', options: ['Alto', 'Anelar', 'Anterior', 'Agudo'], correctAnswer: 'Anelar', explanation: 'A de Anelar! Ele cuida da 1ª corda (E fino).' },
  { id: 5, question: 'Na sequência PIMA, qual dedo vem primeiro?', options: ['Anelar', 'Médio', 'Indicador', 'Polegar'], correctAnswer: 'Polegar', explanation: 'PIMA começa pelo Polegar! Ele bate nas cordas graves para criar o baixo.' },
];

interface QuizDedilhadoProps { onComplete: () => void; addXP: (amount: number) => void; }

export function QuizDedilhado({ onComplete, addXP }: QuizDedilhadoProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];

  const pick = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === q.correctAnswer;
    setIsCorrect(correct);
    if (correct) { setScore(s => s + 1); audio.playSuccess(); addXP(10); } else { audio.playError(); }
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) { setStep(s => s + 1); setSelected(null); setIsCorrect(null); } else { setDone(true); }
  };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 space-y-8 bg-slate-900 rounded-[3rem] border-4 border-slate-800 shadow-2xl relative overflow-hidden text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.1),transparent_70%)]"></div>
      <div className="w-28 h-28 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] animate-bounce"><Trophy className="w-14 h-14 text-yellow-500" /></div>
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Missão Cumprida!</h2>
        <p className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">Relatório de Desempenho Sônico</p>
      </div>
      <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 inline-block">
        <p className="text-5xl font-black italic tracking-tighter text-white">{score}<span className="text-slate-700 text-2xl mx-1">/</span>{QUESTIONS.length}</p>
        <p className="text-slate-500 font-bold uppercase text-[10px] mt-2">{score >= 4 ? 'Status: Mãos de Rockstar' : 'Status: Estagiário de Ritmo'}</p>
      </div>
      <button onClick={onComplete} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] border-b-8 border-emerald-800 active:border-b-0">Finalizar Protocolo</button>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 text-white">
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Processando Pergunta {step + 1} de {QUESTIONS.length}</p>
          <span className="text-xs font-black text-slate-500 italic tracking-tighter">DATASET_V2025</span>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : i === step ? 'bg-cyan-500 animate-pulse' : 'bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <motion.div key={step} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-900 rounded-[3rem] p-8 md:p-12 border-4 border-slate-800 shadow-2xl relative overflow-hidden">
        {/* HUD Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <h3 className="text-2xl md:text-3xl font-black mb-10 leading-none italic tracking-tighter text-white">{q.question}</h3>
        <div className="grid gap-4">
          {q.options.map(option => {
            const isSel = selected === option;
            const isRight = option === q.correctAnswer;
            let cls = 'w-full p-6 rounded-[2rem] font-black text-left transition-all border-4 relative overflow-hidden flex items-center justify-between group ';
            
            if (!selected) cls += 'bg-slate-950/50 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-white';
            else if (isSel) cls += isCorrect 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
              : 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
            else if (isRight && selected) cls += 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
            else cls += 'bg-slate-950/20 border-slate-900 opacity-30';
            
            return (
              <button key={option} onClick={() => pick(option)} disabled={!!selected} className={cls}>
                <span className="relative z-10 text-lg md:text-xl italic tracking-tight">{option}</span>
                <div className="relative z-10">
                  {isSel && (isCorrect ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <XCircle className="w-8 h-8 text-rose-500" />)}
                  {isRight && selected && !isSel && <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />}
                </div>
                {/* Visual Accent */}
                {isSel && <motion.div layoutId="selection-glow" className={`absolute inset-0 opacity-10 bg-current transition-colors`} />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div initial={{ height: 0, opacity: 0, y: 20 }} animate={{ height: 'auto', opacity: 1, y: 0 }} className="mt-10 p-8 bg-slate-950 rounded-[2.5rem] border-2 border-slate-800 shadow-inner">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 border-2 border-slate-800">
                  <HelpCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-300 text-lg mb-6 leading-relaxed italic">"{q.explanation}"</p>
                  <motion.button 
                    whileHover={{ x: 10 }}
                    onClick={next} 
                    className="flex items-center gap-3 text-cyan-400 font-black uppercase italic text-sm tracking-widest hover:text-cyan-300 transition-colors"
                  >
                    {step < QUESTIONS.length - 1 ? 'Continuar Protocolo' : 'Gerar Resultado'} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default QuizDedilhado;
