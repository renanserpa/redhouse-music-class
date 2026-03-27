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
    <div className="flex flex-col items-center justify-center p-10 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-3xl mx-auto relative overflow-hidden group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />

      <div className="text-center mb-10 relative z-10 w-full">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          O Labirinto das Cordas
        </h2>
        <div className="flex items-center justify-center gap-4 text-slate-400 font-bold uppercase italic tracking-widest text-[10px]">
          <span>Mapeamento de Tensão</span>
          <div className="w-1 h-1 bg-white/20 rounded-full" />
          <span>Ordene da 1ª (Fina) p/ 6ª (Grossa)</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8 relative z-10">
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              whileDrag={{ scale: 1.02, rotate: 1, zIndex: 50 }}
              className="relative"
            >
              <motion.div
                onClick={() => handleItemClick(item.note)}
                className={`p-5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing backdrop-blur-md flex items-center justify-between group/item ${
                  isCorrect 
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5 shadow-xl'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black italic text-2xl border transition-all ${
                    isCorrect ? 'bg-emerald-500 border-white/20 text-white' : 'bg-redhouse-primary border-white/10 text-white shadow-lg shadow-redhouse-primary/20'
                  }`}>
                    {item.letter}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-black uppercase italic tracking-tighter text-lg leading-none ${isCorrect ? 'text-emerald-400' : 'text-white'}`}>
                      {item.order === 1 ? '1ª Corda (Fina)' : item.order === 6 ? '6ª Corda (Grossa)' : `${item.order}ª Corda`}
                    </span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 italic">
                      Frequency Sync: {item.note}
                    </span>
                  </div>
                </div>
                
                {/* Drag Indicator HUD */}
                <div className="flex flex-col gap-1 opacity-20 group-hover/item:opacity-50 transition-opacity">
                  <div className="w-6 h-0.5 bg-white rounded-full" />
                  <div className="w-4 h-0.5 bg-white rounded-full" />
                  <div className="w-6 h-0.5 bg-white rounded-full" />
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex flex-col gap-6 mt-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={checkOrder}
            disabled={isCorrect}
            className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest text-xl shadow-2xl transition-all border border-white/20 ${
              isCorrect 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                : 'bg-redhouse-primary text-white shadow-[0_10px_40px_rgba(239,68,68,0.4)]'
            }`}
          >
            {isCorrect ? 'SOLUÇÃO DECODIFICADA' : 'VERIFICAR CABEAMENTO'}
          </motion.button>

          <button
            onClick={() => setShowMnemonic(!showMnemonic)}
            className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            {showMnemonic ? 'Ocultar Criptografia' : 'Exibir Dica do Mestre'}
          </button>

          <AnimatePresence>
            {showMnemonic && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 text-center shadow-2xl"
              >
                <div className="w-1 h-8 bg-blue-500/50 mx-auto mb-4 rounded-full" />
                <p className="text-white text-lg font-black italic tracking-tighter mb-2">
                  "{MNEMONIC}"
                </p>
                <div className="flex justify-center gap-2 flex-wrap text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">
                  {MNEMONIC.split(' ').map((word, i) => (
                    <span key={i} className="bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                      ({word[0]}){word.slice(1)}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion Trophy - Full HUD Overlay */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-32 h-32 bg-yellow-500/20 rounded-[2.5rem] flex items-center justify-center mb-6 border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.3)]"
            >
              <Trophy className="w-16 h-16 text-yellow-500" />
            </motion.div>
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Mapping Complete</h3>
            <div className="bg-emerald-500/20 px-8 py-3 rounded-2xl border border-emerald-500/30">
              <span className="text-3xl font-black text-emerald-400 italic tracking-tighter">+30 XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
