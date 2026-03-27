import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { audio } from '../../lib/audio';
import { Trophy, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface StringMazeGameProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
}

interface StringLetter {
  id: string;
  letter: string;
  note: string;
  order: number;
}

const STRINGS: StringLetter[] = [
  { id: '1', letter: 'E', note: 'E4', order: 1 },
  { id: '2', letter: 'B', note: 'B3', order: 2 },
  { id: '3', letter: 'G', note: 'G3', order: 3 },
  { id: '4', letter: 'D', note: 'D3', order: 4 },
  { id: '5', letter: 'A', note: 'A2', order: 5 },
  { id: '6', letter: 'E', note: 'E2', order: 6 },
];

const MNEMONIC = "Minha Simples Solução Resolveu Labirintos Misteriosos";

export default function StringMazeGame({ onComplete, addXP }: StringMazeGameProps) {
  const [items, setItems] = useState<StringLetter[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  useEffect(() => {
    // Shuffle the strings
    setItems([...STRINGS].sort(() => Math.random() - 0.5));
  }, []);

  const checkOrder = () => {
    const isOrdered = items.every((item, index) => item.order === index + 1);
    if (isOrdered) {
      setIsCorrect(true);
      audio.playSuccess();
      addXP(30);
      setTimeout(() => onComplete(), 2000);
    } else {
      audio.playError();
    }
  };

  const handleItemClick = (note: string) => {
    audio.playNote(note);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-4 border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-2">
          O Labirinto das Cordas
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Ordene as cordas da 1ª (mais fina) até a 6ª (mais grossa).
        </p>
      </div>

      <div className="w-full flex flex-col gap-6">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              whileDrag={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              className="relative"
            >
              <motion.div
                onClick={() => handleItemClick(item.note)}
                className={`p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-redhouse-primary transition-colors ${
                  isCorrect ? 'border-emerald-500 bg-emerald-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-redhouse-primary text-white rounded-full flex items-center justify-center font-black italic">
                    {item.letter}
                  </div>
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    {item.order === 1 ? '1ª Corda (Fina)' : item.order === 6 ? '6ª Corda (Grossa)' : `${item.order}ª Corda`}
                  </span>
                </div>
                <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex flex-col gap-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={checkOrder}
            disabled={isCorrect}
            className="w-full py-4 bg-redhouse-primary text-white rounded-2xl font-black uppercase italic tracking-tighter shadow-lg shadow-redhouse-primary/30 disabled:opacity-50"
          >
            {isCorrect ? 'Ordem Perfeita!' : 'Verificar Labirinto'}
          </motion.button>

          <button
            onClick={() => setShowMnemonic(!showMnemonic)}
            className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-redhouse-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            {showMnemonic ? 'Esconder Dica' : 'Ver Dica do Mestre'}
          </button>

          <AnimatePresence>
            {showMnemonic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center"
              >
                <p className="text-blue-600 dark:text-blue-400 font-bold italic">
                  "{MNEMONIC}"
                </p>
                <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-widest font-black">
                  (M)inha (S)imples (S)olução (R)esolveu (L)abirintos (M)isteriosos
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
