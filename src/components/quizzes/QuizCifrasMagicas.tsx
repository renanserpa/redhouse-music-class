/**
 * @license SPDX-License-Identifier: Apache-2.0
 * Quiz Cifras Mágicas — Letras dos acordes internacionais
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy } from 'lucide-react';
import { audio } from '../../lib/audio';

interface Question { id: number; question: string; options: string[]; correctAnswer: string; explanation: string; }

const QUESTIONS: Question[] = [
  { id: 1, question: 'O acorde de Sol Maior é escrito com a letra:', options: ['S', 'G', 'Z', 'L'], correctAnswer: 'G', explanation: 'G de "Good"! G é Sol em inglês. Fica entre o F (Fá) e o A (Lá).' },
  { id: 2, question: 'O acorde de Dó Maior é escrito com a letra:', options: ['D', 'K', 'C', 'O'], correctAnswer: 'C', explanation: 'C de Cachorro! Em inglês, C é Dó. Lembre: C vem do latim "Cantus".' },
  { id: 3, question: 'O acorde de Ré Maior é escrito com a letra:', options: ['R', 'D', 'A', 'E'], correctAnswer: 'D', explanation: 'D de "Deutsch"! Em inglês, D é Ré. D fica depois do C na escala.' },
  { id: 4, question: 'O "m" minúsculo após a letra (ex: Am) significa:', options: ['Maior', 'Menor', 'Médio', 'Mágico'], correctAnswer: 'Menor', explanation: 'O "m" é de Menor! Am = Lá Menor. Acordes menores têm som mais triste.' },
  { id: 5, question: 'Qual cifra representa Mi Maior?', options: ['M', 'Em', 'E', 'Mi'], correctAnswer: 'E', explanation: 'E de English! E é Mi em inglês. E maiúsculo sem "m" = Mi Maior.' },
];

interface QuizCifrasMagicasProps { onComplete: () => void; addXP: (amount: number) => void; }

export function QuizCifrasMagicas({ onComplete, addXP }: QuizCifrasMagicasProps) {
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
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at:50%_0%,rgba(234,179,8,0.1),transparent_70%)]"></div>
      <div className="w-28 h-28 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] animate-bounce"><Trophy className="w-14 h-14 text-yellow-500" /></div>
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Cifras Dominadas!</h2>
        <p className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">Protocolo de Tradução Completo</p>
      </div>
      <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 inline-block">
        <p className="text-5xl font-black italic tracking-tighter text-white">{score}<span className="text-slate-700 text-2xl mx-1">/</span>{QUESTIONS.length}</p>
        <p className="text-slate-500 font-bold uppercase text-[10px] mt-2">{score >= 4 ? 'Status: Poliglota Musical' : 'Status: Tradutor em Treinamento'}</p>
      </div>
      <button onClick={onComplete} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] border-b-8 border-emerald-800 active:border-b-0">Finalizar Protocolo</button>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 text-white">
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Processando Pergunta {step + 1} de {QUESTIONS.length}</p>
          <span className="text-xs font-black text-slate-500 italic tracking-tighter">CIPHER_SYNC_v1</span>
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
        <div className="grid grid-cols-2 gap-6">
          {q.options.map(option => {
            const isSel = selected === option;
            const isRight = option === q.correctAnswer;
            let cls = 'w-full p-8 rounded-[2.5rem] font-black text-center text-4xl italic transition-all border-4 relative overflow-hidden group ';
            
            if (!selected) cls += 'bg-slate-950/50 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-400 hover:text-white';
            else if (isSel) cls += isCorrect 
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
              : 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
            else if (isRight && selected) cls += 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
            else cls += 'bg-slate-950/20 border-slate-900 opacity-30';
            
            return (
              <button key={option} onClick={() => pick(option)} disabled={!!selected} className={cls}>
                <span className="relative z-10">{option}</span>
                {isSel && <motion.div layoutId="selection-glow" className={`absolute inset-0 opacity-10 bg-current`} />}
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

export default QuizCifrasMagicas;
