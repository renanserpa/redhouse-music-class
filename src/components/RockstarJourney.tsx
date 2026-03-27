import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Lock, 
  CheckCircle2, 
  Guitar, 
  Music, 
  Trophy, 
  Coins, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Play,
  Gamepad2,
  BookOpen,
  Monitor,
  Mic2,
  Library
} from 'lucide-react';
import { AppState, Tab, Instrument } from '../types';
import { audio } from '../lib/audio';
import { SKINS } from '../constants/skins';
import LessonPage from './LessonPage';
import NPCGuide, { NPCState } from './NPCGuide';

// Import Lesson Components
import AnatomyGame from './AnatomyGame';
import EarTraining from './EarTraining';
import FretboardFollower from './FretboardFollower';
import Metronome from './Metronome';
import RhythmChallenge from './RhythmChallenge';
import RhythmInvaders from './RhythmInvaders';
import KonnakkolBuilder from './KonnakkolBuilder';
import TablatureModule from './TablatureModule';
import ChordLab from './ChordLab';
import TunerModule from './TunerModule';

// New Games
import { ElefantePassarinho } from './games/ElefantePassarinho';
import { FabricaDeAcordes } from './games/FabricaDeAcordes';
import { GrandeRelogio } from './games/GrandeRelogio';
import ElephantBirdGame from './games/ElephantBirdGame';
import StringMazeGame from './games/StringMazeGame';
import GrooveClockGame from './games/GrooveClockGame';
import RhythmDominoGame from './games/RhythmDominoGame';
import ChordFactoryGame from './games/ChordFactoryGame';

// Quizzes
import QuizPartes from './quizzes/QuizPartes';
import QuizNotas from './quizzes/QuizNotas';
import QuizGraveAgudo from './quizzes/QuizGraveAgudo';
import QuizPostura from './quizzes/QuizPostura';
import { QuizCifras } from './quizzes/QuizCifras';
import QuizRitmoAvancado from './quizzes/QuizRitmoAvancado';
import { QuizElefantePassarinho } from './quizzes/QuizElefantePassarinho';
import { QuizCordas } from './quizzes/QuizCordas';
import { QuizAnatomia } from './quizzes/QuizAnatomia';
import { QuizBatidasRitmo } from './quizzes/QuizBatidasRitmo';

interface Lesson {
  id: string;
  title: string;
  description: string;
  world: number;
  component: Tab;
  icon: any;
  type: 'lesson' | 'challenge';
  instruments?: Instrument[];
}

