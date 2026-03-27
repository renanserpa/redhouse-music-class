import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Music
} from 'lucide-react';
import { AppState, LessonReport, MonthlyReport, Classroom, Student } from '../types';
import { listClassrooms, listStudentsByClassroom } from '../services/dataService';
import BrandHeader from './BrandHeader';

interface ReportCardProps {
  type: 'lesson' | 'monthly';
  data: LessonReport | MonthlyReport;
  isExpanded: boolean;
  onToggle: () => void;
  classroomName: string;
  studentName?: string;
}

function isLessonReport(data: LessonReport | MonthlyReport): data is LessonReport {
  return 'date' in data;
}

interface ReportsHistoryProps {
  state: AppState;
}

export default function ReportsHistory({ state }: ReportsHistoryProps) {
  const [selectedClassroom, setSelectedClassroom] = useState<string>('all');
  const [reportType, setReportType] = useState<'lesson' | 'monthly'>('lesson');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const clsData = await listClassrooms();
        setClassrooms(clsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do histórico:", error);
      }
    };
    loadData();
  }, []);

  // Load students when classroom changes to get names correctly
  useEffect(() => {
    if (selectedClassroom !== 'all') {
      listStudentsByClassroom(selectedClassroom).then(setStudents);
    }
  }, [selectedClassroom]);

  const lessonReports = state.lessonReports || [];
  const monthlyReports = state.monthlyReports || [];

  const filteredLessonReports = lessonReports.filter(r => 
    selectedClassroom === 'all' || r.classroomId === selectedClassroom
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredMonthlyReports = monthlyReports.filter(r => 
    selectedClassroom === 'all' || r.classroomId === selectedClassroom
  ).sort((a, b) => b.month.localeCompare(a.month));

  const getClassroomName = (id: string) => classrooms.find(c => c.id === id)?.name || 'Turma Desconhecida';
  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Aluno Desconhecido';

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-12 h-12 border-8 border-redhouse-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <BrandHeader />
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Histórico de Relatórios</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">RedHouse Music Class</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-end">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
            <button
              onClick={() => setReportType('lesson')}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${
                reportType === 'lesson' ? 'bg-white text-redhouse-primary shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Aulas
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${
                reportType === 'monthly' ? 'bg-white text-redhouse-primary shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Mensais
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-slate-400" />
            </div>
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white border-4 border-slate-900 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-red-100 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="all">Todas as Turmas</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reportType === 'lesson' ? (
          filteredLessonReports.length > 0 ? (
            filteredLessonReports.map((report) => (
              <ReportCard 
                key={report.id}
                type="lesson"
                data={report}
                isExpanded={expandedReport === report.id}
                onToggle={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                classroomName={getClassroomName(report.classroomId)}
              />
            ))
          ) : (
            <EmptyState message="Nenhum relatório de aula encontrado para esta turma." />
          )
        ) : (
          filteredMonthlyReports.length > 0 ? (
            filteredMonthlyReports.map((report) => (
              <ReportCard 
                key={report.id}
                type="monthly"
                data={report}
                isExpanded={expandedReport === report.id}
                onToggle={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                classroomName={getClassroomName(report.classroomId)}
                studentName={getStudentName(report.studentId)}
              />
            ))
          ) : (
            <EmptyState message="Nenhum relatório mensal encontrado para esta turma." />
          )
        )}
      </div>
    </div>
  );
}

function ReportCard({ type, data, isExpanded, onToggle, classroomName, studentName }: ReportCardProps) {
  const isLesson = isLessonReport(data);
  const lessonData = isLesson ? data : null;
  const monthlyData = !isLesson ? data as MonthlyReport : null;
  
  return (
    <motion.div 
      layout
      className="bg-white rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden"
    >
      <div 
        onClick={onToggle}
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${isLesson ? 'bg-blue-500' : 'bg-rose-500'}`}>
            {isLesson ? <Clock className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-lg uppercase tracking-tight">
                {isLesson ? `Aula: ${lessonData!.date}` : `Mensal: ${monthlyData!.month}`}
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border ${isLesson ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                {isLesson ? 'Relatório de Aula' : 'Relatório Mensal'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" /> {classroomName}
              </span>
              {data.instrument && (
                <span className="flex items-center gap-1.5 text-redhouse-primary">
                  <Music className="w-3 h-3" /> {data.instrument}
                </span>
              )}
              {!isLesson && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3" /> {studentName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-slate-300 uppercase">Status</p>
            <p className="text-xs font-black text-emerald-500 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Arquivado
            </p>
          </div>
          {isExpanded ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-slate-100 bg-slate-50/50"
          >
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {isLesson ? (
                <>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Conteúdo Trabalhado</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-200">{lessonData!.workedContent}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Observações</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-200">{lessonData!.observations || 'Nenhuma observação registrada.'}</p>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Próximos Passos</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-200">{lessonData!.nextSteps || 'Nenhum planejamento registrado.'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Objetivos do Mês</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-200">{monthlyData!.monthlyGoals}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Destaque do Mês</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-200">{monthlyData!.monthlyHighlight}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Níveis de Desenvolvimento</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <StatBadge label="Técnica" value={monthlyData!.technique} />
                      <StatBadge label="Participação" value={monthlyData!.participation} />
                      <StatBadge label="Concentração" value={monthlyData!.concentration} />
                      <StatBadge label="Interesse" value={monthlyData!.interest} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-redhouse-primary uppercase tracking-widest">Orientações</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-200">{monthlyData!.nextMonthGuidance}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatBadge({ label, value }: { label: string, value: string }) {
  const getColors = (v: string) => {
    switch(v) {
      case 'excelente': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'bom': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'regular': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase flex flex-col gap-0.5 ${getColors(value)}`}>
      <span className="opacity-60">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-[40px] p-12 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-slate-200" />
      </div>
      <p className="text-slate-400 font-bold max-w-xs">{message}</p>
    </div>
  );
}
