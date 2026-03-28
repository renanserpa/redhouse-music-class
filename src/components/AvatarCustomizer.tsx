import React from 'react';
import { motion } from 'motion/react';
import { User, Check, Sparkles } from 'lucide-react';
import { AppState } from '../types';
import { SKINS, AvatarSkin } from '../constants/skins';
import { audio } from '../lib/audio';
import { haptics } from '../lib/haptics';

interface AvatarCustomizerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function AvatarCustomizer({ state, setState }: AvatarCustomizerProps) {
  const ownedSkins = SKINS.filter(skin => state.inventory.includes(skin.id));
  
  const handleSelectSkin = (skin: AvatarSkin) => {
    audio.playClick();
    haptics.light();
    setState(prev => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        [skin.type]: skin.id
      }
    }));
  };

  const currentSkins = {
    head: SKINS.find(s => s.id === state.avatar.head),
    body: SKINS.find(s => s.id === state.avatar.body),
    instrument: SKINS.find(s => s.id === state.avatar.instrument),
    background: SKINS.find(s => s.id === state.avatar.background),
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Preview Section */}
        <div className="lg:w-1/3">
          <div className={`relative aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl ${currentSkins.background?.color || 'bg-slate-800'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              {/* Avatar Body */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className={`w-48 h-48 rounded-full flex items-center justify-center relative ${currentSkins.body?.color || 'bg-red-600'}`}
              >
                <currentSkins.body.icon className="w-24 h-24 text-white/20" />
                
                {/* Avatar Head */}
                <div className={`absolute -top-12 w-32 h-32 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${currentSkins.head?.color || 'bg-slate-500'}`}>
                  <currentSkins.head.icon className="w-16 h-16 text-white" />
                </div>

                {/* Avatar Instrument */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center rotate-12 ${currentSkins.instrument?.color || 'bg-amber-700'}`}>
                  <currentSkins.instrument.icon className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <h3 className="text-white font-black uppercase italic tracking-tighter text-center">
                {state.user?.name || 'Seu Avatar'}
              </h3>
            </div>
          </div>
        </div>

        {/* Customization Section */}
        <div className="lg:w-2/3 space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-redhouse-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Personalizar</h2>
              <p className="text-slate-500 font-bold uppercase italic text-sm">Monte seu visual de Rockstar! 🎸✨</p>
            </div>
          </div>

          {(['head', 'body', 'instrument', 'background'] as const).map(type => (
            <div key={type} className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">{type === 'head' ? 'Cabeça' : type === 'body' ? 'Corpo' : type === 'instrument' ? 'Instrumento' : 'Fundo'}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {ownedSkins.filter(s => s.type === type).map(skin => {
                  const isSelected = state.avatar[type] === skin.id;
                  return (
                    <button
                      key={skin.id}
                      onClick={() => handleSelectSkin(skin)}
                      className={`relative group p-4 rounded-2xl border-b-4 transition-all ${
                        isSelected 
                          ? 'bg-redhouse-primary border-redhouse-primary/50 text-white shadow-lg scale-105' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-redhouse-primary/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${skin.color}`}>
                        <skin.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-[10px] font-black uppercase italic text-center truncate">{skin.name}</p>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-4 h-4 text-redhouse-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
