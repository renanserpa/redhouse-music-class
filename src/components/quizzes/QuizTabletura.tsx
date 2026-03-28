/**
 * @license SPDX-License-Identifier: Apache-2.0
 * Quiz Tablatura — Leitura de Tablaturas
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Trophy } from 'lucide-react';
import { audio } from '../../lib/audio';

interface Question { id: number; question: string; options: string[]; correctAnswer: string; explanation: string; }

const QUESTIONS: Question[] = [
  { id: 1, question: 'Na tablatura, as linhas horizontais representam:', options: ['Os trastes', 'As cordas', 'Os dedos', 'Os compassos'], correctAnswer: 'As cordas', explanation: 'Cada linha = 1 corda! A linha mais abaixo é a 6ª corda (E grosso), a mais acima é a 1ª corda (E fino).' },
  { id: 2, question: 'O número 3 na linha mais alta (E fino) significa:', options: ['Tocar a 3ª corda solta', 'Pressionar a 3ª casa da 1ª corda', 'Tocar 3 vezes', 'Volume 3'], correctAnswer: 'Pressionar a 3ª casa da 1ª corda', explanation: 'A linha é a corda, o número é a casa! Número 3 = apertar na 3ª casa daquela corda.' },
  { id: 3, question: 'O que significa o número "0" em uma linha da tablatura?', options: ['Não tocar', 'Tocar a corda solta (sem dedo)', 'Casa zero inexistente', 'Silêncio'], correctAnswer: 'Tocar a corda solta (sem dedo)', explanation: '0 = corda solta! Sem colocar nenhum dedo, toque a corda para ouvir a nota natural.' },
  { id: 4, question: 'Números empilhados verticalmente na tablatura indicam:', options: ['Uma sequência rápida', 'Um acorde (notas juntas)', 'Uma pausa', 'Vibrato'], correctAnswer: 'Um acorde (notas juntas)', explanation: 'Números na mesma coluna vertical = tocar todas ao mesmo tempo. É um acorde!' },
  { id: 5, question: 'Na frase "E|---3---" da tablatura, onde colocamos o dedo?', options: ['3ª corda', '3ª casa da corda E', 'Corda E solta', '3ª posição geral'], correctAnswer: '3ª casa da corda E', explanation: 'E|---3--- significa: na corda E (1ª), pressione a 3ª casa. Simples assim!' },
];

interface QuizTablaturaProps { onComplete: () => void; addXP: (amount: number) => void; }

export function QuizTabletura({ onComplete, addXP }: QuizTablaturaProps) {
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
      <h2 className="text-3xl font-black text-redhouse-text uppercase italic">Tablatura Decifrada!</h2>
      <p className="text-redhouse-muted font-bold">{score}/{QUESTIONS.length} acertos! {score >= 4 ? 'Leitura fluida!' : 'Continue lendo tablaturas!'}</p>
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
        {/* Tab visual example */}
        <div className="bg-black/30 rounded-2xl p-4 mb-6 font-mono text-sm text-emerald-400 overflow-x-auto">
          <div>e|---0---3---1---|</div>
          <div>B|---1---0---1---|</div>
          <div>G|---0---0---2---|</div>
          <div>D|---2---0---2---|</div>
          <div>A|---3---2---0---|</div>
          <div>E|---x---3---x---|</div>
        </div>
        <h3 className="text-xl font-black text-redhouse-text mb-8 leading-tight">{q.question}</h3>
        <div className="grid gap-4">
          {q.options.map(option => {
            const isSel = selected === option;
            const isRight = option === q.correctAnswer;
            let cls = 'w-full p-4 rounded-2xl font-bold text-left transition-all border-2 text-sm ';
            if (!selected) cls += 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20';
            else if (isSel) cls += isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-red-500/20 border-red-500 text-red-500';
            else if (isRight && selected) cls += 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
            else cls += 'bg-white/5 border-white/5 opacity-50';
            return (
              <button key={option} onClick={() => pick(option)} disabled={!!selected} className={cls}>
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSel && (isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                  {isRight && selected && !isSel && <CheckCircle2 className="w-5 h-5" />}
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

export default QuizTabletura;
