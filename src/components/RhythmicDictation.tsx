import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Music, Zap, Volume2, Hand, Ghost, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { audio } from '../lib/audio';

interface RhythmicDictationProps {
  addXP: (amount: number) => void;
}

type BeatType = 'clap' | 'silence';

interface Pattern {
  beats: BeatType[];
}

const BEAT_ICONS = {
  clap: <Hand className="w-12 h-12" />,
  silence: <Ghost className="w-12 h-12 opacity-20" />
};

const BEAT_COLORS = {
  clap: 'var(--color-pedagogy-orange)',
  silence: 'var(--color-redhouse-muted)'
};

export default function RhythmicDictation({ addXP }: RhythmicDictationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [options, setOptions] = useState<Pattern[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  const generateNewRound = () => {
    const generatePattern = (): Pattern => ({
      beats: Array.from({ length: 4 }, () => (Math.random() > 0.4 ? 'clap' : 'silence'))
    });

    const correct = generatePattern();
    const opt1 = generatePattern();
    const opt2 = generatePattern();

    const allOptions = [correct, opt1, opt2].sort(() => Math.random() - 0.5);
    
    setCurrentPattern(correct);
    setOptions(allOptions);
    setSelectedOption(null);
    setFeedback(null);
    setCurrentBeat(-1);
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const playPattern = () => {
    if (!currentPattern || isPlaying) return;
    
    setIsPlaying(true);
    setCurrentBeat(-1);
    
    let beat = 0;
    const interval = setInterval(() => {
      setCurrentBeat(beat);
      if (currentPattern.beats[beat] === 'clap') {
        audio.playTone(440, '8n');
      }
      
      beat++;
      if (beat >= currentPattern.beats.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentBeat(-1);
        }, 500);
      }
    }, 600);
  };

  const handleSelect = (index: number) => {
    if (feedback || isPlaying) return;
    
    setSelectedOption(index);
    const isCorrect = JSON.stringify(options[index].beats) === JSON.stringify(currentPattern?.beats);
    
    if (isCorrect) {
      setFeedback('correct');
      audio.playSuccess();
      addXP(30);
      setTimeout(generateNewRound, 2000);
    } else {
      setFeedback('wrong');
      audio.playError();
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1500);
    }
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      <div className="space-y-12 relative z-10">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 -rotate-3 border border-white/20">
            <Volume2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-white uppercase italic leading-none tracking-tighter">Dictation Console</h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Input Analysis: Ativo</span>
              </div>
              <button 
                onClick={() => setIsTeacherMode(!isTeacherMode)}
                className={`px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
                  isTeacherMode 
                    ? 'bg-redhouse-accent text-white shadow-[0_0_15px_rgba(32,80,255,0.4)]' 
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:border-blue-500/50'
                }`}
              >
                {isTeacherMode ? 'Sensor: Mestre' : 'Modo Professor'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Console Area */}
      <main className="glass-card p-12 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center border-white/5 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pedagogy-purple/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pedagogy-blue/5 blur-[120px] -z-10" />

        <div className="mb-16 flex flex-col items-center gap-10">
          <div className="relative group">
            {/* Holographic HUD UI */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 border border-dashed border-pedagogy-purple/30 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 border border-pedagogy-purple/10 rounded-full"
            />
            
            <motion.div 
              animate={{ 
                scale: isPlaying ? [1, 1.05, 1] : 1,
                boxShadow: isPlaying ? '0 0 50px rgba(176,38,255,0.3)' : '0 0 20px rgba(0,0,0,0.5)'
              }}
              className="w-40 h-40 bg-white rounded-full border-4 border-pedagogy-purple flex items-center justify-center text-7xl shadow-2xl relative z-10 transition-all overflow-hidden"
            >
              👦🏻
              <AnimatePresence>
                {isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-pedagogy-purple/10 backdrop-blur-[2px] flex items-center justify-center"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="w-20 h-20 border-2 border-white/50 rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Signal Indicator */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
               {[1, 2, 3].map(i => (
                 <motion.div 
                  key={i}
                  animate={{ opacity: isPlaying ? [0.2, 1, 0.2] : 0.2 }}
                  transition={{ delay: i * 0.1, repeat: Infinity }}
                  className="w-4 h-1 bg-pedagogy-purple rounded-full"
                 />
               ))}
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(176,38,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={playPattern}
            disabled={isPlaying}
            className={`px-16 py-8 rounded-[25px] font-black text-2xl uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-2xl border border-white/10 ${
              isPlaying 
                ? 'bg-white/5 text-redhouse-muted cursor-not-allowed opacity-50' 
                : 'bg-pedagogy-purple text-white hover:bg-pedagogy-purple/90'
            }`}
          >
            <Play className={`w-8 h-8 ${isPlaying ? '' : 'fill-white'}`} />
            <span className="italic">{isPlaying ? 'ANALISANDO...' : 'OUVIR FREQUÊNCIA'}</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {options.map((option, i) => (
            <motion.button 
              key={i}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              className={`p-10 rounded-[40px] border-2 transition-all relative overflow-hidden flex flex-col items-center gap-8 ${
                selectedOption === i 
                  ? feedback === 'correct' 
                    ? 'border-pedagogy-green bg-pedagogy-green/10 shadow-[0_0_40px_rgba(57,255,20,0.2)]' 
                    : 'border-pedagogy-red bg-pedagogy-red/10 shadow-[0_0_40px_rgba(255,31,31,0.2)]'
                  : 'border-white/5 bg-white/2 hover:border-white/10'
              }`}
            >
              <div className="flex justify-center gap-4 w-full">
                {option.beats.map((beat, j) => (
                  <motion.div 
                    key={j}
                    animate={isPlaying && currentBeat === j ? { 
                      scale: 1.2, 
                      y: -10,
                      boxShadow: `0 0 20px var(--color-pedagogy-purple)`
                    } : {}}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${
                      isPlaying && currentBeat === j 
                        ? 'border-pedagogy-purple bg-pedagogy-purple/20' 
                        : 'border-white/5 bg-white/5'
                    } ${beat === 'clap' ? 'text-white' : 'text-redhouse-muted opacity-20'}`}
                  >
                    <div className={beat === 'clap' ? 'text-pedagogy-orange' : ''}>
                      {BEAT_ICONS[beat]}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-2 text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em] italic">Assinatura #0{i + 1}</div>
              
              <AnimatePresence>
                {selectedOption === i && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`absolute inset-0 flex items-center justify-center backdrop-blur-md ${feedback === 'correct' ? 'bg-pedagogy-green/20' : 'bg-pedagogy-red/20'}`}
                  >
                    {feedback === 'correct' ? (
                      <CheckCircle2 className="w-24 h-24 text-white drop-shadow-2xl" />
                    ) : (
                      <XCircle className="w-24 h-24 text-white drop-shadow-2xl" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Bento Footer Features */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Music, label: 'Memória', desc: 'Retenção Rítmica', color: 'bg-pedagogy-purple' },
          { icon: Zap, label: 'Foco', desc: 'Atenção Plena', color: 'bg-pedagogy-blue' },
          { icon: HelpCircle, label: 'Lógica', desc: 'Análise de Padrões', color: 'bg-pedagogy-orange' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-10 border-white/5 group hover:border-white/10 transition-all bg-white/2 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.color}/10 blur-[40px] -z-10`} />
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${item.color}/10 rounded-2xl flex items-center justify-center text-white border border-white/5 group-hover:border-white/20 transition-all`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-black uppercase italic text-redhouse-text text-xl transition-all group-hover:translate-x-1">{item.label}</h4>
                <p className="text-[10px] font-bold text-redhouse-muted uppercase tracking-[0.3em] mt-1 italic">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Pedagogical Manual Footer */}
        <div className="md:col-span-3 mt-8 glass-card p-10 border-white/5 flex items-start gap-8 bg-pedagogy-purple/5 relative overflow-hidden ring-1 ring-pedagogy-purple/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pedagogy-purple/5 blur-[100px] -z-10" />
          <div className="w-20 h-20 glass-card border-white/10 flex items-center justify-center text-4xl shadow-2xl shrink-0 rotate-3">🎧</div>
          <div>
            <h4 className="font-black text-redhouse-text text-xl mb-4 italic uppercase tracking-tight">Manual do Maestro: Ditado</h4>
            <p className="text-redhouse-muted font-bold leading-relaxed max-w-2xl italic">
              "Treine seus receptores auditivos para decodificar assinaturas rítmicas. O Lucca emite ondas sonoras codificadas; sua missão é identificar o padrão exato no grid de opções. A precisão auditiva é o primeiro passo para o domínio instrumental."
            </p>
          </div>
        </div>
      </footer>
    </div>
  </section>
  );
}
