import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Settings, Music, Zap, Volume2, Hand, Footprints, MousePointer2, Ghost } from 'lucide-react';
import { audio } from '../lib/audio';

interface RhythmChallengeProps {
  addXP: (amount: number) => void;
}

type ActionType = 'clap' | 'stomp' | 'snap' | 'silence';

interface Beat {
  id: string;
  type: ActionType;
}

const ACTION_ICONS = {
  clap: <Hand className="w-12 h-12" />,
  stomp: <Footprints className="w-12 h-12" />,
  snap: <MousePointer2 className="w-12 h-12" />,
  silence: <Ghost className="w-12 h-12 opacity-20" />
};

const ACTION_LABELS = {
  clap: 'PALMA',
  stomp: 'PÉ',
  snap: 'ESTALO',
  silence: 'SILÊNCIO'
};

const ACTION_COLORS = {
  clap: 'var(--color-pedagogy-orange)',
  stomp: 'var(--color-pedagogy-blue)',
  snap: 'var(--color-pedagogy-purple)',
  silence: 'var(--color-redhouse-muted)'
};

export default function RhythmChallenge({ addXP }: RhythmChallengeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTecherMode, setIsTeacherMode] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generatePattern = () => {
    const types: ActionType[] = ['clap', 'stomp', 'snap', 'silence'];
    const newBeats = Array.from({ length: 8 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      type: types[Math.floor(Math.random() * types.length)]
    }));
    setBeats(newBeats);
  };

  useEffect(() => {
    generatePattern();
  }, []);

  const startChallenge = () => {
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countInterval);
          setIsPlaying(true);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const stopChallenge = () => {
    setIsPlaying(false);
    setCurrentBeat(-1);
    if (timerRef.current) clearInterval(timerRef.current);
    addXP(50);
  };

  useEffect(() => {
    if (isPlaying) {
      const beatDuration = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        setCurrentBeat(prev => {
          const next = (prev + 1) % beats.length;
          const beat = beats[next];
          
          if (beat.type === 'clap') audio.playTone(440, '8n');
          else if (beat.type === 'stomp') audio.playTone(220, '4n');
          else if (beat.type === 'snap') audio.playTone(880, '8n');
          
          return next;
        });
      }, beatDuration);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, bpm, beats]);

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 relative overflow-hidden text-white group">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      <div className="space-y-12 relative z-10">
      {/* HUD Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-pedagogy-orange rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pedagogy-orange/30 rotate-3 border border-white/20">
            <Music className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-redhouse-text uppercase italic leading-none tracking-tighter">Rhythm Console v2</h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-pedagogy-orange/10 text-pedagogy-orange rounded-full border border-pedagogy-orange/20">
                <div className="w-2 h-2 bg-pedagogy-orange rounded-full shadow-[0_0_8px_var(--color-pedagogy-orange)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Motor Rítmico Ativo</span>
              </div>
              <button 
                onClick={() => setIsTeacherMode(!isTecherMode)}
                className={`px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
                  isTecherMode 
                    ? 'bg-redhouse-accent text-white shadow-[0_0_15px_rgba(32,80,255,0.4)]' 
                    : 'bg-white/5 text-redhouse-muted border border-white/10 hover:border-redhouse-accent/50'
                }`}
              >
                {isTecherMode ? 'Sensor: Mestre' : 'Modo Professor'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 glass-card p-3 border-white/5 bg-white/2">
          <div className="flex flex-col items-center px-6 border-r border-white/10">
            <span className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.2em] mb-1 italic">Vento/Tempo</span>
            <div className="flex items-center gap-4">
               <input 
                type="range" 
                min="60" 
                max="180" 
                value={bpm} 
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pedagogy-orange"
              />
              <span className="text-2xl font-black text-pedagogy-orange italic w-12 text-center">{bpm}</span>
            </div>
          </div>
          <button 
            onClick={generatePattern}
            className="p-4 rounded-xl hover:bg-white/5 text-redhouse-muted hover:text-redhouse-text transition-all border border-transparent hover:border-white/10"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Console Area */}
      <main className={`glass-card p-12 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center border-white/5 backdrop-blur-xl transition-all ${isPlaying ? 'ring-4 ring-pedagogy-orange/20 shadow-[0_0_50px_rgba(255,159,28,0.1)]' : 'shadow-2xl'}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pedagogy-orange/5 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pedagogy-blue/5 blur-[120px] -z-10" />

        <AnimatePresence>
          {countdown !== null && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 3, opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-3xl"
            >
              <div className="relative">
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-20 border-2 border-dashed border-pedagogy-orange/30 rounded-full"
                />
                <motion.span 
                  key={countdown}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[250px] font-black text-pedagogy-orange italic drop-shadow-[0_0_50px_rgba(255,159,28,0.5)] relative z-10"
                >
                  {countdown}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Flash Effect */}
        {isPlaying && (
          <motion.div 
            key={currentBeat}
            initial={{ opacity: 0.15 }}
            animate={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none z-10"
          />
        )}

        {!isPlaying && countdown === null ? (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,159,28,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={startChallenge}
            className="bg-pedagogy-orange text-white px-16 py-8 rounded-[30px] font-black text-4xl uppercase tracking-[0.2em] shadow-2xl flex items-center gap-6 border border-white/20 active:translate-y-2 transition-all group"
          >
            <Play className="w-12 h-12 fill-white group-hover:scale-110 transition-transform" />
            <span className="italic">ENTRAR NA ONDA</span>
          </motion.button>
        ) : (
          <div className="w-full space-y-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {beats.map((beat, i) => (
                <motion.div 
                  key={beat.id}
                  animate={{ 
                    scale: currentBeat === i ? 1.05 : 1,
                    y: currentBeat === i ? -10 : 0
                  }}
                  className={`aspect-square rounded-[40px] flex flex-col items-center justify-center gap-6 border-2 transition-all relative group overflow-hidden ${
                    currentBeat === i 
                      ? 'border-white bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.2)]' 
                      : 'border-white/5 bg-white/2 hover:border-white/10'
                  }`}
                >
                  <div className={`transition-all duration-300 ${currentBeat === i ? 'scale-125 text-white' : 'text-white/40 opacity-40 group-hover:opacity-60'}`} style={{ color: currentBeat === i ? ACTION_COLORS[beat.type] : undefined }}>
                    {ACTION_ICONS[beat.type]}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-2xl font-black uppercase italic tracking-tighter transition-all ${currentBeat === i ? 'text-white' : 'text-redhouse-muted'}`}>
                      {ACTION_LABELS[beat.type]}
                    </span>
                    <div className={`mt-3 w-12 h-1 rounded-full transition-all ${currentBeat === i ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ backgroundColor: ACTION_COLORS[beat.type], boxShadow: `0 0 10px ${ACTION_COLORS[beat.type]}` }} />
                  </div>
                  
                  {/* Subtle index badge */}
                  <div className="absolute top-6 left-6 text-[10px] font-black text-white/10 italic">#0{i + 1}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <button 
                onClick={stopChallenge}
                className="group bg-pedagogy-red text-white px-10 py-5 rounded-[20px] font-black uppercase flex items-center gap-3 shadow-[0_0_20px_rgba(255,31,31,0.2)] hover:shadow-[0_0_30px_rgba(255,31,31,0.4)] transition-all active:scale-95"
              >
                <Square className="w-6 h-6 fill-white group-hover:scale-90 transition-transform" />
                Sincronizar Off
              </button>

              <div className="glass-card px-10 py-6 border-white/5 flex items-center gap-8 bg-white/2">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.2em] mb-3 italic">Monitor de Pulso</span>
                   <div className="flex gap-3">
                    {[0, 1, 2, 3].map(i => (
                      <div 
                        key={i}
                        className={`w-5 h-5 rounded-full transition-all duration-300 border border-white/10 ${
                          currentBeat % 4 === i 
                            ? 'bg-pedagogy-orange scale-125 shadow-[0_0_15px_var(--color-pedagogy-orange)]' 
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center">
                   <span className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.2em] mb-1 italic">Nível</span>
                   <span className="text-2xl font-black text-pedagogy-blue italic uppercase tracking-widest">Alfa</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bento Footer Features */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, label: 'Foco Total', desc: 'Coordenação Motora', color: 'bg-pedagogy-blue' },
          { icon: Volume2, label: 'Audição Ativa', desc: 'Percepção Rítmica', color: 'bg-pedagogy-purple' },
          { icon: Hand, label: 'Sincronia', desc: 'Sincronia Coletiva', color: 'bg-pedagogy-green' }
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
        <div className="md:col-span-3 mt-8 glass-card p-10 border-white/5 flex items-start gap-8 bg-pedagogy-orange/5 relative overflow-hidden ring-1 ring-pedagogy-orange/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pedagogy-orange/5 blur-[100px] -z-10" />
          <div className="w-20 h-20 glass-card border-white/10 flex items-center justify-center text-4xl shadow-2xl shrink-0 rotate-3">🥁</div>
          <div>
            <h4 className="font-black text-redhouse-text text-xl mb-4 italic uppercase tracking-tight">Manual do Maestro: Ritmo</h4>
            <p className="text-redhouse-muted font-bold leading-relaxed max-w-2xl italic">
              "O ritmo é o pulso vital da música RedHouse. Este console sincroniza seus movimentos motores com a grade temporal universal. Quando o pulso neon piscar, execute a ação correspondente com precisão cirúrgica."
            </p>
          </div>
        </div>
      </footer>
    </div>
</section>
  );
}
