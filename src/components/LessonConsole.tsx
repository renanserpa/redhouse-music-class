import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Award, 
  Music, 
  ChevronRight,
  Save,
  Play,
  Pause,
  RotateCcw,
  FileText
} from 'lucide-react';
import { AppState, Student, Classroom, ActivityAttempt } from '../types';
import { listStudentsByClassroom, listClassrooms, saveActivityAttempt } from '../services/dataService';
import BrandHeader from './BrandHeader';

interface LessonConsoleProps {
  state: AppState;
  onFinishLesson: (attendance: Record<string, boolean>) => void;
}

export default function LessonConsole({ state, onFinishLesson }: LessonConsoleProps) {
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClassrooms = async () => {
      const cls = await listClassrooms();
      setClassrooms(cls);
      setIsLoading(false);
    };
    loadClassrooms();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      const loadStudents = async () => {
        const stds = await listStudentsByClassroom(selectedClassroom);
        setStudents(stds);
        const initialAttendance: Record<string, boolean> = {};
        stds.forEach(s => initialAttendance[s.id] = true);
        setAttendance(initialAttendance);
      };
      loadStudents();
    }
  }, [selectedClassroom]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isLessonActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLessonActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleQuickAction = async (studentId: string, type: 'xp' | 'emoji', value: number | string) => {
    const attempt: ActivityAttempt = {
      id: `att-${Date.now()}-${studentId}`,
      studentId,
      classroomId: selectedClassroom,
      date: new Date().toISOString(),
      activityId: 'quick-action',
      result: type === 'emoji' ? 'sucesso' : 'sucesso',
      score: type === 'xp' ? Number(value) : 0,
      notes: `Quick action: ${type} - ${value}`
    };
    await saveActivityAttempt(attempt);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41230]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] pb-24 lg:pb-0">
      <BrandHeader />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {!selectedClassroom ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-[#002D56] mb-4" />
            <h2 className="text-2xl font-bold text-[#002D56] mb-6">Selecione uma Turma</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {classrooms.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassroom(cls.id)}
                  className="bg-white border-2 border-[#002D56] p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,45,86,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-left"
                >
                  <h3 className="font-bold text-lg text-[#002D56]">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.schedule}</p>
                  <p className="text-xs text-gray-500 mt-2">{cls.ageRange}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Lesson Header */}
            <div className="bg-[#002D56] text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-[#C41230]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Aula Ativa: {classrooms.find(c => c.id === selectedClassroom)?.name}</h2>
                  <p className="text-white/70 font-mono text-2xl">{formatTime(timer)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsLessonActive(!isLessonActive)}
                  className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${isLessonActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isLessonActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isLessonActive ? 'Pausar' : 'Iniciar'}
                </button>
                <button 
                  onClick={() => onFinishLesson(attendance)}
                  className="bg-[#C41230] hover:bg-[#A00F28] px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Finalizar
                </button>
              </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map(student => (
                <motion.div
                  key={student.id}
                  layout
                  className={`bg-white border-2 p-4 rounded-xl transition-all ${attendance[student.id] ? 'border-[#002D56] shadow-[4px_4px_0px_0px_rgba(0,45,86,1)]' : 'border-gray-300 opacity-60'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center border-2 border-[#002D56]">
                        <Music className="w-6 h-6 text-[#C41230]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002D56]">{student.name}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{student.instrument}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleAttendance(student.id)}
                      className={`p-2 rounded-full transition-colors ${attendance[student.id] ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      {attendance[student.id] ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </button>
                  </div>

                  {attendance[student.id] && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleQuickAction(student.id, 'xp', 5)}
                          className="flex-1 bg-amber-100 text-amber-800 py-2 rounded-lg font-bold text-sm hover:bg-amber-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Star className="w-4 h-4" /> +5 XP
                        </button>
                        <button 
                          onClick={() => handleQuickAction(student.id, 'xp', 10)}
                          className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <Award className="w-4 h-4" /> +10 XP
                        </button>
                      </div>
                      <div className="flex justify-between gap-2">
                        {['🌟', '🔥', '🎸', '🎯'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleQuickAction(student.id, 'emoji', emoji)}
                            className="flex-1 bg-[#f5f5f0] py-2 rounded-lg text-xl hover:scale-110 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav (Simulated for this component) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#002D56] p-2 flex justify-around items-center z-50">
        <button className="flex flex-col items-center p-2 text-[#002D56]">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-bold">Turma</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-400">
          <Music className="w-6 h-6" />
          <span className="text-[10px] font-bold">Metrônomo</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-400">
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-bold">Notas</span>
        </button>
      </div>
    </div>
  );
}
