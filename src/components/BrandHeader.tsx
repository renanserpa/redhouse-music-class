import React from 'react';
import { Music, Zap, Coins } from 'lucide-react';

interface BrandHeaderProps {
  variant?: 'default' | 'compact' | 'institutional';
  showCampus?: boolean;
  userRole?: 'dev' | 'teacher' | 'director' | 'student' | 'parent' | 'admin';
  xp?: number;
  coins?: number;
}

export default function BrandHeader({ 
  variant = 'default', 
  showCampus = true,
  userRole = 'student',
  xp = 0,
  coins = 0
}: BrandHeaderProps) {
  const isInstitutional = variant === 'institutional';
  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center justify-between w-full ${isInstitutional ? 'mb-8' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Logo Placeholder - Representing Red House Logo with a house-like shape */}
        <div className={`
          ${isCompact ? 'w-10 h-10 text-[7px]' : 'w-14 h-14 text-[9px]'} 
          bg-redhouse-primary rounded-lg flex flex-col items-center justify-center text-white font-black text-center leading-tight p-1 shadow-lg border-2 border-white/20 shrink-0 relative
        `}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[8px] border-l-transparent border-r-transparent border-b-redhouse-primary drop-shadow-[0_0_10px_rgba(220,10,45,0.5)]"></div>
          <span className="mt-1 font-black leading-tight drop-shadow-md">RED</span>
          <span className="font-black leading-tight drop-shadow-md">HOUSE</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className={`font-black ${isCompact ? 'text-sm' : 'text-2xl'} leading-none tracking-tighter text-redhouse-blue dark:text-white flex items-center gap-2`}>
              REDHOUSE 
              <span className="text-redhouse-primary italic drop-shadow-[0_0_8px_rgba(220,10,45,0.3)]">MUSIC CLASS</span>
            </h1>
            {!isCompact && (
              <div className="bg-redhouse-primary/10 text-redhouse-primary px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-redhouse-primary/20">
                Bilingual_OS
              </div>
            )}
          </div>
          {showCampus && (
            <div className="flex flex-col">
              <span className={`${isCompact ? 'text-[7px]' : 'text-[10px]'} font-black text-redhouse-muted uppercase tracking-widest`}>
                Red House International School
              </span>
              <span className={`${isCompact ? 'text-[7px]' : 'text-[10px]'} font-bold text-redhouse-primary uppercase tracking-tighter`}>
                Campus Cuiabá
              </span>
            </div>
          )}
        </div>
      </div>

      {userRole === 'student' && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-pedagogy-blue/10 dark:bg-pedagogy-blue/20 rounded-full border border-pedagogy-blue/20">
            <Zap className="w-3 h-3 text-pedagogy-blue" />
            <span className="text-[10px] font-black text-pedagogy-blue uppercase leading-none">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-pedagogy-yellow/10 dark:bg-pedagogy-yellow/20 rounded-full border border-pedagogy-yellow/20">
            <Coins className="w-3 h-3 text-pedagogy-yellow-dark dark:text-pedagogy-yellow" />
            <span className="text-[10px] font-black text-pedagogy-yellow-dark dark:text-pedagogy-yellow uppercase leading-none">{coins}</span>
          </div>
        </div>
      )}
    </div>
  );
}
