/**
 * @license SPDX-License-Identifier: Apache-2.0
 * Quiz Posições — Postura e posicionamento correto
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy } from 'lucide-react';
import { audio } from '../../lib/audio';

interface Question { id: number; question: string; options: string[]; correctAnswer: string; explanation: string; emoji: string; }

const QUESTIONS: Question[] = [
  { id: 1, emoji: '🤚', question: 'O polegar da mão esquerda deve ficar:', options: ['Dobrado na frente das cordas', 'Escondido atrás do braço', 'Em cima do braço', 'Esticado para cima'], correctAnswer: 'Escondido atrás do braço', explanation: 'Postura de Rockstar! O polegar fica apoiado atrás do braço, como um suporte invisível.' },
  { id: 2, emoji: '💺', question: 'Ao segurar o violão sentado, o instrumento deve ficar:', options: ['No joelho direito', 'No chão', 'No joelho esquerdo com a cintura bem apoiada', 'Apoiado no ombro'], correctAnswer: 'No joelho esquerdo com a cintura bem apoiada', explanation: 'A cintura do violão (parte côncava) descansa no joelho esquerdo para postura clássica estável.' },
  { id: 3, emoji: '🖐️', question: 'Os dedos da mão esquerda devem apertar a corda:', options: ['Em cima do traste (ferrinho)', 'Logo antes do traste (mais perto dele)', 'No meio da casa', 'No início da casa'], correctAnswer: 'Logo antes do traste (mais perto dele)', explanation: 'Aperte logo antes do ferrinho dourado! Isso deixa o som limpo sem chiados ou abafamentos.' },
  { id: 4, emoji: '🙆', question: 'A coluna deve estar:', options: ['Dobrada para ver o instrumento', 'Reta e relaxada', 'Inclinada para frente', 'Totalmente rígida'], correctAnswer: 'Reta e relaxada', explanation: 'Coluna reta mas relaxada! Tensão é o inimigo do músico. Respire e solte os ombros.' },
  { id: 5, emoji: '✊', question: 'A unhas da mão esquerda devem estar:', options: ['Longas para tocar', 'Cortadas curtas', 'Pintadas', 'Não importa'], correctAnswer: 'Cortadas curtas', explanation: 'Unhas curtas na mão esquerda são obrigatórias! Unhas longas impedem o dedo de tocar a corda corretamente.' },
];

interface QuizPosicoesProps { onComplete: () => void; addXP: (amount: number) => void; }

export function QuizPosicoes({ onComplete, addXP }: QuizPosicoesProps) {
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
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8 space-y-6">
      <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto"><Trophy className="w-12 h-12 text-yellow-500" /></div>
      <h2 className="text-3xl font-black text-redhouse-text uppercase italic">Postura Aprovada!</h2>
      <p className="text-redhouse-muted font-bold">{score}/{QUESTIONS.length} acertos! {score >= 4 ? 'Postura de Rockstar!' : 'Atenção à postura no próximo treino!'}</p>
      <button onClick={onComplete} className="bg-redhouse-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic hover:scale-105 transition-transform shadow-xl">Continuar Jornada</button>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex gap-2">{QUESTIONS.map((_, i) => <div key={i} className={`h-2 w-8 rounded-full transition-all ${i < step ? 'bg-emerald-500' : i === step ? 'bg-redhouse-primary' : 'bg-white/10'}`} />)}</div>
        <span className="text-xs font-black text-redhouse-muted uppercase italic">Questão {step + 1}/{QUESTIONS.length}</span>
      </div>
      <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-8">
        <div className="text-5xl text-center mb-6">{q.emoji}</div>
        <h3 className="text-xl font-black text-redhouse-text mb-8 leading-tight">{q.question}</h3>
        <div className="grid gap-4">
          {q.options.map(option => {
            const isSel = selected === option;
            const isRight = option === q.correctAnswer;
            let cls = 'w-full p-5 rounded-2xl font-bold text-left transition-all border-2 ';
            if (!selected) cls += 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20';
            else if (isSel) cls += isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-red-500/20 border-red-500 text-red-500';
            else if (isRight && selected) cls += 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
            else cls += 'bg-white/5 border-white/5 opacity-50';
            return (
              <button key={option} onClick={() => pick(option)} disabled={!!selected} className={cls}>
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSel && (isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
                  {isRight && selected && !isSel && <CheckCircle2 className="w-6 h-6" />}
                </div>
              </button>
            );
          })}
        </div>
        <AnimatePresence>{selected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex gap-4 items-start">
              <HelpCircle className="w-6 h-6 text-redhouse-primary shrink-0" />
              <div>
                <p className="font-bold text-redhouse-text mb-4">{q.explanation}</p>
                <button onClick={next} className="flex items-center gap-2 text-redhouse-primary font-black uppercase italic text-sm hover:translate-x-2 transition-transform">
                  {step < QUESTIONS.length - 1 ? 'Próxima Questão' : 'Ver Resultado'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}</AnimatePresence>
      </motion.div>
    </div>
  );
}

export default QuizPosicoes;
