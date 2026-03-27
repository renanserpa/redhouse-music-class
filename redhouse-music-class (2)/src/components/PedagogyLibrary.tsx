import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, BookOpen, Filter, Search, Zap, Star, Info } from 'lucide-react';
import { CHORD_LIBRARY, PEDAGOGICAL_ACTIVITIES } from '../lib/pedagogyData';
import { InstrumentType } from '../types';

export default function PedagogyLibrary() {
  const [instrumentFilter, setInstrumentFilter] = useState<InstrumentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChords = CHORD_LIBRARY.filter(chord => 
    (instrumentFilter === 'all' || chord.instrument === instrumentFilter) &&
    chord.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = PEDAGOGICAL_ACTIVITIES.filter(act => 
    (instrumentFilter === 'all' || act.instruments.includes(instrumentFilter as InstrumentType)) &&
    (act.title.toLowerCase().includes(searchQuery.toLowerCase()) || act.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header & Controls */}
      <div className="glass-card p-8 hud-gradient">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pedagogy-blue/20 rounded-2xl flex items-center justify-center text-pedagogy-blue shadow-lg">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-redhouse-text uppercase italic tracking-tighter">Biblioteca Pedagógica</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-redhouse-muted uppercase tracking-widest">RedHouse Music Class – Conteúdos & Atividades</p>
                <div className="flex items-center gap-1 bg-pedagogy-blue/10 text-pedagogy-blue px-2 py-0.5 rounded-full text-[8px] font-black border border-pedagogy-blue/20">
                  <Info className="w-2 h-2" /> SOURCE: NOTEBOOKLM
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-redhouse-muted" />
              </div>
              <input 
                type="text"
                placeholder="Buscar conteúdo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-redhouse-text focus:ring-2 focus:ring-redhouse-primary/50 transition-all outline-none"
              />
            </div>

            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
              {(['all', 'violao', 'ukulele'] as const).map(inst => (
                <button
                  key={inst}
                  onClick={() => setInstrumentFilter(inst)}
                  className={`px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${
                    instrumentFilter === inst ? 'bg-redhouse-primary text-white shadow-md' : 'text-redhouse-muted hover:text-white'
                  }`}
                >
                  {inst === 'all' ? 'Todos' : inst}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Chord Library */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-pedagogy-yellow" />
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Dicionário de Acordes</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredChords.map(chord => (
              <motion.div 
                key={chord.id}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-black text-redhouse-text">{chord.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    chord.instrument === 'violao' ? 'bg-pedagogy-blue/10 text-pedagogy-blue' : 'bg-pedagogy-orange/10 text-pedagogy-orange'
                  }`}>
                    {chord.instrument}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20" 
                    style={{ backgroundColor: chord.colorCode }}
                  ></div>
                  <span className="text-xs font-bold text-redhouse-muted uppercase tracking-widest">Note-to-Color</span>
                </div>
                <p className="text-sm font-bold text-redhouse-muted leading-tight">{chord.typicalUse}</p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black text-redhouse-muted/50 uppercase tracking-widest">Nível: {chord.difficulty}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Activities Library */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-pedagogy-orange" />
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Jogos & Dinâmicas</h3>
          </div>

          <div className="space-y-4">
            {filteredActivities.map(act => (
              <motion.div 
                key={act.id}
                whileHover={{ x: 6 }}
                className="glass-card p-6 flex gap-6 items-start"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-redhouse-text shrink-0 border border-white/10">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {act.instruments.map(i => (
                      <span key={i} className="text-[8px] font-black uppercase bg-white/5 text-redhouse-muted px-2 py-0.5 rounded-md border border-white/5">{i}</span>
                    ))}
                    <span className="text-[8px] font-black uppercase bg-redhouse-primary/20 text-redhouse-primary px-2 py-0.5 rounded-md">{act.focus}</span>
                  </div>
                  <h4 className="text-xl font-black text-redhouse-text mb-2">{act.title}</h4>
                  <p className="text-sm font-bold text-redhouse-muted leading-snug mb-4">{act.description}</p>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-black text-pedagogy-blue uppercase tracking-widest mb-1">Objetivo Pedagógico:</p>
                    <p className="text-xs font-bold text-redhouse-muted italic">{act.pedagogicalObjective}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Pedagogical Note */}
      <div className="bg-pedagogy-blue/5 p-6 rounded-3xl border border-pedagogy-blue/10 flex items-start gap-4">
        <div className="w-10 h-10 bg-pedagogy-blue rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-black text-pedagogy-blue uppercase tracking-tighter mb-1">Nota Pedagógica (Source of Truth)</h4>
          <p className="text-xs font-bold text-redhouse-muted leading-relaxed">
            Todos os conteúdos, jogos e dinâmicas desta biblioteca são baseados nas diretrizes pedagógicas do 
            <strong> RedHouse Music Notebook</strong>. As atividades foram adaptadas para o contexto de ensino coletivo 
            de violão e ukulele, focando na ludicidade para crianças pequenas e no alinhamento com a identidade 
            internacional da Red House.
          </p>
        </div>
      </div>
    </div>
  );
}
