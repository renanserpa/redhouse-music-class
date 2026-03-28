import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Music, 
  ChevronRight,
  Save,
  X,
  User,
  Search
} from 'lucide-react';
import { Student, Classroom, Instrument } from '../types';
import { listStudentsByClassroom, listClassrooms, addStudent, updateStudent } from '../services/dataService';

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const cls = await listClassrooms();
    setClassrooms(cls);
    
    // Load all students (in a real app we'd have listAllStudents)
    let allStudents: Student[] = [];
    for (const c of cls) {
      const stds = await listStudentsByClassroom(c.id);
      allStudents = [...allStudents, ...stds];
    }
    setStudents(allStudents);
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent?.name || !editingStudent?.classroomId) return;

    if (editingStudent.id) {
      await updateStudent(editingStudent.id, editingStudent);
    } else {
      await addStudent({
        name: editingStudent.name,
        age: editingStudent.age || 0,
        instrument: (editingStudent.instrument as Instrument) || 'guitar',
        classroomId: editingStudent.classroomId,
        schoolId: editingStudent.schoolId || 'cuiaba-01',
        xp: 0,
        coins: 0,
        notes: editingStudent.notes || ''
      });
    }
    setIsEditing(false);
    setEditingStudent(null);
    loadData();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C41230]"></div></div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* List Section */}
      <div className={`flex-1 space-y-4 ${isEditing ? 'hidden md:block' : 'block'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-redhouse-blue dark:text-white">Alunos</h2>
          <button 
            onClick={() => {
              setEditingStudent({ instrument: 'guitar', classroomId: classrooms[0]?.id });
              setIsEditing(true);
            }}
            className="bg-redhouse-red text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-redhouse-blue dark:border-white/20 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map(student => (
            <div 
              key={student.id}
              className="bg-white dark:bg-slate-800 border-2 border-redhouse-blue dark:border-white/10 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,45,86,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-redhouse-blue dark:border-white/20">
                  <User className="w-5 h-5 text-redhouse-red" />
                </div>
                <div>
                  <h3 className="font-bold text-redhouse-blue dark:text-white">{student.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1 uppercase tracking-wider font-bold text-[10px]">
                      <Music className="w-3 h-3" /> {student.instrument}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {classrooms.find(c => c.id === student.classroomId)?.name}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingStudent(student);
                  setIsEditing(true);
                }}
                className="p-2 text-gray-400 hover:text-redhouse-blue dark:hover:text-white transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-slate-900 z-50 md:relative md:inset-auto md:w-96 md:bg-transparent md:z-0"
          >
            <div className="h-full bg-white dark:bg-slate-800 border-4 border-redhouse-blue dark:border-white/10 p-6 rounded-none md:rounded-2xl shadow-none md:shadow-[8px_8px_0px_0px_rgba(0,45,86,1)] dark:md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-redhouse-blue dark:text-white">
                  {editingStudent?.id ? 'Editar Aluno' : 'Novo Aluno'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={editingStudent?.name || ''}
                    onChange={e => setEditingStudent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Idade</label>
                    <input 
                      type="number"
                      value={editingStudent?.age || ''}
                      onChange={e => setEditingStudent(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Instrumento</label>
                    <select 
                      value={editingStudent?.instrument || 'guitar'}
                      onChange={e => setEditingStudent(prev => ({ ...prev, instrument: e.target.value as Instrument }))}
                      className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                    >
                      <option value="guitar">Violão</option>
                      <option value="ukulele">Ukulele</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Turma</label>
                  <select 
                    required
                    value={editingStudent?.classroomId || ''}
                    onChange={e => setEditingStudent(prev => ({ ...prev, classroomId: e.target.value }))}
                    className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Selecionar Turma</option>
                    {classrooms.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Notas / Observações</label>
                  <textarea 
                    value={editingStudent?.notes || ''}
                    onChange={e => setEditingStudent(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none h-24 resize-none bg-white dark:bg-slate-700 dark:text-white"
                    placeholder="Informações pedagógicas relevantes..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-redhouse-blue text-white py-4 rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(196,18,48,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar Aluno
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
