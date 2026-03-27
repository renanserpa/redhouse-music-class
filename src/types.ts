/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Tab = 
  | 'dashboard' 
  | 'lesson-console' 
  | 'classrooms' 
  | 'students' 
  | 'lesson-report' 
  | 'monthly-report' 
  | 'reports-history' 
  | 'pedagogy-library' 
  | 'media-lab' 
  | 'director-dashboard'
  | 'games-hub'
  | 'anatomy' 
  | 'ear-training' 
  | 'echo-game' 
  | 'chord-lab' 
  | 'rhythm-invaders' 
  | 'rhythm-challenge' 
  | 'konnakkol' 
  | 'musical-wheel' 
  | 'fretboard-follower' 
  | 'fretboard-master' 
  | 'tablature' 
  | 'rhythmic-dictation' 
  | 'activity-studio' 
  | 'lesson-plan' 
  | 'metronome'
  | 'rockstar-journey'
  | 'tuner'
  | 'quiz-partes'
  | 'quiz-postura'
  | 'quiz-notas'
  | 'quiz-grave-agudo'
  | 'elefante-passarinho'
  | 'quiz-elefante-passarinho'
  | 'quiz-cordas'
  | 'quiz-anatomia'
  | 'quiz-batidas-ritmo'
  | 'grande-relogio'
  | 'fabrica-de-acordes'
  | 'string-maze'
  | 'elephant-bird'
  | 'quiz-cifras'
  | 'groove-clock'
  | 'rhythm-domino'
  | 'quiz-ritmo-avancado'
  | 'chord-factory'
  | 'danca-mao-direita'
  | 'escada-das-cores'
  | 'sussurro-ou-trovao'
  | 'quiz-dedilhado'
  | 'quiz-cifras-magicas'
  | 'quiz-ritmica-avancada'
  | 'quiz-tabletura'
  | 'quiz-posicoes'
  | 'spider-walk'
  | 'songwriter-studio'
  | 'presentation'
  | 'settings';

export type Instrument = "guitar" | "ukulele";
export type InstrumentType = Instrument | 'piano' | 'bateria' | 'canto' | 'violao';

export interface School {
  id: string;
  name: string;
  campusName: string;
  address?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  schoolId: string;
  photoURL?: string;
}

export interface StudentStats {
  tech: number;
  rhythm: number;
  theory: number;
  repertoire: number;
  expression: number;
}

export interface Student {
  id: string;
  name: string;
  age?: number;
  instrument: InstrumentType;
  classroomId: string;
  schoolId: string;
  notes?: string;
  xp?: number;
  coins?: number;
  stats?: StudentStats;
}

export interface Classroom {
  id: string;
  name: string;
  schoolId: string;
  schedule?: string;
  teacherId?: string;
  ageRange?: string;
  active?: boolean;
}

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  role: 'teacher' | 'admin';
  photoURL?: string | null;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AppState {
  user: User | null;
  authStatus: AuthStatus;
  xp: number;
  coins: number;
  studentName: string;
  instrument: Instrument;
  stats: StudentStats;
  lessonReports?: LessonReport[];
  monthlyReports?: MonthlyReport[];
  currentClassroomId?: string;
  currentStudentId?: string;
  activeLesson?: {
    startTime: string;
    classroomId: string;
    attendance: Record<string, boolean>;
  };
}

export type BlockType = "aquecimento" | "revisao" | "novo_conteudo" | "pratica" | "jogo" | "fechamento";

export type DevelopmentLevel = "excelente" | "bom" | "regular" | "em_desenvolvimento";

export type LessonReport = {
  id: string;
  classroomId: string;
  studentId?: string; // Optional student focus
  instrument?: InstrumentType; // Instrument worked in this lesson
  date: string; // ISO
  workedContent: string;     // "O que foi trabalhado"
  observations: string;      // "Observações"
  nextSteps: string;         // "Próximos passos"
  createdByTeacherId: string;
};

export type MonthlyReport = {
  id: string;
  month: string; // "2026-03"
  classroomId: string;
  studentId: string;
  instrument: InstrumentType;
  monthlyGoals: string;          // 1. Objetivos do mês
  workedContent: string;         // 2. Conteúdos trabalhados
  developmentLevel: DevelopmentLevel; // 3
  technique: DevelopmentLevel;        // 4
  participation: DevelopmentLevel;
  concentration: DevelopmentLevel;
  interest: DevelopmentLevel;
  peerRelationship: DevelopmentLevel;
  monthlyHighlight: string;      // 5. Destaque do mês
  attentionPoints: string;       // 6. Pontos de atenção
  nextMonthGuidance: string;     // 7. Orientações para o próximo mês
  generalNotes: string;          // 8. Observações gerais
  createdByTeacherId: string;
};

export interface Activity {
  id: string;
  title: string;
  description: string;
  blockType: BlockType;
  instrument?: InstrumentType; // User requested 'instrument', but we have 'instruments' array too
  instruments: InstrumentType[];
  difficulty: "iniciante" | "intermediario";
  focus: "nota" | "ritmo" | "sequencia" | "pratica_casa" | "timbre" | "coordenação" | "leitura" | "repertório" | "expressão" | "liderança";
  tags?: string[];
  ageRange?: string;
  pedagogicalObjective?: string;
}

export interface ActivityAttempt {
  id: string;
  activityId: string;
  studentId: string;
  classroomId: string;
  date: string;
  result: "sucesso" | "falha" | "em_progresso";
  score?: number;
  notes?: string;
}

export interface Chord {
  id: string;
  name: string;
  instrument: InstrumentType;
  difficulty: "facil" | "medio" | "dificil";
  fingering: string; // e.g., "0-3-2-0-1-0"
  colorCode?: string; // API Pedagógica de Cores
  typicalUse?: string;
}

export interface PedagogicalPattern {
  patternId: string;
  cores: string[];
  nomePedagogico: string;
  uso: BlockType;
  dificuldade: "iniciante" | "em_progresso" | "consolidado";
}
