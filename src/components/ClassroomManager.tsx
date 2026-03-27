import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Calendar, 
  ChevronRight,
  Save,
  X,
  School
} from 'lucide-react';
import { Classroom } from '../types';
import { listClassrooms, addClassroom, updateClassroom } from '../services/dataService';

export default function ClassroomManager() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Partial<Classroom> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    setIsLoading(true);
    const data = await listClassrooms();
    setClassrooms(data);
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClassroom?.name) return;

    if (editingClassroom.id) {
      await updateClassroom(editingClassroom.id, editingClassroom);
    } else {
      await addClassroom({
        name: editingClassroom.name,
        schedule: editingClassroom.schedule || '',
        ageRange: editingClassroom.ageRange || '',
        teacherId: editingClassroom.teacherId || '',
        schoolId: editingClassroom.schoolId || 'cuiaba-01',
        active: true
      });
    }
    setIsEditing(false);
    setEditingClassroom(null);
    loadClassrooms();
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-redhouse-red"></div></div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* List Section */}
      <div className={`flex-1 space-y-4 ${isEditing ? 'hidden md:block' : 'block'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-redhouse-blue dark:text-white">Turmas</h2>
          <button 
            onClick={() => {
              setEditingClassroom({});
              setIsEditing(true);
            }}
            className="bg-redhouse-red text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {classrooms.map(cls => (
            <div 
              key={cls.id}
              className="bg-white dark:bg-slate-800 border-2 border-redhouse-blue dark:border-white/10 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,45,86,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-redhouse-blue dark:border-white/20">
                  <Users className="w-5 h-5 text-redhouse-red" />
                </div>
                <div>
                  <h3 className="font-bold text-redhouse-blue dark:text-white">{cls.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {cls.schedule || 'Sem horário'}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.ageRange || 'Todas idades'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingClassroom(cls);
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

      {/* Form Section (Master/Detail on MD+) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-slate-900 z-50 md:relative md:inset-auto md:w-96 md:bg-transparent md:z-0"
          >
            <div className="h-full bg-white dark:bg-slate-800 border-4 border-redhouse-blue dark:border-white/10 p-6 rounded-none md:rounded-2xl shadow-none md:shadow-[8px_8px_0px_0px_rgba(0,45,86,1)] dark:md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-redhouse-blue dark:text-white">
                  {editingClassroom?.id ? 'Editar Turma' : 'Nova Turma'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome da Turma</label>
                  <input 
                    type="text"
                    required
                    value={editingClassroom?.name || ''}
                    onChange={e => setEditingClassroom(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                    placeholder="Ex: Turma A - Kids"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Horário</label>
                  <input 
                    type="text"
                    value={editingClassroom?.schedule || ''}
                    onChange={e => setEditingClassroom(prev => ({ ...prev, schedule: e.target.value }))}
                    className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                    placeholder="Ex: Segunda 14:00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Faixa Etária</label>
                  <input 
                    type="text"
                    value={editingClassroom?.ageRange || ''}
                    onChange={e => setEditingClassroom(prev => ({ ...prev, ageRange: e.target.value }))}
                    className="w-full border-2 border-redhouse-blue dark:border-white/20 p-3 rounded-xl focus:ring-2 focus:ring-redhouse-red outline-none bg-white dark:bg-slate-700 dark:text-white"
                    placeholder="Ex: 5-7 anos"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-redhouse-blue text-white py-4 rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(196,18,48,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar Turma
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
