import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Star, 
  Users, 
  ChevronRight, 
  BookOpen, 
  Monitor,
  Trophy,
  Activity,
  ArrowUpRight,
  FileText,
  Coins
} from 'lucide-react';
import { AppState, Tab, Classroom, Student } from '../types';
import { listClassrooms, listStudentsByClassroom } from '../services/dataService';

interface DashboardProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setActiveTab: (tab: Tab) => void;
  currentClassroomId?: string;
  currentStudentId?: string;
  onSelectContext: (classroomId: string, studentId: string) => void;
}

export default function Dashboard({ 
  state, 
  setActiveTab, 
  onSelectContext 
}: DashboardProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string | 'all'>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cls = await listClassrooms();
        setClassrooms(cls);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      if (selectedClassroom !== 'all') {
        const stds = await listStudentsByClassroom(selectedClassroom);
        setStudents(stds);
      } else {
        setStudents([]);
      }
    };
    loadStudents();
  }, [selectedClassroom]);

  const quickActions = [
    { id: 'lesson-console', label: 'Console de Aula', icon: Monitor, color: 'text-pedagogy-red', bg: 'bg-pedagogy-red/10' },
    { id: 'lesson-plan', label: 'Plano de Aula', icon: BookOpen, color: 'text-pedagogy-blue', bg: 'bg-pedagogy-blue/10' },
    { id: 'lesson-report', label: 'Novo Relatório', icon: Activity, color: 'text-pedagogy-purple', bg: 'bg-pedagogy-purple/10' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-redhouse-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Section */}
      <div className="glass-card p-10 hud-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap className="w-32 h-32 text-redhouse-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-redhouse-primary rounded-full animate-pulse shadow-[0_0_10px_var(--color-redhouse-primary)]" />
            <span className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.4em] italic">System_Ready // User_Authenticated</span>
          </div>
          
          <h1 className="text-5xl font-black text-redhouse-text uppercase italic tracking-tighter mb-4">
            Bem-vindo, <span className="text-redhouse-primary">{state.user?.name?.split(' ')[0] || 'Mestre'}</span>
          </h1>
          <p className="text-redhouse-muted font-bold text-lg max-w-2xl leading-relaxed">
            Seu centro de comando musical está ativo. Gerencie turmas, acompanhe o progresso dos alunos e dispare atividades pedagógicas em tempo real.
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(action.id as Tab)}
            className="glass-card p-8 flex items-center justify-between group hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 ${action.bg} rounded-2xl flex items-center justify-center ${action.color} border border-white/5 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all`}>
                <action.icon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h4 className="text-lg font-black text-redhouse-text uppercase italic tracking-tight">{action.label}</h4>
                <p className="text-[10px] font-bold text-redhouse-muted uppercase tracking-widest">Acesso Rápido</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-redhouse-muted group-hover:text-redhouse-text transition-colors" />
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Context Selector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-pedagogy-blue" />
              <h3 className="text-2xl font-black uppercase italic tracking-tight">Seleção de Contexto</h3>
            </div>
          </div>

          <div className="glass-card p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest ml-1">Selecione a Turma</label>
                <select 
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="w-full bg-redhouse-card border border-redhouse-border p-4 rounded-2xl font-bold text-redhouse-text outline-none focus:ring-2 focus:ring-redhouse-primary/50 transition-all appearance-none"
                >
                  <option value="all">Todas as Turmas</option>
                  {classrooms.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest ml-1">Selecione o Aluno</label>
                <select 
                  disabled={selectedClassroom === 'all'}
                  onChange={(e) => onSelectContext(selectedClassroom, e.target.value)}
                  className="w-full bg-redhouse-card border border-redhouse-border p-4 rounded-2xl font-bold text-redhouse-text outline-none focus:ring-2 focus:ring-redhouse-primary/50 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione um Aluno</option>
                  {students.map(std => (
                    <option key={std.id} value={std.id}>{std.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-redhouse-border">
              <div className="flex items-center gap-4 text-redhouse-muted">
                <div className="w-10 h-10 bg-redhouse-muted/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold leading-relaxed">
                  Selecione uma turma e um aluno para visualizar estatísticas detalhadas, histórico de progresso e personalizar o plano de aula.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-pedagogy-green" />
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Status Global</h3>
          </div>

          <div className="glass-card p-8 space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Técnica', value: state.stats.tech, color: 'bg-pedagogy-red' },
                { label: 'Ritmo', value: state.stats.rhythm, color: 'bg-pedagogy-blue' },
                { label: 'Teoria', value: state.stats.theory, color: 'bg-pedagogy-purple' },
                { label: 'Repertório', value: state.stats.repertoire, color: 'bg-pedagogy-yellow' },
                { label: 'Expressão', value: state.stats.expression, color: 'bg-pedagogy-green' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xs font-black text-redhouse-text">{stat.value}%</span>
                  </div>
                  <div className="h-2 bg-redhouse-muted/10 rounded-full overflow-hidden border border-redhouse-border">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      className={`h-full ${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-redhouse-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-redhouse-muted uppercase tracking-widest">Nível Atual</span>
                <span className="text-xl font-black text-redhouse-text italic">Intermediário</span>
              </div>
              <div className="w-12 h-12 bg-redhouse-primary/20 rounded-xl flex items-center justify-center text-redhouse-primary border border-redhouse-primary/20">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-pedagogy-purple" />
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Relatórios Recentes</h3>
          </div>
          <button 
            onClick={() => setActiveTab('reports-history')}
            className="text-[10px] font-black text-pedagogy-blue uppercase tracking-widest hover:underline"
          >
            Ver Histórico Completo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(state.lessonReports || []).slice(0, 3).map((report, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="glass-card p-6 border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-pedagogy-purple/10 rounded-xl flex items-center justify-center text-pedagogy-purple">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[8px] font-black text-redhouse-muted uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                  {new Date(report.date).toLocaleDateString()}
                </span>
              </div>
              <h4 className="text-lg font-black text-redhouse-text uppercase italic mb-1 truncate">
                {report.studentId ? 'Relatório Individual' : 'Relatório de Turma'}
              </h4>
              <p className="text-[10px] font-bold text-redhouse-muted uppercase tracking-widest mb-4">Relatório de Aula</p>
              <div className="flex items-center justify-between pt-4 border-t border-redhouse-border">
                <span className="text-[9px] font-black text-pedagogy-green uppercase tracking-widest">Status: Enviado</span>
                <ChevronRight className="w-4 h-4 text-redhouse-muted" />
              </div>
            </motion.div>
          ))}
          
          {(!state.lessonReports || state.lessonReports.length === 0) && (
            <div className="lg:col-span-3 glass-card p-12 text-center border-dashed border-white/10">
              <p className="text-redhouse-muted font-bold italic">Nenhum relatório encontrado. Inicie uma aula para gerar seu primeiro relatório!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
