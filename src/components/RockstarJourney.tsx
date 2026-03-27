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
  Library,
  Bug
} from 'lucide-react';
import { AppState, Tab, Instrument } from '../types';
import { audio } from '../lib/audio';
import LessonPage from './LessonPage';
import NPCGuide, { NPCState } from './NPCGuide';

// Import Lesson Components
import AnatomyGame from './games/AnatomyGame';
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
import StringMazeGame from './games/StringMazeGame';
import RhythmDominoGame from './games/RhythmDominoGame';
import DancaMaoDireita from './games/DancaMaoDireita';
import EscadaDasCores from './games/EscadaDasCores';
import SussurroOuTrovao from './games/SussurroOuTrovao';
import SpiderWalk from './games/SpiderWalk';
import SongwriterStudio from './games/SongwriterStudio';

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
import QuizDedilhado from './quizzes/QuizDedilhado';
import QuizCifrasMagicas from './quizzes/QuizCifrasMagicas';
import QuizRitmicaAvancada from './quizzes/QuizRitmicaAvancada';
import { QuizTabletura } from './quizzes/QuizTabletura';
import { QuizPosicoes } from './quizzes/QuizPosicoes';

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
  { id: '5.5', title: 'Songwriter Studio', description: 'Crie sua própria música com blocos de emoções.', world: 5, component: 'songwriter-studio', icon: Sparkles, type: 'lesson' },

  // MUNDO 2 – Reino das Notas (new)
  { id: '2.5', title: 'A Escada das Cores', description: 'Monte a escala com as cores do Maestro.', world: 2, component: 'escada-das-cores', icon: Music, type: 'lesson' },
  { id: '2.6', title: 'Quiz: Cifras Mágicas', description: 'Domine as letras dos acordes!', world: 2, component: 'quiz-cifras-magicas', icon: Trophy, type: 'challenge' },

  // MUNDO 3 – Montanha do Ritmo (new)
  { id: '3.7', title: 'Sussurro ou Trovão?', description: 'Forte ou fraco — controle a dinâmica!', world: 3, component: 'sussurro-ou-trovao', icon: Zap, type: 'lesson' },
  { id: '3.8', title: 'Quiz: Rítmica Avançada', description: 'Semínima, Mínima e Semibreve.', world: 3, component: 'quiz-ritmica-avancada', icon: Trophy, type: 'challenge' },

  // MUNDO 4 – Floresta dos Acordes (new)
  { id: '4.6', title: 'Dança da Mão Direita', description: 'Domine o P-I-M-A com ritmo!', world: 4, component: 'danca-mao-direita', icon: Gamepad2, type: 'lesson' },
  { id: '4.7', title: 'Quiz: Tablatura', description: 'Leia tablatura como um pro!', world: 4, component: 'quiz-tabletura', icon: Trophy, type: 'challenge' },
  { id: '4.8', title: 'Quiz: Dedilhado PIMA', description: 'Teste seus conhecimentos sobre PIMA.', world: 4, component: 'quiz-dedilhado', icon: Trophy, type: 'challenge' },
  { id: '4.9', title: 'A Caminhada da Aranha', description: 'Treino rítmico com a aranha-astronauta!', world: 4, component: 'spider-walk', icon: Bug, type: 'challenge' },

  // MUNDO 1 – Vale das Cordas (new)
  { id: '1.6', title: 'Quiz: Posições e Postura', description: 'Polegar, coluna e posição certa!', world: 1, component: 'quiz-posicoes', icon: Trophy, type: 'challenge' },
];