const JOURNEY_DATA: Lesson[] = [
  // MUNDO 1 – Vale das Cordas
  { id: '1.1', title: 'Conhecendo o Violão', description: 'Anatomia e partes do instrumento.', world: 1, component: 'anatomy', icon: Guitar, type: 'lesson', instruments: ['guitar'] },
  { id: '1.1u', title: 'Conhecendo o Ukulele', description: 'Anatomia e partes do instrumento.', world: 1, component: 'anatomy', icon: Guitar, type: 'lesson', instruments: ['ukulele'] },
  { id: '1.2', title: 'Postura e Posicionamento', description: 'Como segurar o instrumento corretamente.', world: 1, component: 'quiz-postura', icon: BookOpen, type: 'lesson' },
  { id: '1.3', title: 'O Labirinto das Cordas', description: 'Nomes e ordens das cordas.', world: 1, component: 'string-maze', icon: Music, type: 'lesson' },
  { id: '1.3q', title: 'Quiz das Cordas', description: 'Você conhece as cordas?', world: 1, component: 'quiz-cordas', icon: Trophy, type: 'challenge' },
  { id: '1.4', title: 'Detetive Sonoro', description: 'Diferenciando elefantes de passarinhos.', world: 1, component: 'elefante-passarinho', icon: Gamepad2, type: 'lesson' },
  { id: '1.4q', title: 'Quiz: Elefante ou Passarinho?', description: 'Treine seu ouvido!', world: 1, component: 'quiz-elefante-passarinho', icon: Trophy, type: 'challenge' },
  { id: '1.5', title: 'DESAFIO: Quiz de Anatomia', description: 'Prove que conhece seu instrumento!', world: 1, component: 'quiz-anatomia', icon: Trophy, type: 'challenge' },

  // MUNDO 2 – Reino das Notas
  { id: '2.1', title: 'As 7 Notas Musicais', description: 'Dó, Ré, Mi, Fá, Sol, Lá, Si.', world: 2, component: 'quiz-notas', icon: Music, type: 'lesson' },
  { id: '2.2', title: 'Cifras Internacionais', description: 'Aprenda a ler as letras (A, B, C...).', world: 2, component: 'quiz-cifras', icon: Library, type: 'lesson' },
  { id: '2.3', title: 'Como Afinar o Instrumento', description: 'Afinando de ouvido com o mestre.', world: 2, component: 'tuner', icon: Zap, type: 'lesson' },
  { id: '2.4', title: 'DESAFIO: Notas ↔ Cifras', description: 'Traduza as notas rapidamente!', world: 2, component: 'quiz-cifras', icon: Trophy, type: 'challenge' },

  // MUNDO 3 – Montanha do Ritmo
  { id: '3.1', title: 'O Grande Relógio', description: 'Sinta a pulsação no seu corpo.', world: 3, component: 'grande-relogio', icon: Zap, type: 'lesson' },
  { id: '3.2', title: 'Dominó Rítmico', description: 'Associe figuras e valores.', world: 3, component: 'rhythm-domino', icon: Gamepad2, type: 'lesson' },
  { id: '3.3', title: 'Sílabas do Ritmo (Tá e Ti-ti)', description: 'Contando e vocalizando o tempo.', world: 3, component: 'quiz-ritmo-avancado', icon: Gamepad2, type: 'lesson' },
  { id: '3.4', title: 'Batida Pop/Rock', description: 'Ritmo para tocar suas músicas favoritas.', world: 3, component: 'rhythm-invaders', icon: Zap, type: 'lesson' },
  { id: '3.5', title: 'DESAFIO: Quiz de Batidas', description: 'Mantenha o tempo sem errar!', world: 3, component: 'quiz-batidas-ritmo', icon: Trophy, type: 'challenge' },
  { id: '3.6', title: 'Prática no Metrônomo', description: 'Use o metrônomo para treinar.', world: 3, component: 'metronome', icon: Zap, type: 'lesson' },

  // MUNDO 4 – Floresta dos Acordes
  { id: '4.1', title: 'Como ler Tablatura', description: 'Lendo os números nas linhas.', world: 4, component: 'tablature', icon: Monitor, type: 'lesson' },
  { id: '4.2', title: 'Fábrica de Acordes', description: 'Monte os acordes no braço.', world: 4, component: 'fabrica-de-acordes', icon: Gamepad2, type: 'lesson' },
  { id: '4.3', title: 'Como ler Diagrama', description: 'Entendendo os desenhos de acordes.', world: 4, component: 'chord-lab', icon: Star, type: 'lesson' },
  { id: '4.4', title: 'Primeiros Acordes', description: 'Em, Am, C e G.', world: 4, component: 'chord-lab', icon: Music, type: 'lesson' },
  { id: '4.5', title: 'DESAFIO: Montar Acorde', description: 'Monte o acorde solicitado!', world: 4, component: 'chord-lab', icon: Trophy, type: 'challenge' },

  // MUNDO 5 – Palco das Músicas
  { id: '5.1', title: 'We Will Rock You', description: 'Clássico do Queen.', world: 5, component: 'tablature', icon: Music, type: 'lesson' },
  { id: '5.2', title: 'Parabéns pra Você', description: 'A música mais famosa.', world: 5, component: 'tablature', icon: Music, type: 'lesson' },
  { id: '5.3', title: 'Believer (Imagine Dragons)', description: 'Ritmo e acordes.', world: 5, component: 'tablature', icon: Music, type: 'lesson', instruments: ['guitar'] },
  { id: '5.4', title: 'DESAFIO: Show Completo', description: 'Toque uma música do início ao fim!', world: 5, component: 'tablature', icon: Trophy, type: 'challenge' },
];

const WORLDS = [
  { id: 1, name: 'Vale das Cordas', color: 'bg-emerald-500', icon: '🌿' },
  { id: 2, name: 'Reino das Notas', color: 'bg-blue-500', icon: '🏔️' },
  { id: 3, name: 'Montanha do Ritmo', color: 'bg-purple-500', icon: '⛰️' },
  { id: 4, name: 'Floresta dos Acordes', color: 'bg-orange-500', icon: '🌲' },
  { id: 5, name: 'Palco das Músicas', color: 'bg-redhouse-primary', icon: '🎸' },
];

