import React from 'react';
import { Music, Layout, Sparkles, History, ArrowRight, Zap } from 'lucide-react';

interface AppSelectorProps {
  onSelect: (version: 'v2' | 'v1' | 'v3') => void;
}

export const AppSelector: React.FC<AppSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
            RED HOUSE <span className="text-redhouse-primary">MUSIC CLASS</span>
          </h1>
          <p className="text-slate-400 text-lg">Selecione a versão do sistema para iniciar</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Versão Atual (V2) */}
          <button 
            onClick={() => onSelect('v2')}
            className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left transition-all hover:border-redhouse-primary hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-redhouse-primary/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 bg-redhouse-primary/10 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="text-redhouse-primary w-6 h-6" />
            </div>
            
            <div className="w-16 h-16 bg-redhouse-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layout className="text-white w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Versão Atual (V2)</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Sistema completo com novas dinâmicas, Presentation Page e Songwriter Studio. Recomendado para uso diário.
            </p>
            
            <div className="flex items-center text-redhouse-primary font-bold group-hover:gap-2 transition-all">
              INICIAR V2 <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>

          {/* Versão GMC (V3) */}
          <button 
            onClick={() => onSelect('v3')}
            className="group relative bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left transition-all hover:border-emerald-500 hover:bg-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="text-white w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Versão GMC (V3)</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Estado atual do projeto gmc-v2. Ideal para análise técnica e verificação de novas arquiteturas de dados.
            </p>
            
            <div className="flex items-center text-emerald-500 font-bold group-hover:gap-2 transition-all">
              ANLISAR V3 <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>

          {/* Versão Legada (V1) */}
          <button 
            onClick={() => onSelect('v1')}
            className="group bg-slate-900 border border-slate-800 p-8 rounded-3xl text-left transition-all hover:border-slate-500 hover:bg-slate-800/50"
          >
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <History className="text-white w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Versão v1.0</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Acesso à primeira versão do sistema. Útil para consulta de relatórios antigos ou funcionalidades legadas.
            </p>
            
            <div className="flex items-center text-slate-400 font-bold group-hover:text-white transition-all">
              ABRIR LEGADO <ArrowRight className="ml-2 w-5 h-5" />
            </div>
          </button>
        </div>

        <footer className="mt-16 text-center text-slate-600 text-sm">
          Red House Music Class &copy; 2026 • Powered by Olie Music EdTech
        </footer>
      </div>
    </div>
  );
};