const WORLDS = [
  { id: 1, name: 'Vale das Cordas', color: 'bg-emerald-500', icon: '🌿' },
  { id: 2, name: 'Reino das Notas', color: 'bg-blue-500', icon: '🏔️' },
  { id: 3, name: 'Montanha do Ritmo', color: 'bg-amber-500', icon: '⛰️' },
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
    // For development/testing: Unlock all lessons
    return false;
    
    /* Original logic:
    const index = filteredJourney.findIndex(l => l.id === lessonId);
    if (index === 0) return false;
    const previousLesson = filteredJourney[index - 1];
    return !completedLessons.includes(previousLesson.id);
    */
  };

  const getLessonStatus = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) return 'completed';
    if (isLessonLocked(lessonId)) return 'locked';
    return 'available';
  };

  const renderLessonComponent = (tab: Tab) => {
    switch (tab) {
      case 'anatomy': return <AnatomyGame addXP={addXP} />;
      case 'ear-training': return <EarTraining addXP={addXP} />;
      case 'fretboard-follower': return <FretboardFollower addXP={addXP} />;
      case 'metronome': return <Metronome />;
      case 'rhythm-challenge': return <RhythmChallenge addXP={addXP} />;
      case 'rhythm-invaders': return <RhythmInvaders addXP={addXP} />;
      case 'konnakkol': return <KonnakkolBuilder addXP={addXP} />;
      case 'tablature': return <TablatureModule />;
      case 'chord-lab': return <ChordLab addXP={addXP} />;
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
      case 'string-maze': return <StringMazeGame addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-ritmo-avancado': return <QuizRitmoAvancado addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'rhythm-domino': return <RhythmDominoGame addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'danca-mao-direita': return <DancaMaoDireita addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'escada-das-cores': return <EscadaDasCores addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'sussurro-ou-trovao': return <SussurroOuTrovao addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-dedilhado': return <QuizDedilhado addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-cifras-magicas': return <QuizCifrasMagicas addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-ritmica-avancada': return <QuizRitmicaAvancada addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-tabletura': return <QuizTabletura addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'quiz-posicoes': return <QuizPosicoes addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'spider-walk': return <SpiderWalk addXP={addXP} onComplete={handleCompleteLesson} />;
      case 'songwriter-studio': return <SongwriterStudio addXP={addXP} onComplete={handleCompleteLesson} />;
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
    <div className="min-h-screen bg-redhouse-bg p-4 md:p-8 pb-32 relative overflow-hidden">
      {/* HUD Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-50" />
      
      {/* HUD Grid/Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
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
            <h1 className="text-5xl md:text-7xl font-black text-redhouse-text uppercase italic tracking-tighter leading-none">
              Jornada do <span className="text-redhouse-primary">Rockstar</span>
            </h1>
            <p className="text-redhouse-muted font-bold uppercase italic text-sm max-w-md leading-tight">
              Domine o violão passo a passo e conquiste os palcos do mundo! 🎸✨
            </p>
          </div>

          <div className="flex flex-col items-end gap-4">
            {/* Instrument Toggle */}
            <div className="bg-redhouse-card backdrop-blur-xl p-1.5 rounded-2xl border border-redhouse-border flex gap-1 shadow-2xl">
              <button
                onClick={() => {
                  audio.playClick();
                  setState(prev => ({ ...prev, instrument: 'guitar' }));
                }}
                className={`px-6 py-2 rounded-xl font-black uppercase italic text-xs transition-all ${
                  currentInstrument === 'guitar' 
                    ? 'bg-redhouse-primary text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                    : 'text-white/30 hover:text-white hover:bg-white/5'
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
                    ? 'bg-redhouse-primary text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                    : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                Ukulele
              </button>
            </div>

            <div className="flex gap-4">
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-black/40 backdrop-blur-xl border-b-4 border-redhouse-primary rounded-3xl p-5 flex items-center gap-4 shadow-2xl min-w-[160px] border-x border-t border-white/5"
              >
                <div className="w-12 h-12 bg-redhouse-primary/10 rounded-2xl flex items-center justify-center border border-redhouse-primary/20">
                  <Zap className="w-7 h-7 text-redhouse-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-redhouse-muted uppercase italic tracking-widest leading-none mb-1">XP_TOTAL</p>
                  <p className="text-3xl font-black text-redhouse-text italic tracking-tighter">{state.xp}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-black/40 backdrop-blur-xl border-b-4 border-yellow-500 rounded-3xl p-5 flex items-center gap-4 shadow-2xl min-w-[160px] border-x border-t border-white/5"
              >
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                  <Coins className="w-7 h-7 text-yellow-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-redhouse-muted uppercase italic tracking-widest leading-none mb-1">CREDITS</p>
                  <p className="text-3xl font-black text-yellow-500 italic tracking-tighter">{state.coins}</p>
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
                  px-8 py-6 rounded-[1.8rem] border-b-8 transition-all flex flex-col items-center gap-2 min-w-[180px] backdrop-blur-md
                  ${isSelected
                    ? 'bg-redhouse-primary border-redhouse-primary/50 text-white shadow-2xl shadow-redhouse-primary/40'
                    : 'bg-redhouse-card border-redhouse-border text-redhouse-muted hover:border-redhouse-primary/30 hover:text-redhouse-text'
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

      {/* Progression Map - Grid Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJourney.filter(l => l.world === selectedWorld).map((lesson, index) => {
            const status = getLessonStatus(lesson.id);
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => {
                  if (status !== 'locked') {
                    audio.playClick();
                    setActiveLesson(lesson);
                  } else {
                    audio.playError();
                  }
                }}
              >
                {/* Connection Line (Visual only) */}
                {index < filteredJourney.filter(l => l.world === selectedWorld).length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 w-8 h-1 bg-white/10 z-0" />
                )}

                <div className={`
                  p-8 rounded-[3rem] border-b-8 transition-all relative overflow-hidden h-full flex flex-col gap-6 backdrop-blur-xl border-x border-t
                  ${status === 'completed' 
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                    : status === 'available'
                    ? 'bg-black/40 border-redhouse-primary shadow-2xl hover:shadow-[0_0_40px_rgba(239,68,68,0.2)] hover:-translate-y-2 border-white/5'
                    : 'bg-slate-900/30 border-white/5 grayscale opacity-40'
                  }
                `}>
                  {/* Status Icon Overlay */}
                  <div className="absolute top-6 right-6">
                    {status === 'completed' ? (
                      <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : status === 'available' ? (
                      <div className="w-10 h-10 bg-redhouse-primary rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-12 animate-pulse">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-slate-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Lock className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner shrink-0 transition-transform group-hover:rotate-12 ${
                    status === 'completed' ? 'bg-emerald-500 text-white' : 
                    status === 'available' ? 'bg-redhouse-primary/10 text-redhouse-primary' : 
                    'bg-slate-200 text-slate-400'
                  }`}>
                    <lesson.icon className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase italic px-2 py-0.5 rounded-full ${
                        status === 'completed' ? 'bg-emerald-500/20 text-emerald-600' :
                        status === 'available' ? 'bg-redhouse-primary/20 text-redhouse-primary' :
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {lesson.type === 'challenge' ? 'Desafio' : 'Lição'} {lesson.id}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-md">
                      {lesson.title}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 leading-snug italic">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-redhouse-primary">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-black">+50</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-yellow-500">
                        <Coins className="w-4 h-4" />
                        <span className="text-xs font-black">+10</span>
                      </div>
                    </div>
                    
                    {status === 'available' && (
                      <span className="text-[10px] font-black text-redhouse-primary uppercase italic flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Começar <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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
