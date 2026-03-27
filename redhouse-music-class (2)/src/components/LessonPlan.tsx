/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Music, 
  Zap, 
  Play, 
  CheckCircle2,
  Info,
  RotateCw,
  Gamepad2
} from 'lucide-react';
import { ACTIVITIES, PEDAGOGICAL_PATTERNS } from '../lib/pedagogy';
import { audio } from '../lib/audio';
import { Tab, BlockType, Activity } from '../types';

interface LessonBlock {
  id: string;
  type: BlockType;
  title: string;
  description: string;
  selectedActivities: string[];
}

interface LessonPlanProps {
  setActiveTab: (tab: Tab) => void;
}

export default function LessonPlan({ setActiveTab }: LessonPlanProps) {
  const [blocks, setBlocks] = useState<LessonBlock[]>([
    { id: '1', type: 'aquecimento', title: 'Aquecimento', description: '', selectedActivities: [] },
    { id: '2', type: 'revisao', title: 'Revisão', description: '', selectedActivities: [] },
    { id: '3', type: 'novo_conteudo', title: 'Novo Conteúdo', description: '', selectedActivities: [] },
    { id: '4', type: 'jogo', title: 'Jogo / Atividade', description: '', selectedActivities: [] },
    { id: '5', type: 'fechamento', title: 'Fechamento', description: '', selectedActivities: [] },
  ]);

  const [expandedBlock, setExpandedBlock] = useState<string | null>('1');
  const [isTecherMode, setIsTeacherMode] = useState(true);

  const updateBlock = (id: string, updates: Partial<LessonBlock>) => {
    setBlocks(prev => prev.map(block => block.id === id ? { ...block, ...updates } : block));
  };

  const handleActivitySelect = (blockId: string, activity: Activity) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const isSelected = block.selectedActivities.includes(activity.id);
    let newSelected: string[];
    let newDescription = block.description;

    if (isSelected) {
      newSelected = block.selectedActivities.filter(id => id !== activity.id);
    } else {
      newSelected = [...block.selectedActivities, activity.id];
      if (!newDescription.includes(activity.description)) {
        newDescription = newDescription ? `${newDescription}\n\n${activity.description}` : activity.description;
      }
    }

    updateBlock(blockId, { 
      selectedActivities: newSelected,
      description: newDescription
    });
  };

  const getBlockStyles = (type: BlockType) => {
    switch (type) {
      case 'aquecimento': return { icon: <Zap />, color: 'var(--color-pedagogy-orange)', bg: 'bg-pedagogy-orange' };
      case 'revisao': return { icon: <RotateCw />, color: 'var(--color-pedagogy-blue)', bg: 'bg-pedagogy-blue' };
      case 'novo_conteudo': return { icon: <BookOpen />, color: 'var(--color-pedagogy-purple)', bg: 'bg-pedagogy-purple' };
      case 'pratica': return { icon: <Music />, color: 'var(--color-pedagogy-green)', bg: 'bg-pedagogy-green' };
      case 'jogo': return { icon: <Gamepad2 />, color: 'var(--color-pedagogy-red)', bg: 'bg-pedagogy-red' };
      case 'fechamento': return { icon: <CheckCircle2 />, color: 'var(--color-redhouse-muted)', bg: 'bg-redhouse-muted' };
      default: return { icon: <Music />, color: 'var(--color-pedagogy-orange)', bg: 'bg-pedagogy-orange' };
    }
  };

  return (
    <div className="space-y-12">
      {/* HUD Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-pedagogy-purple rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pedagogy-purple/30 -rotate-3 border border-white/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-redhouse-text uppercase italic leading-none tracking-tighter">Mission Control</h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-pedagogy-purple/10 text-pedagogy-purple rounded-full border border-pedagogy-purple/20">
                <div className="w-2 h-2 bg-pedagogy-purple rounded-full shadow-[0_0_8px_var(--color-pedagogy-purple)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Roteiro Pedagógico: Ativo</span>
              </div>
              <button 
                onClick={() => setIsTeacherMode(!isTecherMode)}
                className={`px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
                  isTecherMode 
                    ? 'bg-redhouse-accent text-white shadow-[0_0_15px_rgba(32,80,255,0.4)]' 
                    : 'bg-white/5 text-redhouse-muted border border-white/10 hover:border-redhouse-accent/50'
                }`}
              >
                {isTecherMode ? 'Sensor: Mestre' : 'Modo Professor'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Vertical Timeline Mission Control */}
      <div className="grid grid-cols-1 gap-8 relative">
        {/* Connection Line */}
        <div className="absolute left-10 top-20 bottom-20 w-1 bg-white/5 –z-10" />

        {blocks.map((block, idx) => {
          const styles = getBlockStyles(block.type);
          const isExpanded = expandedBlock === block.id;

          return (
            <div key={block.id} className="relative group">
              <div className="flex gap-8">
                {/* Timeline Node */}
                <div className="relative z-10 shrink-0">
                  <motion.button 
                    onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                    animate={{ 
                      scale: isExpanded ? 1.2 : 1,
                      boxShadow: isExpanded ? `0 0 30px ${styles.color}44` : '0 0 0 transparent'
                    }}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      isExpanded ? 'border-white bg-white/10' : 'border-white/5 backdrop-blur-md hover:border-white/20'
                    }`}
                  >
                    <div className={isExpanded ? '' : 'opacity-40 group-hover:opacity-100 transition-opacity'} style={{ color: styles.color }}>
                      {styles.icon}
                    </div>
                  </motion.button>
                  {idx < blocks.length - 1 && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-px h-8 bg-white/10" />
                  )}
                </div>

                {/* Block Content Card */}
                <div className={`flex-1 glass-card border-white/5 bg-white/2 transition-all overflow-hidden ${isExpanded ? 'ring-2 ring-white/10 shadow-2xl bg-white/5' : 'hover:bg-white/3'}`}>
                  <button 
                    onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                    className="w-full p-8 flex items-center justify-between text-left"
                  >
                    <div>
                      <h4 className="text-2xl font-black text-redhouse-text uppercase italic tracking-tight">{block.title}</h4>
                      <p className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em] mt-1" style={{ color: isExpanded ? styles.color : undefined }}>
                        Status: {isExpanded ? 'Em Execução' : 'Aguardando'} • {block.type.replace('_', ' ')}
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp className="text-redhouse-muted" /> : <ChevronDown className="text-redhouse-muted" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="px-8 pb-8 space-y-10 border-t border-white/5 mt-4 pt-8"
                      >
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Catalog Side */}
                            <div className="space-y-8">
                              <div>
                                <h5 className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.4em] mb-6 italic">Database: Biblioteca de Atividades</h5>
                                <div className="grid grid-cols-1 gap-3">
                                  {ACTIVITIES.filter(a => a.blockType === block.type).map(activity => {
                                    const isSelected = block.selectedActivities.includes(activity.id);
                                    return (
                                      <button
                                        key={activity.id}
                                        onClick={() => handleActivitySelect(block.id, activity)}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left group/item relative overflow-hidden ${
                                          isSelected
                                            ? 'bg-white/10 border-white/20 shadow-lg'
                                            : 'bg-white/2 border-white/5 hover:border-white/10 opacity-60 hover:opacity-100'
                                        }`}
                                      >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 transition-all ${isSelected ? 'bg-white text-slate-900 shadow-[0_0_15px_white]' : 'bg-white/5'}`}>
                                          {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                          <div className={`font-black text-sm uppercase italic transition-all ${isSelected ? 'text-redhouse-text' : 'text-redhouse-muted'}`}>{activity.title}</div>
                                          <div className={`text-[10px] font-bold mt-1 leading-relaxed ${isSelected ? 'text-redhouse-muted' : 'text-redhouse-soft-muted'}`}>
                                            {activity.description}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.4em] mb-4 italic">Audio Patterns: Sugestões</h5>
                                <div className="flex flex-wrap gap-3">
                                  {PEDAGOGICAL_PATTERNS.filter(p => p.uso === block.type).map(pattern => (
                                    <div 
                                      key={pattern.patternId}
                                      className="glass-card border-white/5 rounded-xl p-4 flex items-center gap-4 bg-white/2 hover:border-white/20 transition-all group relative ring-1 ring-white/5"
                                    >
                                      <button 
                                        onClick={() => audio.playPattern(pattern.cores)}
                                        className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/10 hover:border-white/20 transition-all"
                                      >
                                        <Play className="w-4 h-4 fill-white translate-x-0.5" />
                                      </button>
                                      <div className="flex -space-x-1.5">
                                        {pattern.cores.slice(0, 3).map((cor, i) => (
                                          <div 
                                            key={i} 
                                            className="w-4 h-4 rounded-full border-2 border-slate-900 shadow-xl"
                                            style={{ backgroundColor: getHexColor(cor) }}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-[10px] font-black text-redhouse-text uppercase italic">{pattern.nomePedagogico}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Editor Side */}
                            <div className="space-y-8 glass-card border-white/5 p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl -z-10" style={{ backgroundColor: styles.color }} />
                              <h5 className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.4em] mb-6 italic italic">Block Console: Editor de Roteiro</h5>
                              
                              <div className="space-y-6">
                                <div>
                                  <label className="block text-[8px] font-black text-redhouse-muted uppercase tracking-widest mb-3 italic">Identificador de Voo</label>
                                  <input 
                                    type="text"
                                    value={block.title}
                                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                    className="w-full p-5 bg-white/2 border border-white/10 rounded-2xl font-black text-redhouse-text focus:border-white/20 transition-all outline-none italic placeholder:text-white/10"
                                    placeholder="Ex: Warming up the engines..."
                                  />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-black text-redhouse-muted uppercase tracking-widest mb-3 italic">Roteiro de Transmissão</label>
                                  <textarea 
                                    value={block.description}
                                    onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                                    className="w-full h-64 p-5 bg-white/2 border border-white/10 rounded-2xl font-bold text-redhouse-text focus:border-white/20 transition-all resize-none outline-none leading-relaxed"
                                    placeholder="Descreva as instruções da missão..."
                                  />
                                </div>
                              </div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar Footer */}
      <footer className="mt-16 glass-card p-10 border-white/10 bg-pedagogy-purple/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden ring-1 ring-pedagogy-purple/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pedagogy-purple/10 blur-[120px] -z-10" />
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white text-slate-900 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 shrink-0">
            <Play className="w-10 h-10 fill-slate-900 translate-x-1" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-redhouse-text uppercase italic leading-none">Ready for Ignition</h4>
            <p className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.3em] mt-2 italic">Aperte para iniciar a sequência de aula guiada</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none glass-card bg-white text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl active:scale-95 border-none">
            INICIAR AULA
          </button>
          <button 
            onClick={() => setActiveTab('lesson-report')}
            className="flex-1 md:flex-none glass-card bg-transparent text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/5 transition-all shadow-xl active:scale-95 border border-white/10"
          >
            RELATÓRIO
          </button>
        </div>
      </footer>
    </div>
  );
}

function getHexColor(cor: string) {
  const map: Record<string, string> = {
    'vermelho': 'var(--color-pedagogy-red)',
    'verde': 'var(--color-pedagogy-green)',
    'preto': '#000000',
    'azul': 'var(--color-pedagogy-blue)',
    'branco': '#ffffff',
    'amarelo': 'var(--color-pedagogy-orange)',
    'roxo': 'var(--color-pedagogy-purple)'
  };
  return map[cor] || '#ccc';
}
