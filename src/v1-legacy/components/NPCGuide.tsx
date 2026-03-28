import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Sparkles, MessageCircle, Lightbulb } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { audio } from '../lib/audio';
import { getRandomDialogue } from '../lib/npcDialogues';
import { Instrument } from '../types';

export type NPCState = 'idle' | 'celebrating' | 'encouraging';

interface NPCGuideProps {
  message?: string;
  context?: 'lessonStart' | 'correct' | 'wrong' | 'worldComplete' | 'unlock';
  instrument?: Instrument;
  state?: NPCState;
  onClose?: () => void;
  autoHide?: boolean;
}

export default function NPCGuide({ 
  message: initialMessage, 
  context = 'lessonStart', 
  instrument = 'guitar',
  state = 'idle',
  onClose,
  autoHide = false
}: NPCGuideProps) {
  const [message, setMessage] = useState<string>(initialMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    } else {
      generateMessage();
    }
  }, [context, initialMessage, instrument]);

  useEffect(() => {
    if (state === 'celebrating') {
      audio.playSuccess();
    } else if (state === 'encouraging') {
      audio.playError();
    }
  }, [state]);

  const generateMessage = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `Você é o Mestre Corda, um tutor musical mágico para crianças de 6 a 12 anos. 
      O contexto atual é: "${context}". O instrumento é: "${instrument}".
      Gere uma frase curta (máx 15 palavras), lúdica, encorajadora e cheia de personalidade.
      Use emojis musicais. Se for erro, dê uma dica técnica simples (ex: "dedos em pé", "respire fundo").`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response.text) {
        setMessage(response.text);
      } else {
        throw new Error("Empty AI response");
      }
    } catch (error) {
      // Fallback to local dialogues
      setMessage(getRandomDialogue(context, instrument));
    } finally {
      setIsLoading(false);
    }
  };

  const avatarVariants = {
    idle: {
      scale: [1, 1.05, 1],
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    celebrating: {
      y: [0, -40, 0],
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        repeat: 3,
        ease: "easeOut"
      }
    },
    encouraging: {
      x: [0, -10, 10, -10, 10, 0],
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none npc-container">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="pointer-events-auto relative"
        >
          {/* Speech Bubble */}
          <motion.div 
            className={`
              bg-white dark:bg-slate-900 border-4 p-6 rounded-[3rem] rounded-br-none shadow-[0_20px_60px_rgba(0,0,0,0.3)] 
              relative mb-6 max-w-[280px] md:max-w-[350px]
              ${state === 'celebrating' ? 'border-pedagogy-green' : state === 'encouraging' ? 'border-pedagogy-yellow' : 'border-redhouse-primary'}
            `}
          >
            {/* Context Icon */}
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full border-4 border-inherit flex items-center justify-center shadow-lg">
              {state === 'celebrating' ? <Sparkles className="w-5 h-5 text-pedagogy-green" /> : 
               state === 'encouraging' ? <Lightbulb className="w-5 h-5 text-pedagogy-yellow" /> : 
               <MessageCircle className="w-5 h-5 text-redhouse-primary" />}
            </div>

            <button 
              onClick={() => { setIsVisible(false); onClose?.(); }}
              className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900 hover:bg-redhouse-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isLoading ? (
              <div className="flex gap-2 p-2">
                <div className="w-2 h-2 bg-redhouse-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-redhouse-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-redhouse-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : (
              <p className="text-sm md:text-base font-black text-slate-900 dark:text-white italic leading-tight">
                "{message}"
              </p>
            )}
          </motion.div>

          {/* Avatar Area */}
          <div className="flex items-center gap-4 justify-end">
            <div className="text-right">
              <div className="bg-slate-900 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-white/10 shadow-xl inline-block">
                <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Mestre Corda</span>
              </div>
              <p className="text-[8px] font-bold text-slate-500 uppercase italic mt-1">Tutor Musical Mágico</p>
            </div>

            <motion.div
              variants={avatarVariants}
              animate={state}
              className="relative cursor-pointer group"
              onClick={generateMessage}
            >
              <div className={`absolute inset-0 blur-2xl opacity-30 animate-pulse rounded-full ${
                state === 'celebrating' ? 'bg-pedagogy-green' : state === 'encouraging' ? 'bg-pedagogy-yellow' : 'bg-redhouse-primary'
              }`} />
              
              <div className={`
                w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl border-4 relative z-10 overflow-hidden
                ${state === 'celebrating' ? 'border-pedagogy-green rotate-6' : state === 'encouraging' ? 'border-pedagogy-yellow -rotate-6' : 'border-white dark:border-slate-950 rotate-[-8deg]'}
                bg-redhouse-primary transition-colors
              `}>
                <img 
                  src="https://ais-dev-f3txglamylxz3w6npclvqd-18924653729.us-west2.run.app/lucca_npc.png" 
                  alt="Mestre Corda"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as any).parentElement.innerHTML = '🎸';
                  }}
                />
              </div>

              {/* Particles for celebration */}
              {state === 'celebrating' && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ scale: [0, 1, 0], x: (i - 2.5) * 30, y: -60 - Math.random() * 40 }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
