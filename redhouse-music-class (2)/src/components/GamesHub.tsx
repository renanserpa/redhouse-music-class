/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Guitar, 
  Ear, 
  Zap, 
  Volume2, 
  Music,
  Trophy,
  Star
} from 'lucide-react';
import { Tab } from '../types';

interface GamesHubProps {
  setActiveTab: (tab: Tab) => void;
}

export default function GamesHub({ setActiveTab }: GamesHubProps) {
  const games = [
    { 
      id: 'anatomy', 
      title: 'Anatomia do Violão', 
      desc: 'Aprenda as partes do instrumento de forma lúdica.', 
      icon: Guitar, 
      color: 'bg-orange-500',
      xp: 50
    },
    { 
      id: 'ear-training', 
      title: 'Detetive de Ouvido', 
      desc: 'Treine sua percepção musical identificando notas.', 
      icon: Ear, 
      color: 'bg-blue-500',
      xp: 100
    },
    { 
      id: 'rhythm-invaders', 
      title: 'Rhythm Invaders', 
      desc: 'Defenda a galáxia acertando o tempo das notas!', 
      icon: Gamepad2, 
      color: 'bg-red-500',
      xp: 150
    },
    { 
      id: 'echo-game', 
      title: 'Jogo do Eco', 
      desc: 'Repita os padrões rítmicos e melódicos.', 
      icon: Volume2, 
      color: 'bg-cyan-500',
      xp: 80
    },
    { 
      id: 'fretboard-master', 
      title: 'Mestre do Braço', 
      desc: 'Encontre as notas no braço do violão/ukulele.', 
      icon: Zap, 
      color: 'bg-purple-500',
      xp: 120
    },
    { 
      id: 'musical-wheel', 
      title: 'Roda Musical', 
      desc: 'Gire a roda e descubra novos desafios.', 
      icon: Music, 
      color: 'bg-emerald-500',
      xp: 60
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-900">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-redhouse-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Central de Jogos</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aprenda música brincando na RedHouse</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <motion.button
            key={game.id}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(game.id as Tab)}
            className="bg-white p-8 rounded-[40px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-left group transition-all"
          >
            <div className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-6 transition-transform`}>
              <game.icon className="w-8 h-8" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{game.title}</h3>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black border border-emerald-100">
                <Trophy className="w-3 h-3" /> +{game.xp} XP
              </div>
            </div>
            <p className="text-slate-500 font-bold text-sm leading-snug mb-6">{game.desc}</p>
            <div className="flex items-center gap-2 text-redhouse-primary font-black uppercase text-xs">
              <Star className="w-4 h-4 fill-redhouse-primary" />
              Jogar Agora
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
