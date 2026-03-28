/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { AppState } from '../types';
import { Printer, FileText, CheckCircle2, Download, Target } from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

interface ActivityStudioProps {
  state: AppState;
}

export default function ActivityStudio({ state }: ActivityStudioProps) {
  const [selectedActivity, setSelectedActivity] = useState('intro');
  const [isTecherMode, setIsTeacherMode] = useState(true);

  const chartData = [
    { subject: 'Técnica', A: state.stats.tech, fullMark: 100 },
    { subject: 'Ritmo', A: state.stats.rhythm, fullMark: 100 },
    { subject: 'Teoria', A: state.stats.theory, fullMark: 100 },
    { subject: 'Repertório', A: state.stats.repertoire, fullMark: 100 },
    { subject: 'Expressão', A: state.stats.expression, fullMark: 100 },
  ];

  const activities = [
    { id: 'intro', label: 'Módulo 0: Apresentação', icon: FileText, color: 'var(--color-pedagogy-orange)' },
    { id: 'anatomy', label: 'Módulo 1: Anatomia do Violão', icon: FileText, color: 'var(--color-pedagogy-blue)' },
    { id: 'rhythm', label: 'Módulo 2: Desafio Konnakkol', icon: FileText, color: 'var(--color-pedagogy-purple)' },
    { id: 'spider', label: 'Módulo 2: Caminhada da Aranha', icon: FileText, color: 'var(--color-pedagogy-green)' },
    { id: 'report', label: 'Relatório de Evolução (Radar)', icon: Target, color: 'var(--color-pedagogy-blue)' },
    { id: 'certificate', label: 'Certificado de Conclusão', icon: CheckCircle2, color: 'var(--color-pedagogy-orange)' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12">
      {/* HUD Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-pedagogy-orange rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pedagogy-orange/30 rotate-3 border border-white/20">
            <Printer className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-4xl font-black text-redhouse-text uppercase italic leading-none tracking-tighter">Creative Lab HUD</h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-pedagogy-orange/10 text-pedagogy-orange rounded-full border border-pedagogy-orange/20">
                <div className="w-2 h-2 bg-pedagogy-orange rounded-full shadow-[0_0_8px_var(--color-pedagogy-orange)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Estúdio de Impressão: Ready</span>
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

        <button 
          onClick={handlePrint}
          className="bg-white text-slate-900 px-10 py-5 rounded-[20px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl flex items-center gap-3 border-none group"
        >
          <Printer className="w-6 h-6 group-hover:scale-90 transition-transform" />
          DISPARAR IMPRESSÃO
        </button>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 space-y-6">
          <h4 className="text-[8px] font-black text-redhouse-muted uppercase tracking-[0.4em] ml-2 italic">Database: Módulos Disponíveis</h4>
          <div className="space-y-3">
            {activities.map(activity => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                className={`w-full flex items-center justify-between p-6 rounded-[25px] font-black transition-all border-2 group relative overflow-hidden ${
                  selectedActivity === activity.id 
                    ? 'bg-white/10 border-white/20 shadow-xl' 
                    : 'bg-white/2 border-white/5 text-redhouse-muted hover:border-white/10 hover:bg-white/4'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10 text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedActivity === activity.id ? 'bg-white text-slate-900 shadow-[0_0_15px_white]' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs uppercase italic tracking-tight ${selectedActivity === activity.id ? 'text-redhouse-text' : 'text-redhouse-muted group-hover:text-redhouse-text'}`}>
                    {activity.label}
                  </span>
                </div>
                {selectedActivity === activity.id && (
                  <motion.div layoutId="active-indicator" className="w-2 h-2 bg-pedagogy-orange rounded-full shadow-[0_0_10px_var(--color-pedagogy-orange)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workbench Preview Area */}
        <div className="lg:col-span-3 glass-card p-12 relative overflow-hidden min-h-[650px] flex flex-col items-center justify-center border-white/5 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pedagogy-orange/5 blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-redhouse-accent/5 blur-[120px] -z-10" />
          
          {/* HUD Annotations */}
          <div className="absolute top-8 left-8 text-[8px] font-black text-redhouse-muted uppercase tracking-widest italic flex items-center gap-4">
             <div className="w-2 h-2 bg-pedagogy-orange rounded-full animate-pulse" />
             LIVE_PREVIEW: 300_DPI // CMYK_READY
          </div>
          
          {/* Print Preview Canvas */}
          <motion.div 
            key={selectedActivity}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-[500px] aspect-[1/1.414] shadow-[0_45px_100px_rgba(0,0,0,0.6)] rounded-sm p-12 flex flex-col border-[12px] border-white text-slate-950 relative"
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-10 pointer-events-none" />

            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center text-white font-black text-sm">R</div>
                <h1 className="font-black text-[10px] tracking-tighter uppercase leading-none">REDHOUSE<br/><span className="text-pedagogy-orange">MUSIC CLASS</span></h1>
              </div>
              <div className="text-right">
                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Protocolo: {selectedActivity.toUpperCase()}</div>
                <div className="text-[7px] font-black text-slate-950 uppercase tracking-widest mt-1">Sessão: 2026_RED_CUI</div>
              </div>
            </div>

            <div className="flex-1 space-y-6 relative z-10">
              <div className="h-10 border-b border-slate-200 flex items-end pb-2">
                <span className="text-[9px] font-black text-slate-300 uppercase mr-3">Explorer:</span>
                <span className="text-sm font-black text-slate-900 italic">{state.studentName}</span>
              </div>

              {selectedActivity === 'intro' && (
                <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-3xl font-black text-slate-950 uppercase leading-none italic tracking-tighter">PASSAPORTE<br/><span className="text-pedagogy-orange">D’O GIGANTE</span></h2>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Bem-vindo à sua jornada musical! Este é o seu portal para o domínio instrumental. Cada módulo concluído adiciona um novo deck ao seu arsenal.</p>
                  <div className="aspect-video border-[3px] border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-200 italic text-center p-8 uppercase tracking-widest">
                    [ ÁREA DE EXPRESSÃO: DESENHE SEU INSTRUMENTO ]
                  </div>
                </div>
              )}

              {selectedActivity === 'anatomy' && (
                <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-3xl font-black text-slate-950 uppercase leading-none italic tracking-tighter">ANATOMIA<br/><span className="text-pedagogy-blue">TECNOLÓGICA</span></h2>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Mapeie os componentes estruturais do violão. A compreensão física é a base da precisão sonora.</p>
                  <div className="aspect-video border-[3px] border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-200 italic text-center p-8 uppercase tracking-widest">
                    [ DIAGRAMA TÉCNICO DE CONEXÃO ]
                  </div>
                </div>
              )}

              {selectedActivity === 'report' && (
                <div className="space-y-6 py-4 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-black text-slate-950 uppercase leading-none italic tracking-tighter">RADAR DE<br/><span className="text-pedagogy-blue">EVOLUÇÃO</span></h2>
                  </div>
                  
                  <div className="flex-1 min-h-[300px] bg-slate-50 rounded-3xl border border-slate-100 p-6 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                        <Radar
                          name="Habilidades"
                          dataKey="A"
                          stroke="var(--color-pedagogy-orange)"
                          strokeWidth={3}
                          fill="var(--color-pedagogy-orange)"
                          fillOpacity={0.15}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Ponto Dominante</p>
                      <p className="text-sm font-black text-emerald-600 uppercase italic">Expressão : {state.stats.expression}%</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">Vetor de Upgrade</p>
                      <p className="text-sm font-black text-redhouse-accent uppercase italic">Ritmo : {state.stats.rhythm}%</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedActivity === 'certificate' && (
                <div className="flex flex-col items-center justify-center h-full text-center border-[8px] border-double border-slate-100 p-10 rounded-3xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="text-pedagogy-orange font-black text-[9px] tracking-[0.4em] uppercase mb-4 italic">Official Academic Recognition</h4>
                  <h2 className="text-4xl font-black text-slate-950 uppercase mb-6 tracking-tighter leading-none italic">MISSION<br/>ACCOMPLISHED</h2>
                  <div className="w-16 h-px bg-slate-200 mb-6" />
                  <p className="text-[9px] italic text-slate-400 font-bold mb-6 uppercase tracking-widest">Conceded for Excellence to:</p>
                  <h3 className="text-3xl font-black text-pedagogy-blue border-b-4 border-pedagogy-blue/10 px-8 pb-3 mb-8 italic tracking-tight uppercase leading-none">{state.studentName}</h3>
                  <p className="text-[10px] text-slate-500 font-bold max-w-[200px] leading-relaxed uppercase tracking-tighter italic">
                    Pela maestria técnica e dedicação à arte do violão contemporâneo.
                  </p>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center text-4xl opacity-20 rotate-12 font-black text-slate-950 border border-slate-200">
                    GMC
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center opacity-40 grayscale relative z-10">
              <span className="text-[7px] font-black uppercase italic tracking-tighter">AI_ENGINE v5.0 // NEURAL_OS</span>
              <span className="text-[7px] font-black uppercase italic tracking-tighter">Mestre: Renan Serpa</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bench Tools Footer */}
      <footer className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: Target, label: 'Analytics', desc: 'Sincronizar Radar', color: 'bg-pedagogy-blue' },
          { icon: Download, label: 'Download', desc: 'Exportar PDF Full', color: 'bg-pedagogy-purple' },
          { icon: FileText, label: 'Metadata', desc: 'Ver Tags Pedagógicas', color: 'bg-pedagogy-green' },
          { icon: Printer, label: 'Spooler', desc: 'Fila de Impressão', color: 'bg-pedagogy-orange' }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-10 border-white/5 group hover:border-white/10 transition-all bg-white/2 relative overflow-hidden cursor-pointer">
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.color}/10 blur-[40px] -z-10`} />
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${item.color}/10 rounded-2xl flex items-center justify-center text-white border border-white/5 group-hover:border-white/20 transition-all`}>
                <item.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black uppercase italic text-redhouse-text text-lg transition-all group-hover:translate-x-1">{item.label}</h4>
                <p className="text-[9px] font-bold text-redhouse-muted uppercase tracking-[0.2em] mt-1 italic leading-none">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </footer>

      {/* Pedagogical Manual Footer */}
      <div className="mt-8 glass-card p-12 border-white/5 flex items-start gap-10 bg-pedagogy-orange/5 relative overflow-hidden ring-1 ring-pedagogy-orange/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pedagogy-orange/5 blur-[120px] -z-10" />
        <div className="w-24 h-24 glass-card border-white/10 flex items-center justify-center text-5xl shadow-2xl shrink-0 rotate-6">🖨️</div>
        <div>
          <h4 className="font-black text-redhouse-text text-2xl mb-4 italic uppercase tracking-tight">Manual do Maestro: Creative Lab</h4>
          <p className="text-redhouse-muted font-bold leading-relaxed max-w-3xl italic text-lg">
            "A materialização do conhecimento é um ritual sagrado. Este estúdio permite converter bytes pedagógicos em documentos físicos tangíveis. Use o radar de evolução para diagnosticar upgrades e o certificado para selar o sucesso da missão."
          </p>
        </div>
      </div>
    </div>
  );
}
