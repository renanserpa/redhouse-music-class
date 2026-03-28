import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Trash2, Save, Music, Volume2, Plus, Minus, Zap, Brain, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { audio } from '../lib/audio';
import { haptics } from '../lib/haptics';
import { generateChallenge, getTutorAdvice } from '../services/aiService';

type BeatType = 'kick' | 'snare' | 'hihat' | 'null';

interface Step {
  id: number;
  type: BeatType;
}

interface RhythmSequencerProps {
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  setNpcMessage?: (msg: string) => void;
  setNpcContext?: (ctx: any) => void;
  setNpcState?: (state: any) => void;
}

export default function RhythmSequencer({ 
  addXP, 
  addCoins,
  setNpcMessage,
  setNpcContext,
  setNpcState
}: RhythmSequencerProps) {
  const [steps, setSteps] = useState<Step[]>(Array.from({ length: 16 }, (_, i) => ({ id: i, type: 'null' })));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(120);
  const [activeInstrument, setActiveInstrument] = useState<BeatType>('kick');
  
  // AI Challenge State
  const [challenge, setChallenge] = useState<Step[] | null>(null);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tutorAdvice, setTutorAdvice] = useState<string | null>(null);

  const toggleStep = (index: number) => {
    haptics.light();
    setSteps(prev => {
      const newSteps = [...prev];
      if (newSteps[index].type === activeInstrument) {
        newSteps[index].type = 'null';
      } else {
        newSteps[index].type = activeInstrument;
        playBeat(activeInstrument);
      }
      return newSteps;
    });
  };

  const playBeat = (type: BeatType) => {
    if (type === 'kick') audio.playKick();
    else if (type === 'snare') audio.playSnare();
    else if (type === 'hihat') audio.playClick("G5", "32n");
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const stepDuration = (60 / bpm) / 4 * 1000; // 16th notes
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % steps.length;
          const step = steps[next];
          if (step.type !== 'null') {
            playBeat(step.type);
          }
          return next;
        });
      }, stepDuration);
    } else {
      setCurrentStep(-1);
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm, steps]);

  const clearSequencer = () => {
    haptics.medium();
    setSteps(steps.map(s => ({ ...s, type: 'null' })));
    setIsPlaying(false);
    setFeedback(null);
    setTutorAdvice(null);
  };

  const startAIChallenge = async () => {
    setIsLoadingChallenge(true);
    setIsChallengeMode(true);
    setFeedback("O AI está compondo um beat para você...");
    setTutorAdvice(null);
    
    try {
      const aiResponse = await generateChallenge('iniciante', 'rhythm', 'percussao');
      const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
      
      // Map AI pattern to steps
      const challengeSteps = Array.from({ length: 16 }, (_, i) => ({ 
        id: i, 
        type: (parsed.pattern?.[i] as BeatType) || 'null' 
      }));
      
      setChallenge(challengeSteps);
      setFeedback("Ouça o beat do AI e tente reproduzir!");
      
      // Play challenge once
      setIsPlaying(true);
      setSteps(challengeSteps); // Show it briefly
      setTimeout(() => {
        setSteps(Array.from({ length: 16 }, (_, i) => ({ id: i, type: 'null' })));
        setIsPlaying(false);
        setFeedback("Sua vez! Reconstrua o beat.");
      }, 4000);
      
    } catch (error) {
      console.error("AI Challenge Error:", error);
      setFeedback("Erro ao carregar desafio. Tente novamente.");
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  const checkChallenge = async () => {
    if (!challenge) return;
    
    const isCorrect = steps.every((step, i) => step.type === challenge[i].type);
    
    if (isCorrect) {
      haptics.heavy();
      audio.playSuccess();
      setFeedback("PERFEITO! Você é um mestre do ritmo! +50 XP");
      addXP(50);
      addCoins(20);
      setIsChallengeMode(false);
      setChallenge(null);
    } else {
      haptics.medium();
      audio.playError();
      setFeedback("Quase lá! Alguns passos estão diferentes.");
      
      try {
        const advice = await getTutorAdvice("O aluno errou a reconstrução de um beat no sequenciador.", "rhythm");
        setTutorAdvice(advice);
      } catch (e) {
        setTutorAdvice("Dica: Foque primeiro no bumbo (kick) nos tempos 1 e 3, depois adicione a caixa (snare).");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-pedagogy-purple/10 rounded-2xl flex items-center justify-center text-pedagogy-purple border border-pedagogy-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-redhouse-text uppercase italic tracking-tighter">Estúdio de Beats</h2>
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3 text-redhouse-muted" />
              <span className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em] italic">AI-Enhanced Sequencer</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
              isPlaying ? 'bg-pedagogy-red text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-pedagogy-green text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            }`}
          >
            {isPlaying ? <Square className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
          </button>

          <div className="px-4 flex flex-col items-center">
            <span className="text-[8px] font-black text-redhouse-muted uppercase tracking-widest mb-1 italic">Tempo (BPM)</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setBpm(Math.max(40, bpm - 5))} className="p-1 hover:bg-white/10 rounded-lg text-redhouse-muted"><Minus className="w-4 h-4" /></button>
              <span className="text-xl font-black text-redhouse-text w-12 text-center">{bpm}</span>
              <button onClick={() => setBpm(Math.min(240, bpm + 5))} className="p-1 hover:bg-white/10 rounded-lg text-redhouse-muted"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <button 
            onClick={clearSequencer}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-redhouse-muted transition-all"
            title="Limpar Tudo"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Instrument Selector */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.4em] italic px-2">Instrumentos</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'kick', label: 'Bumbo', icon: '🥁', color: 'bg-pedagogy-red' },
                { id: 'snare', label: 'Caixa', icon: '🥁', color: 'bg-pedagogy-blue' },
                { id: 'hihat', label: 'Prato', icon: '📀', color: 'bg-pedagogy-yellow' },
              ].map(inst => (
                <button
                  key={inst.id}
                  onClick={() => setActiveInstrument(inst.id as BeatType)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${
                    activeInstrument === inst.id 
                      ? `${inst.color} border-transparent text-white shadow-lg` 
                      : 'bg-white/5 border-white/5 text-redhouse-muted hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{inst.icon}</span>
                  <span className="font-black uppercase italic tracking-widest">{inst.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              onClick={startAIChallenge}
              disabled={isLoadingChallenge}
              className="w-full glass-card p-6 bg-pedagogy-blue/10 border-pedagogy-blue/20 text-pedagogy-blue hover:bg-pedagogy-blue/20 transition-all flex flex-col items-center gap-3 group"
            >
              {isLoadingChallenge ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform" />
              )}
              <span className="font-black uppercase italic text-xs tracking-widest">Desafio AI</span>
            </button>
          </div>
        </div>

        {/* Sequencer Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-8 border-white/5 bg-white/2">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {steps.map((step, i) => {
                const isActive = currentStep === i;
                const isOccupied = step.type !== 'null';
                const isQuarter = i % 4 === 0;

                return (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(i)}
                    className={`
                      aspect-square rounded-2xl border-2 transition-all relative group
                      flex flex-col items-center justify-center gap-1
                      ${isActive ? 'scale-110 z-10' : ''}
                      ${isOccupied 
                        ? step.type === 'kick' ? 'bg-pedagogy-red/20 border-pedagogy-red text-pedagogy-red' :
                          step.type === 'snare' ? 'bg-pedagogy-blue/20 border-pedagogy-blue text-pedagogy-blue' :
                          'bg-pedagogy-yellow/20 border-pedagogy-yellow text-pedagogy-yellow'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                      }
                      ${isQuarter && !isOccupied ? 'border-white/20' : ''}
                    `}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="sequencer-active"
                        className="absolute inset-0 bg-white/10 rounded-2xl ring-2 ring-white/50"
                      />
                    )}
                    
                    <span className="text-[8px] font-black opacity-30 absolute top-2 left-2">{i + 1}</span>
                    
                    {isOccupied && (
                      <span className="text-xl">
                        {step.type === 'kick' ? '🥁' : step.type === 'snare' ? '🥁' : '📀'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-black text-redhouse-muted uppercase tracking-widest italic">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pedagogy-red rounded-full" /> Bumbo
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pedagogy-blue rounded-full" /> Caixa
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pedagogy-yellow rounded-full" /> Prato
                </div>
              </div>
              <p>16 Steps / 4/4 Time</p>
            </div>
          </div>

          <AnimatePresence>
            {(feedback || tutorAdvice) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {feedback && (
                  <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 ${
                    feedback.includes("PERFEITO") ? 'bg-pedagogy-green/10 border-pedagogy-green/30 text-pedagogy-green' : 'bg-white/5 border-white/10 text-redhouse-text'
                  }`}>
                    {feedback.includes("PERFEITO") ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6 text-pedagogy-blue" />}
                    <p className="text-sm font-black uppercase italic tracking-tight">{feedback}</p>
                    {isChallengeMode && !feedback.includes("PERFEITO") && (
                      <button 
                        onClick={checkChallenge}
                        className="ml-auto bg-pedagogy-blue text-white px-6 py-2 rounded-xl font-black uppercase italic text-[10px] shadow-lg shadow-pedagogy-blue/30"
                      >
                        Verificar Beat
                      </button>
                    )}
                  </div>
                )}
                
                {tutorAdvice && (
                  <div className="glass-card p-6 bg-pedagogy-purple/5 border-pedagogy-purple/20 flex gap-4">
                    <div className="w-10 h-10 bg-pedagogy-purple/20 rounded-full flex items-center justify-center text-pedagogy-purple shrink-0">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-pedagogy-purple uppercase tracking-widest mb-1">Dica do Tutor AI</p>
                      <p className="text-sm font-bold text-redhouse-text leading-relaxed italic">"{tutorAdvice}"</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save / Export */}
      <div className="flex justify-end gap-4">
        <button className="glass-card px-8 py-4 border-white/5 bg-white/2 text-redhouse-muted hover:text-white flex items-center gap-3 transition-all">
          <Save className="w-5 h-5" />
          <span className="font-black uppercase italic text-xs">Salvar Beat</span>
        </button>
        <button className="bg-pedagogy-primary text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs shadow-lg hover:shadow-pedagogy-primary/30 transition-all active:scale-95">
          Exportar MIDI
        </button>
      </div>
    </div>
  );
}
