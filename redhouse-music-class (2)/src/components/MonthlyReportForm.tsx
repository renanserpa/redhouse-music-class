import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Calendar, Users, User, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { MonthlyReport, DevelopmentLevel, InstrumentType, Classroom, Student, User as UserType } from '../types';
import { GoogleGenAI } from "@google/genai";
import { saveMonthlyReport, listClassrooms, listStudentsByClassroom } from '../services/dataService';
import BrandHeader from './BrandHeader';
import { Music } from 'lucide-react';

interface Props {
  user: UserType | null;
  onSave: (report: MonthlyReport) => void;
}

const DEVELOPMENT_OPTIONS: { value: DevelopmentLevel; label: string; color: string }[] = [
  { value: 'excelente', label: 'Excelente', color: 'bg-green-500' },
  { value: 'bom', label: 'Bom', color: 'bg-blue-500' },
  { value: 'regular', label: 'Regular', color: 'bg-yellow-500' },
  { value: 'em_desenvolvimento', label: 'Em Desenvolvimento', color: 'bg-orange-500' },
];

export default function MonthlyReportForm({ user, onSave }: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  const [report, setReport] = useState<Partial<MonthlyReport>>({
    instrument: 'violao',
    monthlyGoals: '',
    workedContent: '',
    developmentLevel: 'bom',
    technique: 'bom',
    participation: 'bom',
    concentration: 'bom',
    interest: 'bom',
    peerRelationship: 'bom',
    monthlyHighlight: '',
    attentionPoints: '',
    nextMonthGuidance: '',
    generalNotes: '',
  });

  const [parentFriendlyText, setParentFriendlyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar turmas iniciais
  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const data = await listClassrooms();
        setClassrooms(data);
        if (data.length > 0 && !selectedClassroom) {
          setSelectedClassroom(data[0].id);
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
    if (selectedClassroom) {
      listStudentsByClassroom(selectedClassroom).then(data => {
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudent(data[0].id);
        } else {
          setSelectedStudent('');
        }
      });
    }
  }, [selectedClassroom]);

  // Atualizar instrumento automaticamente se o aluno mudar
  useEffect(() => {
    if (selectedStudent) {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        setReport(prev => ({ ...prev, instrument: student.instrument }));
      }
    }
  }, [selectedStudent, students]);

  const generateParentReport = async () => {
    if (!selectedStudent || !process.env.GEMINI_API_KEY) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const student = students.find(s => s.id === selectedStudent);
      
      const prompt = `
        Com base nos seguintes dados de um relatório mensal de aula de música, gere um parágrafo curto, amigável e encorajador para os pais do aluno ${student?.name}.
        O texto deve ser em português, evitar termos técnicos complexos e focar no desenvolvimento positivo.
        
        Dados:
        - Desenvolvimento Geral: ${report.developmentLevel}
        - Destaque do mês: ${report.monthlyHighlight}
        - Conteúdos: ${report.workedContent}
        - Pontos de atenção: ${report.attentionPoints}
        - Orientações: ${report.nextMonthGuidance}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setParentFriendlyText(response.text || '');
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      setParentFriendlyText("Olá! Este mês trabalhamos conteúdos importantes e o desenvolvimento tem sido constante. Continuaremos focando na prática para evoluir ainda mais!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedStudent || !user) return;
    
    setIsSaving(true);
    
    const finalReport: MonthlyReport = {
      id: Math.random().toString(36).substr(2, 9),
      month: selectedMonth,
      classroomId: selectedClassroom,
      studentId: selectedStudent,
      instrument: report.instrument as InstrumentType,
      monthlyGoals: report.monthlyGoals || '',
      workedContent: report.workedContent || '',
      developmentLevel: report.developmentLevel as DevelopmentLevel,
      technique: report.technique as DevelopmentLevel,
      participation: report.participation as DevelopmentLevel,
      concentration: report.concentration as DevelopmentLevel,
      interest: report.interest as DevelopmentLevel,
      peerRelationship: report.peerRelationship as DevelopmentLevel,
      monthlyHighlight: report.monthlyHighlight || '',
      attentionPoints: report.attentionPoints || '',
      nextMonthGuidance: report.nextMonthGuidance || '',
      generalNotes: report.generalNotes || '',
      createdByTeacherId: user.uid,
    };
    
    try {
      await saveMonthlyReport(finalReport);
      onSave(finalReport);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar relatório mensal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderLevelSelector = (field: keyof MonthlyReport, label: string) => (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {DEVELOPMENT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setReport(prev => ({ ...prev, [field]: opt.value }))}
            className={`px-4 py-3 rounded-2xl border-4 border-slate-900 text-xs font-black transition-all uppercase tracking-tighter ${
              report[field] === opt.value 
                ? `${opt.color} text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]` 
                : 'bg-white text-slate-400 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-redhouse-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-[40px] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        {/* RedHouse Header */}
        <div className="bg-white p-8 border-b-4 border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <BrandHeader />
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Relatório Mensal</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">RedHouse Music Class</p>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Bloco: Identificação */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">01</div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Identificação</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Calendar className="w-4 h-4" /> Mês de Referência
                </label>
                <input 
                  type="month"
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg outline-none focus:ring-8 focus:ring-red-100 transition-all"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Users className="w-4 h-4" /> Turma
                </label>
                <select 
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg outline-none focus:ring-8 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                  value={selectedClassroom}
                  onChange={e => setSelectedClassroom(e.target.value)}
                >
                  <option value="">Selecione a Turma</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <User className="w-4 h-4" /> Aluno Avaliado
                </label>
                <select 
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg outline-none focus:ring-8 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                  value={selectedStudent}
                  onChange={e => setSelectedStudent(e.target.value)}
                >
                  <option value="">Selecione o Aluno</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.instrument})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <Music className="w-4 h-4" /> Instrumento
                </label>
                <select 
                  className="w-full p-5 bg-slate-50 border-4 border-slate-900 rounded-2xl font-black text-lg outline-none focus:ring-8 focus:ring-red-100 transition-all appearance-none cursor-pointer"
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
            </div>
          </section>

          <hr className="border-4 border-slate-50" />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-10">
              {/* Bloco: Objetivos e Conteúdo */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">02</div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic">Conteúdo e Objetivos</h3>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Objetivos do mês</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg outline-none min-h-[100px] focus:ring-8 focus:ring-red-100 transition-all placeholder:text-slate-300"
                    placeholder="O que se pretendia alcançar..."
                    value={report.monthlyGoals}
                    onChange={e => setReport(prev => ({ ...prev, monthlyGoals: e.target.value }))}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Conteúdos trabalhados</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg outline-none min-h-[100px] focus:ring-8 focus:ring-red-100 transition-all placeholder:text-slate-300"
                    placeholder="Tópicos, músicas, exercícios..."
                    value={report.workedContent}
                    onChange={e => setReport(prev => ({ ...prev, workedContent: e.target.value }))}
                  />
                </div>
              </section>
              
              {/* Bloco: Avaliação */}
              <section className="p-8 bg-slate-50 rounded-[40px] border-4 border-slate-900 space-y-6">
                <h3 className="text-xl font-black uppercase text-redhouse-primary italic border-b-2 border-red-100 pb-2">Níveis de Desenvolvimento</h3>
                {renderLevelSelector('developmentLevel', 'Desenvolvimento Geral')}
                {renderLevelSelector('technique', 'Técnica e Habilidade')}
                {renderLevelSelector('participation', 'Participação e Engajamento')}
                {renderLevelSelector('concentration', 'Foco e Concentração')}
                {renderLevelSelector('interest', 'Interesse e Curiosidade')}
                {renderLevelSelector('peerRelationship', 'Relacionamento com Colegas')}
              </section>
            </div>

            <div className="space-y-10">
              {/* Bloco: Observações e Destaques */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm italic">03</div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic">Observações e Destaques</h3>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">5. Destaque do mês</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg outline-none min-h-[100px] focus:ring-8 focus:ring-red-100 transition-all placeholder:text-slate-300"
                    placeholder="Onde o aluno mais brilhou?"
                    value={report.monthlyHighlight}
                    onChange={e => setReport(prev => ({ ...prev, monthlyHighlight: e.target.value }))}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">6. Pontos de atenção</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg outline-none min-h-[100px] focus:ring-8 focus:ring-red-100 transition-all placeholder:text-slate-300"
                    placeholder="O que precisa de mais cuidado?"
                    value={report.attentionPoints}
                    onChange={e => setReport(prev => ({ ...prev, attentionPoints: e.target.value }))}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">7. Orientações próximo mês</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg outline-none min-h-[100px] focus:ring-8 focus:ring-red-100 transition-all placeholder:text-slate-300"
                    placeholder="Dicas para a prática em casa..."
                    value={report.nextMonthGuidance}
                    onChange={e => setReport(prev => ({ ...prev, nextMonthGuidance: e.target.value }))}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">8. Observações gerais</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-slate-900 rounded-3xl font-bold text-lg outline-none min-h-[100px] focus:ring-8 focus:ring-red-100 transition-all placeholder:text-slate-300"
                    placeholder="Notas adicionais..."
                    value={report.generalNotes}
                    onChange={e => setReport(prev => ({ ...prev, generalNotes: e.target.value }))}
                  />
                </div>
              </section>
            </div>
          </div>

          {/* AI Section */}
          <section className="bg-amber-50 p-10 rounded-[40px] border-4 border-redhouse-secondary space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-redhouse-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-slate-900 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-amber-900 uppercase italic leading-none">Versão para os Pais</h3>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">Gerado por Inteligência Artificial</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateParentReport}
                disabled={isGenerating}
                className="bg-redhouse-secondary text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 disabled:opacity-50 active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                {isGenerating ? "Gerando..." : "Gerar Resumo"}
              </motion.button>
            </div>
            <div className="bg-white p-8 rounded-3xl border-4 border-amber-200 text-slate-700 font-bold italic text-lg leading-relaxed shadow-inner">
              {parentFriendlyText || "Clique em 'Gerar Resumo' para criar um texto amigável baseado nos dados acima."}
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
                Finalizar Relatório Mensal
              </>
            )}
          </motion.button>
          
          <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              RedHouse Music Class – Parceria Escola-Família para o desenvolvimento integral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
