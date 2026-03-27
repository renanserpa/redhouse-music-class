import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Calendar, Users, FileText, CheckCircle, User, Loader2 } from 'lucide-react';
import { LessonReport, Student, InstrumentType, Classroom, User as UserType } from '../types';
import { saveLessonReport, listStudentsByClassroom, listClassrooms } from '../services/dataService';
import BrandHeader from './BrandHeader';
import { Music } from 'lucide-react';

interface Props {
  user: UserType | null;
  onSave: (report: LessonReport) => void;
}

export default function LessonReportForm({ user, onSave }: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [report, setReport] = useState<Partial<LessonReport>>({
    date: new Date().toISOString().split('T')[0],
    classroomId: '',
    studentId: '',
    instrument: 'violao',
    workedContent: '',
    observations: '',
    nextSteps: '',
  });

  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar turmas iniciais
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const data = await listClassrooms();
        setClassrooms(data);
        if (data.length > 0 && !report.classroomId) {
          setReport(prev => ({ ...prev, classroomId: data[0].id }));
        }
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadClassrooms();
  }, []);

  // Carregar alunos quando a turma mudar
  useEffect(() => {
    if (report.classroomId) {
      listStudentsByClassroom(report.classroomId).then(setAvailableStudents);
    }
  }, [report.classroomId]);

  // Atualizar instrumento automaticamente se o aluno mudar
  useEffect(() => {
    if (report.studentId) {
      const student = availableStudents.find(s => s.id === report.studentId);
      if (student) {
        setReport(prev => ({ ...prev, instrument: student.instrument }));
      }
    }
  }, [report.studentId, availableStudents]);

  const handleSave = async () => {
    if (!report.workedContent || !report.classroomId || !user) return;
    
    setIsSaving(true);
    
    const finalReport: LessonReport = {
      id: Math.random().toString(36).substr(2, 9),
      classroomId: report.classroomId!,
      studentId: report.studentId || undefined,
      instrument: report.instrument as InstrumentType,
      date: report.date!,
      workedContent: report.workedContent!,
      observations: report.observations || '',
      nextSteps: report.nextSteps || '',
      createdByTeacherId: user.uid,
    };
    
    try {
      await saveLessonReport(finalReport);
      onSave(finalReport);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-redhouse-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[40px] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        {/* RedHouse Header */}
        <div className="bg-white p-8 border-b-4 border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <BrandHeader />
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Relatório de Aula</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">RedHouse Music Class</p>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* 1. Seleção de Turma e Aluno */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">01</div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Identificação</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Users className="w-4 h-4" /> Turma
                </label>
                <select 
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none appearance-none cursor-pointer"
                  value={report.classroomId}
                  onChange={e => setReport(prev => ({ ...prev, classroomId: e.target.value, studentId: '' }))}
                >
                  <option value="">Selecione a Turma</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <User className="w-4 h-4" /> Aluno em Foco (Opcional)
                </label>
                <select 
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none appearance-none cursor-pointer"
                  value={report.studentId}
                  onChange={e => setReport(prev => ({ ...prev, studentId: e.target.value }))}
                >
                  <option value="">Toda a Turma</option>
                  {availableStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.instrument})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Music className="w-4 h-4" /> Instrumento
                </label>
                <select 
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none appearance-none cursor-pointer"
                  value={report.instrument}
                  onChange={e => setReport(prev => ({ ...prev, instrument: e.target.value as InstrumentType }))}
                >
                  <option value="violao">Violão</option>
                  <option value="ukulele">Ukulele</option>
                  <option value="piano">Piano</option>
                  <option value="bateria">Bateria</option>
                  <option value="canto">Canto</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Calendar className="w-4 h-4" /> Data da Aula
                </label>
                <input 
                  type="date"
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none"
                  value={report.date}
                  onChange={e => setReport(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* 2. Conteúdo e Observações */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">02</div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Desenvolvimento</h3>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">O que foi trabalhado?</label>
              <textarea 
                className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none min-h-[150px] placeholder:text-slate-300"
                placeholder="Ex: Escala de Dó Maior, Acordes básicos, Música 'Imagine'..."
                value={report.workedContent}
                onChange={e => setReport(prev => ({ ...prev, workedContent: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Observações Gerais</label>
                <textarea 
                  className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none min-h-[120px] placeholder:text-slate-300"
                  placeholder="Comportamento, dificuldades específicas..."
                  value={report.observations}
                  onChange={e => setReport(prev => ({ ...prev, observations: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Próximos Passos</label>
                <textarea 
                  className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg focus:ring-8 focus:ring-red-100 transition-all outline-none min-h-[120px] placeholder:text-slate-300"
                  placeholder="O que focar na próxima aula?"
                  value={report.nextSteps}
                  onChange={e => setReport(prev => ({ ...prev, nextSteps: e.target.value }))}
                />
              </div>
            </div>
          </section>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
            onClick={handleSave}
            className={`w-full p-8 rounded-3xl border-4 border-slate-900 flex items-center justify-center gap-4 font-black text-2xl uppercase tracking-tighter transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
              saved ? 'bg-green-500 text-white' : 'bg-redhouse-primary text-white hover:bg-red-800'
            } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                Salvando no Banco...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-8 h-8" />
                Relatório Salvo!
              </>
            ) : (
              <>
                <Save className="w-8 h-8" />
                Finalizar Relatório
              </>
            )}
          </motion.button>
          
          <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              RedHouse Music Class – Foco no desenvolvimento integral e excelência musical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
