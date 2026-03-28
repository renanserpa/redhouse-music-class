import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Coins, Check, Lock, Star, Sparkles } from 'lucide-react';
import { AppState } from '../types';
import { SKINS, AvatarSkin } from '../constants/skins';
import { audio } from '../lib/audio';
import { haptics } from '../lib/haptics';

interface AvatarShopProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function AvatarShop({ state, setState }: AvatarShopProps) {
  const handleBuySkin = (skin: AvatarSkin) => {
    if (state.coins < skin.price) {
      audio.playError();
      haptics.heavy();
      return;
    }

    audio.playSuccess();
    haptics.medium();
    
    setState(prev => ({
      ...prev,
      coins: prev.coins - skin.price,
      inventory: [...prev.inventory, skin.id]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-yellow-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-yellow-500/30 rotate-3">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Loja de Skins</h2>
            <p className="text-slate-500 font-bold uppercase italic text-sm">Gaste seus GMC_Credits com estilo! 🎸✨</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border-b-4 border-yellow-500 rounded-3xl p-6 flex items-center gap-6 shadow-xl min-w-[200px]">
          <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
            <Coins className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase italic">Saldo Atual</p>
            <p className="text-4xl font-black text-yellow-500 tracking-tighter">{state.coins}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {SKINS.map(skin => {
          const isOwned = state.inventory.includes(skin.id);
          const canAfford = state.coins >= skin.price;
          
          return (
            <motion.div
              key={skin.id}
              whileHover={{ y: -5 }}
              className={`relative group p-8 rounded-[3rem] border-b-8 transition-all flex flex-col items-center gap-6 ${
                isOwned 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/50 grayscale opacity-60' 
                  : 'bg-white dark:bg-slate-900 border-yellow-500 shadow-xl'
              }`}
            >
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner shrink-0 transition-transform group-hover:rotate-12 ${skin.color}`}>
                <skin.icon className="w-12 h-12 text-white" />
              </div>

              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase italic px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {skin.type === 'head' ? 'Cabeça' : skin.type === 'body' ? 'Corpo' : skin.type === 'instrument' ? 'Instrumento' : 'Fundo'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-tight">
                  {skin.name}
                </h3>
              </div>

              <div className="mt-auto w-full">
                {isOwned ? (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase italic text-sm flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Já Adquirido
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuySkin(skin)}
                    disabled={!canAfford}
                    className={`w-full py-4 rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-2 transition-all ${
                      canAfford 
                        ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 hover:scale-105 active:scale-95' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Coins className="w-5 h-5" /> {skin.price} GMC
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
