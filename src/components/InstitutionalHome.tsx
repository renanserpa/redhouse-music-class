import React from 'react';
import { Music, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import BrandHeader from './BrandHeader';

export default function InstitutionalHome() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F14] text-slate-900 dark:text-white selection:bg-redhouse-primary selection:text-white">
      {/* Hero Section */}
      <header className="p-6 lg:p-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <BrandHeader showCampus={false} variant="default" />
        <div className="flex gap-4">
          <a href="/dev" className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 rounded-full font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Acesso Dev</a>
          <a href="/redhouse" className="px-6 py-2.5 bg-redhouse-primary text-white rounded-full font-bold text-sm shadow-lg shadow-redhouse-primary/20 hover:scale-105 transition-all">Ver RedHouse</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-pulse">
          <Zap className="w-3 h-3" />
          OlieMusic Portal em Construção
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-8 leading-[0.9]">
          O Futuro da <span className="text-redhouse-primary">Educação Musical</span> começa aqui.
        </h1>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
          Estamos construindo um ecossistema digital completo para transformar a forma como o mundo aprende música. Em breve, um novo portal institucional.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/2">
            <Globe className="w-10 h-10 text-redhouse-primary mb-4" />
            <h3 className="font-black uppercase italic text-lg mb-2">Plataforma Global</h3>
            <p className="text-sm text-slate-500">Tecnologia bilíngue desenhada para escolas de música de alto nível.</p>
          </div>
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/2">
            <Shield className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="font-black uppercase italic text-lg mb-2">Ecossistema Olie</h3>
            <p className="text-sm text-slate-500">Gestão, pedagogia e entretenimento musical em um único lugar.</p>
          </div>
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/2">
            <Music className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="font-black uppercase italic text-lg mb-2">RedHouse OS</h3>
            <p className="text-sm text-slate-500">O sistema operacional que potencializa o método RedHouse.</p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">© 2026 OlieMusic Group // Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
