import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Clock, 
  Music, 
  StickyNote, 
  Save,
  Maximize2,
  Minimize2
} from 'lucide-react';
import Metronome from './Metronome';
import TunerModule from './TunerModule';

interface FloatingToolbarProps {
  isVisible: boolean;
}

export default function FloatingToolbar({ isVisible }: FloatingToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'metronome' | 'tuner' | 'notes' | null>(null);
  const [note, setNote] = useState(() => localStorage.getItem('rh_quick_note') || '');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveTool(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const saveNote = () => {
    localStorage.setItem('rh_quick_note', note);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto bg-white dark:bg-slate-900 border-4 border-redhouse-primary rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden w-[320px] md:w-[400px]"
          >
            {/* Header */}
            <div className="bg-redhouse-primary p-4 flex justify-between items-center text-white">
              <h3 className="font-black uppercase italic tracking-widest text-sm">Ferramentas</h3>
              <button onClick={() => { setIsOpen(false); setActiveTool(null); }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!activeTool ? (
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setActiveTool('metronome')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-12 h-12 bg-redhouse-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-redhouse-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase italic text-slate-500">Metrônomo</span>
                  </button>

                  <button 
                    onClick={() => setActiveTool('tuner')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-12 h-12 bg-redhouse-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Music className="w-6 h-6 text-redhouse-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase italic text-slate-500">Afinador</span>
                  </button>

                  <button 
                    onClick={() => setActiveTool('notes')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-12 h-12 bg-redhouse-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <StickyNote className="w-6 h-6 text-redhouse-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase italic text-slate-500">Notas</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button 
                    onClick={() => setActiveTool(null)}
                    className="text-[10px] font-black text-redhouse-primary uppercase italic flex items-center gap-1 mb-2"
                  >
                    ← Voltar
                  </button>

                  {activeTool === 'metronome' && (
                    <div className="scale-90 origin-top">
                      <Metronome />
                    </div>
                  )}

                  {activeTool === 'tuner' && (
                    <div className="scale-90 origin-top">
                      <TunerModule />
                    </div>
                  )}

                  {activeTool === 'notes' && (
                    <div className="space-y-4">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Escreva uma nota rápida para a aula..."
                        className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-redhouse-primary outline-none text-sm font-medium resize-none"
                      />
                      <button
                        onClick={saveNote}
                        className="w-full bg-redhouse-primary text-white py-3 rounded-xl font-black uppercase italic text-xs flex items-center justify-center gap-2 shadow-lg shadow-redhouse-primary/30"
                      >
                        <Save className="w-4 h-4" /> Salvar Nota
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${
          isOpen ? 'bg-slate-800 rotate-45' : 'bg-redhouse-primary'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
      </motion.button>
    </div>
  );
}
