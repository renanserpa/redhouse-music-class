import { Guitar, Music, Star, Zap, Trophy, Heart, Ghost, Crown, Rocket, Flame, Moon, Sun, Home } from 'lucide-react';

export interface AvatarSkin {
  id: string;
  name: string;
  icon: any;
  price: number;
  type: 'head' | 'body' | 'instrument' | 'background';
  color: string;
}

export const SKINS: AvatarSkin[] = [
  // HEADS
  { id: 'h-default', name: 'Padrão', icon: Zap, price: 0, type: 'head', color: 'bg-slate-500' },
  { id: 'h-cool', name: 'Óculos Escuros', icon: Sun, price: 100, type: 'head', color: 'bg-blue-500' },
  { id: 'h-crown', name: 'Coroa de Rei', icon: Crown, price: 500, type: 'head', color: 'bg-yellow-500' },
  { id: 'h-ghost', name: 'Fantasma', icon: Ghost, price: 250, type: 'head', color: 'bg-slate-200' },
  { id: 'h-flame', name: 'Cabelo de Fogo', icon: Flame, price: 300, type: 'head', color: 'bg-orange-600' },

  // BODIES
  { id: 'b-default', name: 'Camiseta RedHouse', icon: Music, price: 0, type: 'body', color: 'bg-red-600' },
  { id: 'b-leather', name: 'Jaqueta de Couro', icon: Zap, price: 200, type: 'body', color: 'bg-slate-900' },
  { id: 'b-tux', name: 'Smoking', icon: Trophy, price: 400, type: 'body', color: 'bg-slate-800' },
  { id: 'b-space', name: 'Traje Espacial', icon: Rocket, price: 600, type: 'body', color: 'bg-slate-100' },

  // INSTRUMENTS
  { id: 'i-default', name: 'Violão Acústico', icon: Guitar, price: 0, type: 'instrument', color: 'bg-amber-700' },
  { id: 'i-electric', name: 'Guitarra Elétrica', icon: Zap, price: 300, type: 'instrument', color: 'bg-red-500' },
  { id: 'i-gold', name: 'Guitarra de Ouro', icon: Star, price: 1000, type: 'instrument', color: 'bg-yellow-400' },
  { id: 'i-neon', name: 'Baixo Neon', icon: Music, price: 450, type: 'instrument', color: 'bg-purple-500' },

  // BACKGROUNDS
  { id: 'bg-default', name: 'Estúdio', icon: Home, price: 0, type: 'background', color: 'bg-slate-800' },
  { id: 'bg-stage', name: 'Palco Principal', icon: Trophy, price: 500, type: 'background', color: 'bg-purple-900' },
  { id: 'bg-space', name: 'Galáxia', icon: Moon, price: 800, type: 'background', color: 'bg-black' },
  { id: 'bg-beach', name: 'Praia', icon: Sun, price: 300, type: 'background', color: 'bg-cyan-400' },
];
