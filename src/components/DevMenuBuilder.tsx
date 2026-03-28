import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Book, 
  Music, 
  Gamepad2, 
  Zap, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  Edit2, 
  Trash2, 
  Plus, 
  RefreshCcw,
  Check,
  X,
  Layout,
  Layers,
  FileText
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { DynamicNavConfig, NavModule, NavSubmodule } from '../types';

const ICON_OPTIONS = [
  { name: 'Home', icon: Home },
  { name: 'Book', icon: Book },
  { name: 'Music', icon: Music },
  { name: 'Gamepad', icon: Gamepad2 },
  { name: 'Zap', icon: Zap },
  { name: 'Settings', icon: Settings },
  { name: 'FileText', icon: FileText },
  { name: 'Layers', icon: Layers }
];

export default function DevMenuBuilder() {
  const { navConfig, updateNavConfig, resetNavConfig } = useAppContext();
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingSubmoduleId, setEditingSubmoduleId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const newModules = [...navConfig.modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;
    
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    updateNavConfig({ ...navConfig, modules: newModules });
  };

  const handleUpdateModuleLabel = (moduleId: string) => {
    const newModules = navConfig.modules.map(m => 
      m.id === moduleId ? { ...m, label: tempLabel } : m
    );
    updateNavConfig({ ...navConfig, modules: newModules });
    setEditingModuleId(null);
  };

  const handleUpdateModuleIcon = (moduleId: string, icon: string) => {
    const newModules = navConfig.modules.map(m => 
      m.id === moduleId ? { ...m, icon } : m
    );
    updateNavConfig({ ...navConfig, modules: newModules });
  };

  const handleUpdateSubmoduleLabel = (moduleId: string, submoduleId: string) => {
    const newModules = navConfig.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          children: m.children.map(s => 
            s.id === submoduleId ? { ...s, label: tempLabel } : s
          )
        };
      }
      return m;
    });
    updateNavConfig({ ...navConfig, modules: newModules });
    setEditingSubmoduleId(null);
  };

  const handleRemovePageFromSubmodule = (moduleId: string, submoduleId: string, pageId: string) => {
    const newModules = navConfig.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          children: m.children.map(s => 
            s.id === submoduleId ? { ...s, pages: s.pages.filter(p => p !== pageId) } : s
          )
        };
      }
      return m;
    });
    updateNavConfig({ ...navConfig, modules: newModules });
  };

  const handleAddPageToSubmodule = (moduleId: string, submoduleId: string, pageId: string) => {
    const newModules = navConfig.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          children: m.children.map(s => {
            if (s.id === submoduleId && !s.pages.includes(pageId)) {
              return { ...s, pages: [...s.pages, pageId] };
            }
            return s;
          })
        };
      }
      return m;
    });
    updateNavConfig({ ...navConfig, modules: newModules });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-redhouse-text uppercase italic tracking-tight flex items-center gap-2">
            <Layout className="w-6 h-6 text-redhouse-primary" />
            Menu Builder
          </h2>
          <p className="text-xs text-redhouse-muted font-bold uppercase tracking-widest mt-1">
            Gerencie a estrutura de navegação do sistema
          </p>
        </div>
        <button 
          onClick={resetNavConfig}
          className="flex items-center gap-2 px-4 py-2 bg-redhouse-muted/10 hover:bg-redhouse-primary/20 text-redhouse-muted hover:text-redhouse-primary rounded-xl font-black text-[10px] uppercase transition-all active:scale-95"
        >
          <RefreshCcw className="w-3 h-3" />
          Resetar para Padrão
        </button>
      </div>

      <div className="space-y-4">
        {navConfig.modules.map((module, mIndex) => (
          <motion.div 
            key={module.id}
            layout
            className="glass-card p-6 border-2 border-white/5 bg-white/5 backdrop-blur-xl relative group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleMoveModule(mIndex, 'up')}
                    disabled={mIndex === 0}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleMoveModule(mIndex, 'down')}
                    disabled={mIndex === navConfig.modules.length - 1}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-12 h-12 bg-redhouse-primary/20 rounded-2xl flex items-center justify-center text-redhouse-primary relative group/icon">
                  {React.createElement(ICON_OPTIONS.find(i => i.name === module.icon)?.icon || Layers, { className: "w-6 h-6" })}
                  
                  {/* Icon Picker Dropdown */}
                  <div className="absolute top-full left-0 mt-2 p-2 bg-redhouse-card border border-white/10 rounded-xl hidden group-hover/icon:grid grid-cols-4 gap-1 z-50 shadow-2xl backdrop-blur-2xl">
                    {ICON_OPTIONS.map(opt => (
                      <button
                        key={opt.name}
                        onClick={() => handleUpdateModuleIcon(module.id, opt.name)}
                        className={`p-2 rounded-lg hover:bg-redhouse-primary/20 transition-colors ${module.icon === opt.name ? 'text-redhouse-primary' : 'text-redhouse-muted'}`}
                      >
                        <opt.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {editingModuleId === module.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={tempLabel}
                        onChange={(e) => setTempLabel(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm font-black uppercase italic"
                        autoFocus
                      />
                      <button onClick={() => handleUpdateModuleLabel(module.id)} className="p-1 text-green-500 hover:bg-green-500/10 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingModuleId(null)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-redhouse-text uppercase italic">{module.label}</h3>
                      <button 
                        onClick={() => {
                          setEditingModuleId(module.id);
                          setTempLabel(module.label);
                        }}
                        className="p-1 text-redhouse-muted hover:text-redhouse-primary opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] font-black text-redhouse-muted uppercase tracking-widest mt-0.5">ID: {module.id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newModule = { 
                      ...module, 
                      id: `module-${Date.now()}`, 
                      label: `${module.label} (Copy)` 
                    };
                    const newModules = [...navConfig.modules];
                    newModules.splice(mIndex + 1, 0, newModule);
                    updateNavConfig({ ...navConfig, modules: newModules });
                  }}
                  title="Clonar Módulo"
                  className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-colors border border-emerald-500/20 flex items-center gap-2 font-black text-[8px] uppercase italic"
                >
                  <PlusCircle className="w-3 h-3" />
                  Clonar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir o módulo "${module.label}"?`)) {
                      const newModules = navConfig.modules.filter(m => m.id !== module.id);
                      updateNavConfig({ ...navConfig, modules: newModules });
                    }
                  }}
                  title="Excluir Módulo"
                  className="p-2 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20 flex items-center gap-2 font-black text-[8px] uppercase italic"
                >
                  <Trash2 className="w-3 h-3" />
                  Excluir
                </button>
              </div>
            </div>

            <div className="ml-16 space-y-6">
              {module.children.map((submodule) => (
                <div key={submodule.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    {editingSubmoduleId === submodule.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={tempLabel}
                          onChange={(e) => setTempLabel(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] font-black uppercase italic"
                          autoFocus
                        />
                        <button onClick={() => handleUpdateSubmoduleLabel(module.id, submodule.id)} className="p-1 text-green-500 hover:bg-green-500/10 rounded">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={() => setEditingSubmoduleId(null)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="text-[10px] font-black text-redhouse-muted uppercase tracking-[0.2em] italic">{submodule.label}</h4>
                        <button 
                          onClick={() => {
                            setEditingSubmoduleId(submodule.id);
                            setTempLabel(submodule.label);
                          }}
                          className="p-1 text-redhouse-muted/50 hover:text-redhouse-primary opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {submodule.pages.map((pId) => {
                      const page = navConfig.pages[pId];
                      return (
                        <div 
                          key={pId}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl group/tag"
                        >
                          <span className="text-[10px] font-bold text-redhouse-text">{page?.label || pId}</span>
                          <button 
                            onClick={() => handleRemovePageFromSubmodule(module.id, submodule.id, pId)}
                            className="text-redhouse-muted hover:text-redhouse-primary transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                    
                    {/* Add Page Button/Dropdown (Simplified for now) */}
                    <div className="relative group/add">
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-redhouse-primary/10 border border-redhouse-primary/20 text-redhouse-primary rounded-xl text-[10px] font-black uppercase italic hover:bg-redhouse-primary hover:text-white transition-all">
                        <Plus className="w-3 h-3" /> Adicionar Página
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto bg-redhouse-card border border-white/10 rounded-xl hidden group-hover/add:block z-[60] shadow-2xl backdrop-blur-2xl no-scrollbar">
                        {Object.values(navConfig.pages)
                          .filter(p => !submodule.pages.includes(p.id))
                          .map(page => (
                            <button
                              key={page.id}
                              onClick={() => handleAddPageToSubmodule(module.id, submodule.id, page.id)}
                              className="w-full text-left px-4 py-2 text-[10px] font-bold text-redhouse-text hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                              {page.label}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