interface RockstarJourneyProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  setActiveTab: (tab: Tab) => void;
}

export default function RockstarJourney({ state, setState, addXP, addCoins, setActiveTab }: RockstarJourneyProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedWorld, setSelectedWorld] = useState(1);
  const [npcState, setNpcState] = useState<NPCState>('idle');
  const [npcContext, setNpcContext] = useState<'lessonStart' | 'correct' | 'wrong' | 'worldComplete' | 'unlock'>('lessonStart');

  const currentInstrument = state.instrument || 'guitar';

  const currentSkins = {
    head: SKINS.find(s => s.id === state.avatar.head),
    body: SKINS.find(s => s.id === state.avatar.body),
    instrument: SKINS.find(s => s.id === state.avatar.instrument),
    background: SKINS.find(s => s.id === state.avatar.background),
  };

  // Reset NPC state to idle after 3 seconds
  useEffect(() => {
    if (npcState !== 'idle') {
      const timer = setTimeout(() => {
        setNpcState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [npcState]);

  const filteredJourney = JOURNEY_DATA.filter(lesson => {
    if (!lesson.instruments) return true;
    return lesson.instruments.includes(currentInstrument);
  });

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('rh_journey_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedLessons(parsed.completedLessons || []);
      } catch (e) {
        console.error("Erro ao carregar progresso:", e);
      }
    }
  }, []);

  // Save progress
  const saveProgress = (newCompleted: string[]) => {
    localStorage.setItem('rh_journey_progress', JSON.stringify({ completedLessons: newCompleted }));
    setCompletedLessons(newCompleted);
  };

  const handleCompleteLesson = () => {
    if (!activeLesson) return;
    
    addXP(50);
    addCoins(10);
    
    const newCompleted = [...new Set([...completedLessons, activeLesson.id])];
    saveProgress(newCompleted);

    // Check if world is complete
    const worldLessons = filteredJourney.filter(l => l.world === activeLesson.world);
    const completedInWorld = newCompleted.filter(id => worldLessons.some(l => l.id === id)).length;
    
    if (completedInWorld === worldLessons.length) {
      setNpcState('celebrating');
      setNpcContext('worldComplete');
      audio.playLevelUp();
    } else {
      setNpcState('celebrating');
      setNpcContext('correct');
    }

    setTimeout(() => {
      setActiveLesson(null);
      setNpcState('idle');
    }, 3000);
  };

  const isLessonLocked = (lessonId: string) => {
    const index = filteredJourney.findIndex(l => l.id === lessonId);
    if (index === 0) return false;
    const previousLesson = filteredJourney[index - 1];
    return !completedLessons.includes(previousLesson.id);
  };

  const getLessonStatus = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return 'completed';
    if (isLessonLocked(lessonId)) return 'locked';
    return 'available';
  };

  const renderLessonComponent = (tab: Tab) => {
    switch (tab) {
      case 'anatomy': return <AnatomyGame addXP={addXP} addCoins={addCoins} />;
      case 'ear-training': return <EarTraining addXP={addXP} addCoins={addCoins} />;
      case 'fretboard-follower': return <FretboardFollower addXP={addXP} />;
      case 'metronome': return <Metronome />;
      case 'rhythm-challenge': return <RhythmChallenge addXP={addXP} addCoins={addCoins} />;
      case 'rhythm-invaders': return <RhythmInvaders addXP={addXP} addCoins={addCoins} />;
      case 'konnakkol': return <KonnakkolBuilder addXP={addXP} />;
      case 'tablature': return <TablatureModule />;
      case 'chord-lab': return <ChordLab addXP={addXP} addCoins={addCoins} />;
      case 'tuner': return <TunerModule />;
      case 'quiz-partes': return <QuizPartes addXP={addXP} onComplete={() => {}} />;
      case 'quiz-postura': return <QuizPostura addXP={addXP} onComplete={() => {}} />;
      case 'quiz-notas': return <QuizNotas addXP={addXP} onComplete={() => {}} />;
      case 'quiz-grave-agudo': return <QuizGraveAgudo addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'elefante-passarinho': return <ElefantePassarinho addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'quiz-elefante-passarinho': return <QuizElefantePassarinho addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'quiz-cifras': return <QuizCifras addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'quiz-cordas': return <QuizCordas addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'quiz-anatomia': return <QuizAnatomia addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'quiz-batidas-ritmo': return <QuizBatidasRitmo addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'grande-relogio': return <GrandeRelogio addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'fabrica-de-acordes': return <FabricaDeAcordes addXP={addXP} onComplete={handleCompleteLesson} onUpdateNPC={(s, m) => { setNpcState(s); setNpcContext(s === 'celebrating' ? 'correct' : 'wrong'); }} instrument={currentInstrument} />;
      case 'elephant-bird': return <ElephantBirdGame addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'string-maze': return <StringMazeGame addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'groove-clock': return <GrooveClockGame addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-cifras': return <QuizCifras addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-ritmo-avancado': return <QuizRitmoAvancado addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'rhythm-domino': return <RhythmDominoGame addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'chord-factory': return <ChordFactoryGame addXP={addXP} onComplete={handleCompleteLesson} instrument={currentInstrument} />;
      default: return <div className="p-8 text-center">Componente em desenvolvimento...</div>;
    }
  };

  if (activeLesson) {
    const world = WORLDS.find(w => w.id === activeLesson.world);
    return (
      <LessonPage
        lessonId={activeLesson.id}
        title={activeLesson.title}
        worldName={world?.name || ''}
        worldNumber={activeLesson.world}
        instrument={currentInstrument}
        onBack={() => setActiveLesson(null)}
        onComplete={handleCompleteLesson}
      >
        {renderLessonComponent(activeLesson.component)}
      </LessonPage>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-32 relative">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-redhouse-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-redhouse-primary/30 rotate-3">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-redhouse-primary uppercase italic tracking-widest">Caminho da Glória</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Jornada do <span className="text-redhouse-primary drop-shadow-sm">Rockstar</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase italic text-sm max-w-md leading-tight">
              Domine o violão passo a passo e conquiste os palcos do mundo! 🎸✨
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            {/* Instrument Toggle */}
            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-1 shadow-lg">
              <button
                onClick={() => {
                  audio.playClick();
                  setState(prev => ({ ...prev, instrument: 'guitar' }));
                }}
                className={`px-6 py-2 rounded-xl font-black uppercase italic text-xs transition-all ${
                  currentInstrument === 'guitar' 
                    ? 'bg-redhouse-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                Violão
              </button>
              <button
                onClick={() => {
                  audio.playClick();
                  setState(prev => ({ ...prev, instrument: 'ukulele' }));
                }}
                className={`px-6 py-2 rounded-xl font-black uppercase italic text-xs transition-all ${
                  currentInstrument === 'ukulele' 
                    ? 'bg-redhouse-primary text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                Ukulele
              </button>
            </div>

            <div className="flex gap-4">
              {/* Avatar Mini Preview */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab('avatar-customizer')}
                className={`relative w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden ${currentSkins.background?.color || 'bg-slate-800'}`}
              >
                <div className="absolute inset-0 flex items-center justify-center scale-50">
                   <div className={`w-32 h-32 rounded-full flex items-center justify-center relative ${currentSkins.body?.color || 'bg-red-600'}`}>
                    <currentSkins.body.icon className="w-16 h-16 text-white/20" />
                    <div className={`absolute -top-8 w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${currentSkins.head?.color || 'bg-slate-500'}`}>
                      <currentSkins.head.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-1 text-[8px] font-black text-white uppercase italic text-center">
                  Meu Avatar
                </div>
              </motion.button>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 border-b-4 border-redhouse-primary rounded-3xl p-4 flex items-center gap-4 shadow-xl min-w-[140px]"
              >
                <div className="w-12 h-12 bg-redhouse-primary/10 rounded-2xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-redhouse-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Experiência</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{state.xp}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 border-b-4 border-yellow-500 rounded-3xl p-4 flex items-center gap-4 shadow-xl min-w-[140px]"
              >
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
                  <Coins className="w-7 h-7 text-yellow-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase italic">Moedas</p>
                  <p className="text-2xl font-black text-yellow-500">{state.coins}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* World Selector - Map Navigation */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2">
          {WORLDS.map(world => {
            const worldLessons = filteredJourney.filter(l => l.world === world.id);
            const completedInWorld = worldLessons.filter(l => completedLessons.includes(l.id)).length;
            const progress = worldLessons.length > 0 ? (completedInWorld / worldLessons.length) * 100 : 0;
            const isSelected = selectedWorld === world.id;

            return (
              <button
                key={world.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedWorld(world.id);
                }}
                className={`flex-shrink-0 group relative p-1 rounded-[2rem] transition-all ${
                  isSelected ? 'scale-110 z-10' : 'hover:scale-105'
                }`}
              >
                <div className={`
                  px-8 py-6 rounded-[1.8rem] border-b-8 transition-all flex flex-col items-center gap-2 min-w-[160px]
                  ${isSelected
                    ? 'bg-redhouse-primary border-redhouse-primary/50 text-white shadow-2xl shadow-redhouse-primary/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-redhouse-primary/30'
                  }
                `}>
                  <span className="text-4xl mb-1 group-hover:animate-bounce">{world.icon}</span>
                  <div className="text-center">
                    <p className={`text-[10px] font-black uppercase italic ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>Mundo {world.id}</p>
                    <p className="font-black uppercase italic whitespace-nowrap text-sm">{world.name}</p>
                  </div>
                  
                  {/* Progress Ring or Bar */}
                  <div className="mt-3 w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${isSelected ? 'bg-white' : 'bg-redhouse-primary'}`}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit Header */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="bg-redhouse-primary p-8 rounded-[3rem] border-b-8 border-redhouse-primary/50 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{WORLDS.find(w => w.id === selectedWorld)?.icon}</span>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mundo {selectedWorld}</h2>
                <p className="text-sm font-bold uppercase italic text-white/80">{WORLDS.find(w => w.id === selectedWorld)?.name}</p>
              </div>
            </div>
            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(filteredJourney.filter(l => l.world === selectedWorld && completedLessons.includes(l.id)).length / filteredJourney.filter(l => l.world === selectedWorld).length) * 100}%` }}
                className="h-full bg-white shadow-lg shadow-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progression Map - Vertical Path */}
      <div className="max-w-xl mx-auto pb-40">
        {filteredJourney.filter(l => l.world === selectedWorld).map((lesson, index) => {
          const status = getLessonStatus(lesson.id);
          const isLeft = index % 2 === 0;
          const isCenter = index % 3 === 1;
          
          return (
            <div key={lesson.id} className="flex flex-col items-center mb-12 relative">
              {/* Connection Line */}
              {index < filteredJourney.filter(l => l.world === selectedWorld).length - 1 && (
                <div className="absolute top-20 w-1 h-20 bg-slate-200 dark:bg-slate-800 -z-10" />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative group ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ 
                  marginLeft: isLeft ? '-40px' : isCenter ? '0' : '40px' 
                }}
                onClick={() => {
                  if (status !== 'locked') {
                    audio.playClick();
                    setActiveLesson(lesson);
                  } else {
                    audio.playError();
                  }
                }}
              >
                {/* Node */}
                <div className={`
                  w-24 h-24 rounded-full border-b-8 transition-all relative flex items-center justify-center
                  ${status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-700 text-white shadow-lg' 
                    : status === 'available'
                    ? 'bg-redhouse-primary border-redhouse-primary/70 text-white shadow-xl hover:scale-110 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-900 text-slate-400 grayscale'
                  }
                `}>
                  <lesson.icon className="w-10 h-10" />
                  
                  {/* Tooltip-like Label */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <p className="text-[10px] font-black uppercase italic text-redhouse-primary">{lesson.type === 'challenge' ? 'Desafio' : 'Lição'}</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase italic">{lesson.title}</p>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2">
                    {status === 'completed' ? (
                      <div className="w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : status === 'available' ? (
                      <div className="w-8 h-8 bg-yellow-500 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center text-white animate-bounce">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-slate-400 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center text-white">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Global NPC for Journey Feedback */}
      <NPCGuide 
        context={npcContext}
        instrument={currentInstrument}
        state={npcState}
        autoHide={true}
      />
    </div>
  );
}
