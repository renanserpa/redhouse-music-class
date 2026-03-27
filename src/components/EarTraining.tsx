import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../lib/audio';
import { haptics } from '../lib/haptics';
import { generateChallenge, getTutorAdvice } from '../services/aiService';
import { Ear, Play, CheckCircle2, XCircle, Volume2, Sparkles, Brain, Loader2, Music } from 'lucide-react';
import { StaffDisplay } from './StaffDisplay';

interface EarTrainingProps {
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  setNpcMessage?: (msg: string) => void;
  setNpcContext?: (ctx: any) => void;
  setNpcState?: (state: any) => void;
}

type ChallengeType = 'pitch' | 'interval' | 'chord';

interface AIChallenge {
  type: ChallengeType;
  notes: string[];
  correctAnswer: string;
  options: string[];
  description: string;
}

export default function EarTraining({ 
  addXP, 
  addCoins,
  setNpcMessage,
  setNpcContext,
  setNpcState
}: EarTrainingProps) {
  const [currentChallenge, setCurrentChallenge] = useState<AIChallenge | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'loading'>('idle');
  const [feedback, setFeedback] = useState("Pronto para treinar seu ouvido musical?");
  const [tutorAdvice, setTutorAdvice] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const loadAIChallenge = async () => {
    setStatus('loading');
    setTutorAdvice(null);
    try {
      const challenge = await generateChallenge('iniciante', 'melody', 'piano');
      // The AI returns a JSON string, we need to parse it if it's not already an object
      const parsed = typeof challenge === 'string' ? JSON.parse(challenge) : challenge;
      
      // Map AI response to our local challenge format if needed
      // For now, let's assume the AI returns something we can use or fallback to pitch
      const newChallenge: AIChallenge = {
        type: parsed.type || 'pitch',
        notes: parsed.notes || (Math.random() > 0.5 ? ['C4'] : ['C5']),
        correctAnswer: parsed.correctAnswer || (parsed.notes?.[0] === 'C4' ? 'grave' : 'agudo'),
        options: parsed.options || ['grave', 'agudo'],
        description: parsed.description || "Identifique se o som é Grave (Elefante) ou Agudo (Passarinho)"
      };
      
      setCurrentChallenge(newChallenge);
      setFeedback(newChallenge.description);
      setStatus('idle');
    } catch (error) {
      console.error("AI Challenge Error:", error);
      // Fallback to simple pitch challenge
      const isGrave = Math.random() > 0.5;
      setCurrentChallenge({
        type: 'pitch',
        notes: [isGrave ? 'C4' : 'C5'],
        correctAnswer: isGrave ? 'grave' : 'agudo',
        options: ['grave', 'agudo'],
        description: "Identifique se o som é Grave (Elefante) ou Agudo (Passarinho)"
      });
      setStatus('idle');
    }
  };

  useEffect(() => {
    loadAIChallenge();
  }, []);

  const playChallengeSound = () => {
    if (!currentChallenge || isPlaying) return;
    
    setIsPlaying(true);
    haptics.light();
    
    // Play notes in sequence
    currentChallenge.notes.forEach((note, index) => {
      setTimeout(() => {
        audio.playTone(note, '4n');
        if (index === currentChallenge.notes.length - 1) {
          setTimeout(() => setIsPlaying(false), 1000);
        }
      }, index * 600);
    });
  };

  const handleChoice = async (choice: string) => {
    if (!currentChallenge || status === 'loading') return;

    if (choice === currentChallenge.correctAnswer) {
      const xpGain = 15 + (streak * 5);
      const coinGain = 5;
      
      setFeedback(`EXCELENTE! +${xpGain} XP`);
      setStatus('correct');
      setStreak(prev => prev + 1);
      audio.playSuccess();
      haptics.medium();
      addXP(xpGain);
      addCoins(coinGain);
      
      setTimeout(() => {
        loadAIChallenge();
      }, 2000);
    } else {
      setFeedback("Não foi dessa vez. Ouça com atenção...");
      setStatus('wrong');
      setStreak(0);
      audio.playError();
      haptics.heavy();
      
      // Get AI advice
      try {
        const advice = await getTutorAdvice(
          `O aluno errou um desafio de ${currentChallenge.type}. Ele escolheu "${choice}" mas o correto era "${currentChallenge.correctAnswer}".`,
          'ear-training'
        );
        setTutorAdvice(advice);
      } catch (e) {
        setTutorAdvice("Tente fechar os olhos e imaginar o tamanho do animal: elefantes são grandes e pesados (grave), passarinhos são pequenos e leves (agudo).");
      }
      
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="glass-card p-10 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-pedagogy-blue/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-pedagogy-blue/10 rounded-2xl flex items-center justify-center text-pedagogy-blue border border-pedagogy-blue/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <Ear className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-redhouse-text">Detetive de Ouvido</h3>
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-redhouse-muted" />
                <span className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.2em]">AI-Powered Training</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest mb-1">Streak</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-6 rounded-full transition-all duration-500 ${
                    i < streak ? 'bg-pedagogy-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="glass-card p-8 bg-white/5 border-white/5 relative group">
              <div className="absolute inset-0 bg-pedagogy-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <AnimatePresence mode="wait">
                  {status === 'loading' ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-10"
                    >
                      <Loader2 className="w-12 h-12 text-pedagogy-blue animate-spin" />
                      <p className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest animate-pulse">Gerando Desafio AI...</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full space-y-8"
                    >
                      <div className="flex justify-center">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={playChallengeSound}
                          disabled={isPlaying}
                          className={`w-32 h-32 rounded-full flex items-center justify-center text-white transition-all shadow-2xl relative ${
                            isPlaying ? 'bg-pedagogy-blue' : 'bg-redhouse-primary'
                          }`}
                        >
                          {isPlaying ? (
                            <Volume2 className="w-12 h-12 animate-pulse" />
                          ) : (
                            <Play className="w-12 h-12 fill-current ml-2" />
                          )}
                          
                          {isPlaying && (
                            <motion.div 
                              initial={{ scale: 1, opacity: 0.5 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="absolute inset-0 bg-pedagogy-blue rounded-full"
                            />
                          )}
                        </motion.button>
                      </div>

                      <div className="h-32 w-full bg-black/20 rounded-2xl border border-white/5 p-4 flex items-center justify-center">
                        {currentChallenge && (
                          <StaffDisplay 
                            notes={status === 'correct' ? currentChallenge.notes : []} 
                            activeNoteIndex={0}
                            className="w-full h-full opacity-50"
                          />
                        )}
                        {status !== 'correct' && (
                          <div className="absolute flex flex-col items-center gap-2">
                            <Music className="w-8 h-8 text-white/10" />
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Aguardando Resposta</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
              status === 'correct' ? 'bg-pedagogy-green/10 border-pedagogy-green/30 text-pedagogy-green' :
              status === 'wrong' ? 'bg-pedagogy-red/10 border-pedagogy-red/30 text-pedagogy-red' :
              'bg-white/5 border-white/10 text-redhouse-muted'
            }`}>
              <div className="flex items-center gap-3">
                {status === 'correct' ? <CheckCircle2 className="w-5 h-5" /> : 
                 status === 'wrong' ? <XCircle className="w-5 h-5" /> : 
                 <Sparkles className="w-5 h-5" />}
                <p className="text-sm font-black uppercase italic tracking-tight">{feedback}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {currentChallenge?.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(option)}
                  disabled={status === 'loading' || isPlaying}
                  className={`glass-card p-6 flex items-center justify-between group border-white/5 hover:border-pedagogy-blue/30 transition-all ${
                    status === 'correct' && option === currentChallenge.correctAnswer ? 'border-pedagogy-green/50 bg-pedagogy-green/10' :
                    status === 'wrong' && option !== currentChallenge.correctAnswer ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {option === 'grave' ? '🐘' : option === 'agudo' ? '🐦' : '🎵'}
                    </div>
                    <span className="text-xl font-black uppercase italic tracking-tighter text-redhouse-text">{option}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-pedagogy-blue/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-pedagogy-blue transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {tutorAdvice && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 bg-pedagogy-purple/5 border-pedagogy-purple/20"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-pedagogy-purple/20 rounded-full flex items-center justify-center text-pedagogy-purple shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-pedagogy-purple uppercase tracking-widest mb-1">Dica do Tutor AI</p>
                      <p className="text-sm font-bold text-redhouse-text leading-relaxed italic">"{tutorAdvice}"</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
