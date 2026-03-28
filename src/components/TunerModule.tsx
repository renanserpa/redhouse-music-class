import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Info, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { audio } from '../lib/audio';

const STRINGS = [
  { id: 6, name: "Mi (E)", note: "E2", freq: 82.41, description: "6ª Corda (Mais Grossa)" },
  { id: 5, name: "Lá (A)", note: "A2", freq: 110.00, description: "5ª Corda" },
  { id: 4, name: "Ré (D)", note: "D3", freq: 146.83, description: "4ª Corda" },
  { id: 3, name: "Sol (G)", note: "G3", freq: 196.00, description: "3ª Corda" },
  { id: 2, name: "Si (B)", note: "B3", freq: 246.94, description: "2ª Corda" },
  { id: 1, name: "Mi (E)", note: "E4", freq: 329.63, description: "1ª Corda (Mais Fina)" },
];

export default function TunerModule() {
  const [activeString, setActiveString] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playReference = async (stringId: number) => {
    const string = STRINGS.find(s => s.id === stringId);
    if (!string) return;

    setActiveString(stringId);
    setIsPlaying(true);
    await audio.playGuitar(string.freq, 2, 0.8);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-redhouse-text uppercase italic tracking-tighter mb-4">
          Afinador <span className="text-redhouse-primary">Mágico</span>
        </h1>
        <p className="text-redhouse-muted font-bold uppercase italic text-sm">
          Aprenda a afinar seu instrumento de ouvido! 🎸✨
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Tuner Interface */}
        <div className="space-y-6">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-redhouse-primary/20" />
            
            <div className="flex justify-between items-center mb-12">
              <div className="text-left">
                <p className="text-[10px] font-black text-redhouse-muted uppercase italic tracking-widest">Afinando Corda</p>
                <h3 className="text-3xl font-black text-redhouse-text italic">
                  {activeString ? STRINGS.find(s => s.id === activeString)?.name : "Selecione..."}
                </h3>
              </div>
              <div className="w-16 h-16 bg-redhouse-primary/10 rounded-2xl flex items-center justify-center text-redhouse-primary border border-redhouse-primary/20">
                <Volume2 className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            {/* Visual Indicator (Simple) */}
            <div className="mb-12 relative h-12 flex items-center">
              <div className="absolute inset-0 bg-white/5 rounded-full border border-white/10" />
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-redhouse-primary shadow-[0_0_10px_rgba(196,18,48,0.5)] z-10" />
              
              <div className="absolute left-4 text-[10px] font-black text-redhouse-muted uppercase italic">Grave</div>
              <div className="absolute right-4 text-[10px] font-black text-redhouse-muted uppercase italic">Agudo</div>

              <AnimatePresence>
                {isPlaying && (
                  <motion.div 
                    initial={{ x: '-50%', opacity: 0 }}
                    animate={{ x: '0%', opacity: 1 }}
                    exit={{ x: '50%', opacity: 0 }}
                    className="absolute left-[calc(50%-12px)] w-6 h-6 bg-redhouse-primary rounded-full shadow-[0_0_20px_rgba(196,18,48,0.8)] z-20"
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {STRINGS.map((string) => (
                <button
                  key={string.id}
                  onClick={() => playReference(string.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    activeString === string.id
                      ? 'bg-redhouse-primary border-redhouse-primary text-white shadow-xl scale-105'
                      : 'bg-white/5 border-white/10 text-redhouse-muted hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl font-black italic">{string.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-black uppercase italic opacity-70">{string.id}ª</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-emerald-500/10 border-emerald-500/20">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-emerald-500 uppercase italic mb-1">Dica do Mestre Corda</h4>
                <p className="text-sm text-redhouse-text font-bold leading-tight mb-2">
                  "Lembre-se da nossa frase mágica para as cordas: <span className="text-redhouse-primary">Minha Simples Solução Resolve Labirintos Misteriosos</span> (Mi-Si-Sol-Ré-Lá-Mi)!"
                </p>
                <p className="text-xs text-redhouse-muted font-bold">
                  Sempre comece pela corda mais fina (1ª) e vá até a mais grossa (6ª).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-black text-redhouse-text uppercase italic mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-redhouse-primary" />
              Afinando de Ouvido
            </h3>
            
            <div className="space-y-4">
              <p className="text-xs font-black text-redhouse-muted uppercase italic mb-4">Passo a passo relativo (Pág. 21):</p>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[10px] text-redhouse-primary shrink-0 mt-1">1</div>
                <p className="text-xs text-redhouse-muted font-bold">Afine a <span className="text-redhouse-text">6ª Corda (Mi)</span> como referência.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[10px] text-redhouse-primary shrink-0 mt-1">2</div>
                <p className="text-xs text-redhouse-muted font-bold">Aperte a <span className="text-redhouse-text">6ª corda na 5ª casa</span>. O som deve ser igual à <span className="text-redhouse-text">5ª corda solta</span>.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[10px] text-redhouse-primary shrink-0 mt-1">3</div>
                <p className="text-xs text-redhouse-muted font-bold">Aperte a <span className="text-redhouse-text">5ª corda na 5ª casa</span>. O som deve ser igual à <span className="text-redhouse-text">4ª corda solta</span>.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[10px] text-redhouse-primary shrink-0 mt-1">4</div>
                <p className="text-xs text-redhouse-muted font-bold">Aperte a <span className="text-redhouse-text">4ª corda na 5ª casa</span>. O som deve ser igual à <span className="text-redhouse-text">3ª corda solta</span>.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[10px] text-redhouse-primary shrink-0 mt-1">5</div>
                <p className="text-xs text-redhouse-muted font-bold"><span className="text-redhouse-primary">MUDANÇA!</span> Aperte a <span className="text-redhouse-text">3ª corda na 4ª casa</span> para afinar a <span className="text-redhouse-text">2ª corda solta</span>.</p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[10px] text-redhouse-primary shrink-0 mt-1">6</div>
                <p className="text-xs text-redhouse-muted font-bold">Aperte a <span className="text-redhouse-text">2ª corda na 5ª casa</span>. O som deve ser igual à <span className="text-redhouse-text">1ª corda solta</span>.</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-redhouse-primary/5 border-redhouse-primary/10">
            <h4 className="font-black text-redhouse-primary uppercase italic mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Atenção!
            </h4>
            <p className="text-xs text-redhouse-muted font-bold leading-relaxed">
              Cuidado para não apertar demais! As cordas podem arrebentar se ficarem muito esticadas. Vá girando a tarraxa aos pouquinhos enquanto toca a corda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
